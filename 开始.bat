@echo off
cd /d "%~dp0"
set PS1=start.ps1
if exist "%PS1%" (
    powershell -NoProfile -ExecutionPolicy Bypass -Command "& { $c = Get-Content '%PS1%' -Raw -Encoding UTF8; if ($c) { Invoke-Expression $c } else { Write-Host 'Error: empty script' -ForegroundColor Red; pause } }"
) else (
    echo start.ps1 not found
    pause
)
