@echo off
setlocal enabledelayedexpansion
title English Learning Station

REM Colors (Windows 10+ ANSI support)
for /F %%a in ('echo prompt $E^| cmd') do set "ESC=%%a"
set "CYAN=!ESC![96m"
set "BOLD=!ESC![1m"
set "RESET=!ESC![0m"

:main_menu
cls
echo ============================================
echo    English Learning Station - Launcher
echo ============================================
echo.
echo    [1] Quick Start (daily use)
echo    [2] Update Data and Start (after seed.js changed)
echo    [3] Check Environment and Start (first time / issues)
echo    [0] Exit
echo.
echo ============================================
echo.

set /p choice=Select [0-3]:

if "%choice%"=="1" goto quick_start
if "%choice%"=="2" goto update_and_start
if "%choice%"=="3" goto check_and_start
if "%choice%"=="0" goto end

echo [ERROR] Invalid option!
timeout /t 2 >nul
goto main_menu

REM ============================================
REM [1] Quick Start
REM ============================================
:quick_start
cls
echo ============================================
echo    Quick Start Mode
echo ============================================
echo.
echo    Server: !BOLD!!CYAN!http://localhost:3000!RESET!
echo    Press Ctrl+C to stop
echo.
echo ============================================
echo.

call npm run dev

if !errorlevel! neq 0 (
    echo.
    echo [ERROR] Start failed! Try option [3]
    pause
)
goto main_menu

REM ============================================
REM [2] Update Data and Start
REM ============================================
:update_and_start
cls
echo ============================================
echo    Update Data and Start Mode
echo ============================================
echo.

echo [1/2] Importing seed data...
call npm run seed-db
if !errorlevel! neq 0 (
    echo [ERROR] Seed import failed!
    pause
    goto main_menu
)
echo       Done! 497 words, 38 knowledge, 13 questions

echo.
echo [2/2] Starting server...
echo.
echo    Server: !BOLD!!CYAN!http://localhost:3000!RESET!
echo    Press Ctrl+C to stop
echo.
echo ============================================
echo.

call npm run dev

if !errorlevel! neq 0 (
    echo.
    echo [ERROR] Start failed!
    pause
)
goto main_menu

REM ============================================
REM [3] Check Environment and Start
REM ============================================
:check_and_start
cls
echo ============================================
echo    Check Environment and Start Mode
echo ============================================
echo.

echo [1/5] Checking Node.js...
where node >nul 2>&1
if !errorlevel! neq 0 (
    echo [ERROR] Node.js not found! Install v18+
    pause
    goto main_menu
)
for /f "tokens=*" %%v in ('node -v') do set NODE_VER=%%v
echo       Node.js: !NODE_VER! OK

echo.
echo [2/5] Checking npm...
where npm >nul 2>&1
if !errorlevel! neq 0 (
    echo [ERROR] npm not found!
    pause
    goto main_menu
)
for /f "tokens=*" %%v in ('npm -v') do set NPM_VER=%%v
echo       npm: !NPM_VER! OK

echo.
echo [3/5] Checking dependencies...
if not exist "%~dp0node_modules" (
    echo       Installing dependencies...
    call npm install
    if !errorlevel! neq 0 (
        echo [ERROR] Install failed!
        pause
        goto main_menu
    )
    echo       Dependencies installed!
) else (
    echo       Dependencies OK
)

echo.
echo [4/5] Checking .env...
if not exist "%~dp0.env" (
    if exist "%~dp0.env.example" (
        copy "%~dp0.env.example" "%~dp0.env" >nul
        echo       Created .env (set JWT_SECRET)
    ) else (
        echo [WARN] .env.example not found
    )
) else (
    echo       .env OK
)

echo.
echo [5/5] Checking database...
if not exist "%~dp0data\learning.db" (
    echo       Initializing database...
    call npm run init-db
    if !errorlevel! neq 0 (
        echo [ERROR] Database init failed!
        pause
        goto main_menu
    )
    call npm run seed-db
    if !errorlevel! neq 0 (
        echo [WARN] Seed may have issues
    )
    echo       Database initialized!
) else (
    echo       Database OK
)

echo.
echo ============================================
echo    Environment OK! Starting server...
echo ============================================
echo.
echo    Server: !BOLD!!CYAN!http://localhost:3000!RESET!
echo    Press Ctrl+C to stop
echo.
echo ============================================
echo.

call npm run dev

if !errorlevel! neq 0 (
    echo.
    echo [ERROR] Start failed!
    pause
)
goto main_menu

REM ============================================
REM Exit
REM ============================================
:end
cls
echo.
echo ============================================
echo    Thanks for using English Learning Station!
echo ============================================
echo.
timeout /t 1 >nul
exit