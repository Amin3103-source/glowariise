#!/bin/bash
# GlowArise Daemon — pfctl IP blocking + hosts file
CMD_FILE="/tmp/glowariise.cmd"
ANCHOR="com.glowariise"
ANCHOR_FILE="/etc/pf.anchors/glowariise"
HOSTS_PATH="/etc/hosts"
TAG_S="# GlowArise START"
TAG_E="# GlowArise END"

mkdir -p /etc/pf.anchors

flush_dns() {
  dscacheutil -flushcache 2>/dev/null || true
  killall -HUP mDNSResponder 2>/dev/null || true
}

strip_hosts() {
  local tmp=$(mktemp)
  awk "/^${TAG_S}$/{skip=1} !skip{print} /^${TAG_E}$/{skip=0}" "$HOSTS_PATH" > "$tmp"
  cat "$tmp" > "$HOSTS_PATH"
  rm -f "$tmp"
}

resolve_ips() {
  local domain="$1"
  dig +short A "$domain" 2>/dev/null | grep -E '^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$'
}

block_domains() {
  local domains=("$@")

  # 1. Write /etc/hosts
  strip_hosts
  printf "\n%s\n" "$TAG_S" >> "$HOSTS_PATH"
  for d in "${domains[@]}"; do
    c="${d#www.}"; c="${c#m.}"
    printf "0.0.0.0 %s\n0.0.0.0 www.%s\n0.0.0.0 m.%s\n" "$c" "$c" "$c" >> "$HOSTS_PATH"
    printf "::1 %s\n::1 www.%s\n" "$c" "$c" >> "$HOSTS_PATH"
  done
  printf "%s\n" "$TAG_E" >> "$HOSTS_PATH"

  # 2. pfctl rules — blocks by IP, Safari CANNOT bypass
  > "$ANCHOR_FILE"
  for d in "${domains[@]}"; do
    c="${d#www.}"; c="${c#m.}"
    TABLE="$(echo "$c" | tr '.-' '__')"
    IPS=$(resolve_ips "$c"; resolve_ips "www.$c")
    IPS=$(echo "$IPS" | sort -u | grep -v '^$')
    if [ -n "$IPS" ]; then
      ENTRIES=$(echo "$IPS" | tr '\n' ' ')
      printf "table <%s> persist { %s}\n" "$TABLE" "$ENTRIES" >> "$ANCHOR_FILE"
      printf "block drop out quick proto tcp to <%s> port {80,443}\n" "$TABLE" >> "$ANCHOR_FILE"
      printf "block drop out quick proto udp to <%s> port {80,443,853}\n" "$TABLE" >> "$ANCHOR_FILE"
    fi
  done

  # 3. Load anchor
  pfctl -e 2>/dev/null || true
  pfctl -a "$ANCHOR" -f "$ANCHOR_FILE" 2>/dev/null || true
  if ! grep -q "$ANCHOR" /etc/pf.conf 2>/dev/null; then
    printf '\nanchor "%s"\nload anchor "%s" from "%s"\n' "$ANCHOR" "$ANCHOR" "$ANCHOR_FILE" >> /etc/pf.conf
    pfctl -f /etc/pf.conf 2>/dev/null || true
  fi

  flush_dns

  # 4. Close Safari tabs
  CHECKS=""
  for d in "${domains[@]}"; do
    c="${d#www.}"; c="${c#m.}"
    CHECKS="${CHECKS}(URL of t contains \"${c}\") or "
  done
  CHECKS="${CHECKS% or }"
  [ -n "$CHECKS" ] && osascript << EOF 2>/dev/null || true
tell application "Safari"
  try
    repeat with w in every window
      set tc to {}
      repeat with t in every tab of w
        try
          if ${CHECKS} then set end of tc to t
        end try
      end repeat
      repeat with t in tc
        close t
      end repeat
    end repeat
  end try
end tell
EOF
}

unblock_all() {
  pfctl -a "$ANCHOR" -F all 2>/dev/null || true
  printf '' > "$ANCHOR_FILE"
  strip_hosts
  flush_dns
}

echo "ready" > /tmp/glowariise.status

while true; do
  if [ -f "$CMD_FILE" ]; then
    CMD=$(cat "$CMD_FILE" 2>/dev/null)
    rm -f "$CMD_FILE"
    [ -z "$CMD" ] && sleep 0.3 && continue

    ACTION=$(echo "$CMD" | cut -d' ' -f1)
    DOMAINS_STR=$(echo "$CMD" | cut -d' ' -f2-)

    case "$ACTION" in
      block)
        IFS=',' read -ra DL <<< "$DOMAINS_STR"
        block_domains "${DL[@]}"
        echo "blocked" > /tmp/glowariise.status
        ;;
      unblock)
        unblock_all
        echo "unblocked" > /tmp/glowariise.status
        ;;
      ping)  echo "pong" > /tmp/glowariise.status ;;
      stop)  unblock_all; exit 0 ;;
    esac
  fi
  sleep 0.3
done
