#!/bin/bash
# GlowArise Setup — einmalig mit Admin-Rechten ausführen
BLOCKER_SRC="$1"
FIXED_PATH="/usr/local/bin/glowariise-blocker"
SUDOERS_FILE="/etc/sudoers.d/glowariise"

# Zielordner erstellen falls nicht vorhanden
mkdir -p /usr/local/bin

# Skript an festen Ort kopieren
cp "$BLOCKER_SRC" "$FIXED_PATH"
chmod +x "$FIXED_PATH"
chown root:wheel "$FIXED_PATH"

# Sudoers Eintrag mit festem Pfad
echo "ALL ALL=(root) NOPASSWD: $FIXED_PATH" > "$SUDOERS_FILE"
chmod 440 "$SUDOERS_FILE"

# Validieren
if visudo -c -f "$SUDOERS_FILE" 2>/dev/null; then
  echo "SETUP_OK"
else
  rm -f "$SUDOERS_FILE"
  echo "SETUP_FAILED"
fi
