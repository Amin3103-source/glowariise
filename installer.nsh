!macro customUnInstall
  nsExec::ExecToLog 'powershell -Command "Get-Content \"$env:SystemRoot\System32\drivers\etc\hosts\" | Where-Object { $_ -notmatch \"GlowArise\" } | Set-Content \"$env:SystemRoot\System32\drivers\etc\hosts\"; ipconfig /flushdns"'
  DetailPrint "GlowArise Einträge entfernt."
!macroend

!macro customInstall
  DetailPrint "GlowArise wird installiert..."
!macroend
