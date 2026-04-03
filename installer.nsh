!macro customUnInstall
  nsExec::ExecToLog 'powershell -Command "& { $hostsPath = \"$env:SystemRoot\System32\drivers\etc\hosts\"; $content = Get-Content $hostsPath -Raw; $cleaned = $content -replace \"(?s)# GlowArise START.*?# GlowArise END\", \"\"; Set-Content $hostsPath $cleaned -NoNewline; ipconfig /flushdns }"'
  DetailPrint "GlowArise Einträge aus hosts-Datei entfernt."
!macroend

!macro customInstall
  DetailPrint "GlowArise wird installiert..."
!macroend
