!macro customUnInstall
  nsExec::ExecToLog 'cmd /c "powershell -NoProfile -ExecutionPolicy Bypass -Command \"(Get-Content C:\Windows\System32\drivers\etc\hosts) | Where-Object {$_ -notmatch 'GlowArise'} | Set-Content C:\Windows\System32\drivers\etc\hosts\""'
!macroend

!macro customInstall
!macroend
