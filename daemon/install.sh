#!/bin/bash
# GlowArise — einmalige Installation (läuft einmal mit Admin-Rechten)
DAEMON_SRC="$1"
PLIST_SRC="$2"
DAEMON_DEST="/usr/local/bin/glowariise-daemon"
PLIST_DEST="/Library/LaunchDaemons/de.aliamin.glowariise.plist"

# Zielordner erstellen
mkdir -p /usr/local/bin

# Daemon kopieren
cp "$DAEMON_SRC" "$DAEMON_DEST"
chmod +x "$DAEMON_DEST"
chown root:wheel "$DAEMON_DEST"

# Plist kopieren
cp "$PLIST_SRC" "$PLIST_DEST"
chown root:wheel "$PLIST_DEST"
chmod 644 "$PLIST_DEST"

# Alten Daemon stoppen falls vorhanden
launchctl unload "$PLIST_DEST" 2>/dev/null || true

# Daemon laden und starten
launchctl load "$PLIST_DEST"

sleep 1

# Prüfen ob Daemon läuft
if launchctl list | grep -q "de.aliamin.glowariise"; then
  echo "INSTALL_OK"
else
  echo "INSTALL_FAILED"
fi
