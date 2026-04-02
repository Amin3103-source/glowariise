#!/bin/bash
# GlowArise Blocker Script — runs with admin rights
# Usage: blocker.sh start "domain1 domain2 domain3"
#        blocker.sh stop

ACTION=$1
DOMAINS=$2
ANCHOR_NAME="com.glowariise.block"
ANCHOR_FILE="/etc/pf.anchors/glowariise"
PF_CONF="/etc/pf.conf"

flush_dns() {
  dscacheutil -flushcache 2>/dev/null || true
  killall -HUP mDNSResponder 2>/dev/null || true
}

if [ "$ACTION" = "start" ]; then
  # Build pf anchor rules
  echo "" > "$ANCHOR_FILE"
  
  for DOMAIN in $DOMAINS; do
    CLEAN=$(echo "$DOMAIN" | sed 's/^www\.//')
    # Resolve domain to IP and block
    IPS=$(dig +short "$CLEAN" A 2>/dev/null | grep -E '^[0-9]')
    WWW_IPS=$(dig +short "www.$CLEAN" A 2>/dev/null | grep -E '^[0-9]')
    ALL_IPS=$(echo -e "$IPS\n$WWW_IPS" | sort -u | grep -v '^$')
    
    if [ -n "$ALL_IPS" ]; then
      TABLE_NAME=$(echo "$CLEAN" | tr '.' '_' | tr '-' '_')
      echo "table <${TABLE_NAME}> { $ALL_IPS }" >> "$ANCHOR_FILE"
      echo "block drop out quick proto tcp to <${TABLE_NAME}> port {80, 443}" >> "$ANCHOR_FILE"
      echo "block drop in quick proto tcp from <${TABLE_NAME}> port {80, 443}" >> "$ANCHOR_FILE"
    fi
  done

  # Also write hosts file as backup
  HOSTS_BLOCK=""
  for DOMAIN in $DOMAINS; do
    CLEAN=$(echo "$DOMAIN" | sed 's/^www\.//')
    HOSTS_BLOCK="$HOSTS_BLOCK
0.0.0.0 $CLEAN
0.0.0.0 www.$CLEAN
0.0.0.0 m.$CLEAN"
  done

  # Remove old block, add new
  sed -i '' '/# GlowArise START/,/# GlowArise END/d' /etc/hosts
  printf "\n# GlowArise START%s\n# GlowArise END\n" "$HOSTS_BLOCK" >> /etc/hosts

  # Load pf anchor
  # Add anchor to pf.conf if not present
  if ! grep -q "$ANCHOR_NAME" "$PF_CONF"; then
    echo "anchor \"$ANCHOR_NAME\"" >> "$PF_CONF"
    echo "load anchor \"$ANCHOR_NAME\" from \"$ANCHOR_FILE\"" >> "$PF_CONF"
  fi

  pfctl -f "$PF_CONF" 2>/dev/null || true
  pfctl -a "$ANCHOR_NAME" -f "$ANCHOR_FILE" 2>/dev/null || true
  pfctl -e 2>/dev/null || true

  flush_dns

  # Close Safari tabs for blocked domains
  osascript << APPLESCRIPT
tell application "Safari"
  try
    repeat with w in every window
      repeat with t in every tab of w
        try
          set u to URL of t
          set blocked to false
APPLESCRIPT

  for DOMAIN in $DOMAINS; do
    CLEAN=$(echo "$DOMAIN" | sed 's/^www\.//')
    cat << APPLESCRIPT
          if u contains "$CLEAN" then set blocked to true
APPLESCRIPT
  done

  cat << APPLESCRIPT
          if blocked then close t
        end try
      end repeat
    end repeat
  end try
end tell
APPLESCRIPT

  echo "BLOCKING_ACTIVE"

elif [ "$ACTION" = "stop" ]; then
  # Remove pf anchor
  pfctl -a "$ANCHOR_NAME" -F all 2>/dev/null || true

  # Remove hosts entries
  sed -i '' '/# GlowArise START/,/# GlowArise END/d' /etc/hosts

  flush_dns
  echo "BLOCKING_STOPPED"
fi
