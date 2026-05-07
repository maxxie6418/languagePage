@echo off
title English Learning Station

:main_menu
cls
echo ============================================
echo    English Learning Station - Launcher
echo ============================================
echo.
echo   [1] Init Project (First Time)
echo   [2] Start Dev Server
echo   [3] Start Production Server
echo   [4] Init Database
echo   [5] Import Sample Data
echo   [0] Exit
echo.
echo ============================================
echo.

set /p choice=Enter option [1-5, 0 to exit]:
echo.

if "%choice%"=="1" goto init_project
if "%choice%"=="2" goto start_dev
if "%choice%"=="3" goto start_prod
if "%choice%"=="4" goto init_db
if "%choice%"=="5" goto seed_data
if "%choice%"=="0" goto end

echo [ERROR] Invalid option!
timeout /t 2 >nul
goto main_menu

:init_project
echo [1/6] Checking Node.js ...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found! Please install v18+
    pause
    goto main_menu
)
for /f "tokens=*" %%v in ('node -v') do set NODE_VER=%%v
echo       Node.js: %NODE_VER%

echo.
echo [2/6] Checking npm ...
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm not found!
    pause
    goto main_menu
)
for /f "tokens=*" %%v in ('npm -v') do set NPM_VER=%%v
echo       npm: %NPM_VER%

echo.
echo [3/6] Installing dependencies ...
if not exist "%~dp0node_modules" (
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Install failed!
        pause
        goto main_menu
    )
    echo       Dependencies installed!
) else (
    echo       Dependencies OK
)

echo.
echo [4/6] Setting up .env ...
if not exist "%~dp0.env" (
    if exist "%~dp0.env.example" (
        copy "%~dp0.env.example" "%~dp0.env" >nul
        echo       Created .env from .env.example
        echo       Please edit JWT_SECRET in .env file
    )
) else (
    echo       .env already exists
)

echo.
echo [5/6] Initializing database ...
call npm run init-db
if %errorlevel% equ 0 (
    echo       Database created!
) else (
    echo [ERROR] Database init failed!
    pause
    goto main_menu
)

echo.
echo [6/6] Importing sample data (497 words, 38 knowledge, 13 questions) ...
call npm run seed-db
if %errorlevel% equ 0 (
    echo       Data imported!
) else (
    echo [WARNING] Seed may have issues
)

echo.
echo ============================================
echo    Project initialized!
echo    Select [2] to start the server
echo ============================================
echo.
pause
goto main_menu

:start_dev
echo [1/3] Checking Node.js ...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found!
    pause
    goto main_menu
)
echo       Node.js OK

echo.
echo [2/3] Checking dependencies ...
if not exist "%~dp0node_modules" (
    echo [ERROR] Please run option [1] first
    pause
    goto main_menu
)
echo       Dependencies OK

echo.
echo [3/3] Checking database ...
if not exist "%~dp0data\learning.db" (
    echo [ERROR] Please run option [1] first
    pause
    goto main_menu
)
echo       Database OK

echo.
echo ============================================
echo    Starting dev server (auto-reload) ...
echo ============================================
echo.
echo   Server: http://localhost:3000
echo   Press Ctrl+C to stop
echo.
echo ============================================
echo.

call npm run dev

if %errorlevel% neq 0 (
    echo [ERROR] Server failed to start!
)
echo.
pause
goto main_menu

:start_prod
echo [1/3] Checking Node.js ...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found!
    pause
    goto main_menu
)
echo       Node.js OK

echo.
echo [2/3] Checking dependencies ...
if not exist "%~dp0node_modules" (
    echo [ERROR] Please run option [1] first
    pause
    goto main_menu
)
echo       Dependencies OK

echo.
echo [3/3] Checking database ...
if not exist "%~dp0data\learning.db" (
    echo [WARNING] Database not found! Please run option [1] first
)
echo       Database OK

echo.
echo ============================================
echo    Starting production server ...
echo ============================================
echo.
echo   Server: http://localhost:3000
echo   Press Ctrl+C to stop
echo.
echo ============================================
echo.

call npm start

if %errorlevel% neq 0 (
    echo [ERROR] Server failed to start!
)
echo.
pause
goto main_menu

:init_db
echo       Initializing database ...
call npm run init-db
if %errorlevel% equ 0 (
    echo       Database initialized!
) else (
    echo [ERROR] Database init failed!
)
echo.
pause
goto main_menu

:seed_data
echo       Importing sample data ...
call npm run seed-db
if %errorlevel% equ 0 (
    echo       Done! 497 words, 38 knowledge points, 13 questions
) else (
    echo [ERROR] Data import failed!
)
echo.
pause
goto main_menu

:end
cls
echo.
echo ============================================
echo    Thanks for using English Learning Station!
echo ============================================
echo.
timeout /t 2 >nul
exit
