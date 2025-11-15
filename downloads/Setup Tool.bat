@echo off

REM Check for admin privileges
net session >nul 2>&1
if %errorLevel% == 0 (
    echo Administrator privileges confirmed.
    echo.
) else (
    echo Requesting administrator privileges...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

setlocal enabledelayedexpansion
cls

:: ==========================================
:: Simple Mod Setup Tool
:: ==========================================

color 0A
echo ==========================================
echo     Simple Mod Setup Tool
echo ==========================================
echo.
echo This easy-to-use tool will install everything
echo needed for mod menus and game modifications.
echo.
echo What this tool does:
echo • Installs required system files
echo • Configures Windows settings  
echo • Optimizes your PC for gaming
echo • Cleans up temporary files
echo.
echo Press any key to start...
pause

:: =======================
:: Admin Check
:: =======================
cls
echo Checking administrator privileges...
net session >nul 2>&1
if %errorlevel% NEQ 0 (
    cls
echo ===============================================
echo          ADMIN RIGHTS REQUIRED
echo ===============================================
echo.
echo This tool needs administrator permissions to work properly.
echo.
echo HOW TO RUN AS ADMIN:
echo.
echo 1. Right-click on this .bat file
echo 2. You will see a menu appear
echo 3. Click "Run as administrator" 
echo 4. Click "Yes" when Windows asks for permission
echo.
echo Then the tool will work correctly!
echo.
echo Press any key to close this window, then try again...
pause
exit /b 1
)
echo ✅ You have administrator permissions!
echo.
echo The tool can now install everything properly.
pause
cls

:: =======================
:: System Cleanup
:: =======================
color 0C
echo ===============================================
echo System Cleanup
echo ===============================================
echo.
echo Performing system cleanup to free up space
echo and remove temporary files...
echo.

set /p cleanup=Perform system cleanup? (y/n): 
if /i "!cleanup!"=="y" (
    echo.
    echo Cleaning temporary files...
    
    :: Clean Windows temp folder
    echo - Cleaning Windows temp folder...
    del /f /s /q "%temp%\*" >nul 2>&1
    for /d %%i in ("%temp%\*") do rmdir /s /q "%%i" >nul 2>&1
    
    :: Clean user temp folder in AppData
    echo - Cleaning AppData temp folder...
    if exist "%localappdata%\temp" (
        del /f /s /q "%localappdata%\temp\*" >nul 2>&1
        for /d %%i in ("%localappdata%\temp\*") do rmdir /s /q "%%i" >nul 2>&1
    )
    
    :: Clean Windows prefetch
    echo - Cleaning Windows prefetch...
    if exist "%windir%\prefetch" (
        del /f /q "%windir%\prefetch\*" >nul 2>&1
    )
    
    :: Clean recent items
    echo - Cleaning recent items...
    if exist "%appdata%\Microsoft\Windows\Recent" (
        del /f /q "%appdata%\Microsoft\Windows\Recent\*" >nul 2>&1
    )
    
    :: Run Windows Disk Cleanup utility
    echo - Running Windows Disk Cleanup...
    cleanmgr /sagerun:1 >nul 2>&1
    
    echo [✓] System cleanup completed
) else (
    echo System cleanup skipped.
)

echo.
pause
cls

:: =======================
:: Registry Optimization
:: =======================
color 0B
echo ===============================================
echo Registry Optimization
echo ===============================================
echo.
echo This will optimize registry settings for
echo better gaming performance and stability.
echo.

set /p registry=Apply registry optimizations? (y/n): 
if /i "!registry!"=="y" (
    echo.
    echo Applying registry optimizations...
    
    :: Disable Windows Error Reporting
    echo - Disabling Windows Error Reporting...
    reg add "HKLM\SOFTWARE\Microsoft\Windows\Windows Error Reporting" /v Disabled /t REG_DWORD /d 1 /f >nul 2>&1
    
    :: Disable Windows Search indexing for better performance
    echo - Optimizing Windows Search...
    reg add "HKLM\SYSTEM\CurrentControlSet\Services\WSearch" /v Start /t REG_DWORD /d 4 /f >nul 2>&1
    
    :: Disable Superfetch for SSDs
    echo - Optimizing Superfetch...
    reg add "HKLM\SYSTEM\CurrentControlSet\Services\SysMain" /v Start /t REG_DWORD /d 4 /f >nul 2>&1
    
    :: Optimize visual effects for performance
    echo - Setting visual effects for performance...
    reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\VisualEffects" /v VisualFXSetting /t REG_DWORD /d 2 /f >nul 2>&1
    
    :: Disable startup delay
    echo - Removing startup delay...
    reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Serialize" /v StartupDelayInMSec /t REG_DWORD /d 0 /f >nul 2>&1
    
    echo [✓] Registry optimizations applied
) else (
    echo Registry optimizations skipped.
)

echo.
pause
cls

:: =======================
:: Final Security Check
:: =======================
color 0D
echo ===============================================
echo Final Security Check
echo ===============================================
echo.
echo Checking Windows security settings...
echo.

:: Check if Windows Defender is running
sc query windefend | find "RUNNING" >nul 2>&1
if !errorlevel! == 0 (
    echo [✓] Windows Defender is active
    echo.
    echo Reminder: If you added folder exclusions, they should
    echo help prevent false positives with mod files.
) else (
    echo [!] Windows Defender appears to be disabled
    echo Make sure you have another antivirus solution active.
)

echo.
echo Security recommendations:
echo - Keep Windows Defender exclusions minimal
echo - Only download mods from trusted sources  
echo - Scan downloaded files before running
echo - Keep Windows and drivers updated
echo.
pause
cls

:: =======================
:: Dependencies Download & Install
:: =======================
color 0B
echo ===============================================
echo Step 1: Installing Required Files
echo ===============================================
echo.
echo Now installing the essential files your system
echo needs to run mod menus properly.
echo.
echo What's being installed:
echo • Microsoft Visual C++ (system library)
echo • DirectX Runtime (for games and graphics)  
echo • Additional support files
echo.
echo This may take a few minutes...
echo Press any key to start the downloads...
pause >nul

:: Create temp directory
if not exist "%temp%\mod_dependencies" mkdir "%temp%\mod_dependencies"

echo.
echo [1/3] Downloading Microsoft Visual C++ files...
echo (This helps programs run properly on Windows)
call :DownloadFile "https://aka.ms/vs/17/release/vc_redist.x64.exe" "%temp%\mod_dependencies\vc_redist.exe"

if exist "%temp%\mod_dependencies\vc_redist.exe" (
    echo Installing Visual C++ files... (may show installation window)
    start /wait "" "%temp%\mod_dependencies\vc_redist.exe" /quiet /norestart
    echo ✅ Visual C++ files installed successfully!
) else (
    echo ❌ Failed to download Visual C++ files
)

echo.
echo [2/3] Downloading DirectX files...
echo (This helps games display graphics properly)
call :DownloadFile "https://download.microsoft.com/download/8/4/A/84A35BF1-DAFE-4AE4-B74A-B9C6DE6B08B0/directx_Jun2010_redist.exe" "%temp%\mod_dependencies\directx_redist.exe"

if exist "%temp%\mod_dependencies\directx_redist.exe" (
    echo Installing DirectX files...
    start /wait "" "%temp%\mod_dependencies\directx_redist.exe" /Q
    echo ✅ DirectX files installed successfully!
) else (
    echo ❌ Failed to download DirectX files
)

echo.
echo [3/3] Downloading additional support files...
echo (Extra files that some mods might need)
call :DownloadFile "https://github.com/abbodi1406/vcredist/releases/latest/download/VisualCppRedist_AIO_x86_x64.exe" "%temp%\mod_dependencies\vcredist_aio.exe"

if exist "%temp%\mod_dependencies\vcredist_aio.exe" (
    echo Installing additional support files...
    start /wait "" "%temp%\mod_dependencies\vcredist_aio.exe" /ai
    echo ✅ Additional support files installed!
) else (
    echo ❌ Failed to download additional support files
)

echo.
echo Cleaning up temporary files...
rmdir /s /q "%temp%\mod_dependencies" 2>nul

echo.
echo 🎉 All required files have been installed!
echo.
echo Your computer now has everything it needs to run mod menus.
pause
cls

:: =======================
:: Graphics Driver Notice
:: =======================
color 0E
echo ===============================================
echo Step 2: Graphics Driver Reminder
echo ===============================================
echo.
echo 💡 IMPORTANT REMINDER:
echo.
echo If you still experience crashes or problems,
echo make sure to update your Graphics Drivers!
echo.
echo You can usually do this through:
echo • NVIDIA GeForce Experience (for NVIDIA cards)
echo • AMD Software (for AMD cards)  
echo • Windows Update (for all cards)
echo.
pause
cls

:: =======================
:: Common Fixes & Troubleshooting
:: =======================
color 0C
echo ===============================================
echo Step 3: Troubleshooting Help
echo ===============================================
echo.
echo If you're having problems with mod menus,
echo here are the most common fixes:
echo.
echo 💡 COMMON SOLUTIONS:
echo.
echo 1: If mod loader won't open, try using a VPN
echo    (Some internet providers block these tools)
echo.
echo 2: Close any debugging software like Cheat Engine
echo.
echo 3: If you're getting permission errors,
echo    try creating a fresh Windows user account
echo.
echo 4: For GTA V - change from Fullscreen to Windowed:
echo    Open GTA V → Settings → Display Mode → Windowed
echo.
echo ===============================================
echo.

set /p create_user=🔧 Do you want to create a new user account? (y/n - only if having permission issues): 
if /i "!create_user!"=="y" (
    call :CreateAdminUser
) else (
    echo User account creation skipped.
)

echo.
pause
cls

:: =======================
:: Windows Defender Configuration
:: =======================
color 0D
echo ===============================================
echo Windows Defender Configuration
echo ===============================================
echo.
echo Configure Windows Defender exclusions to prevent
echo interference with mod files.
echo.
set /p defender=Add current folder to Windows Defender exclusions? (y/n): 

if /i "!defender!"=="y" (
    echo Adding exclusion for: %~dp0
    powershell -NoProfile -Command "Add-MpPreference -ExclusionPath '%~dp0'" 2>nul
    if !errorlevel! == 0 (
        echo [✓] Exclusion added successfully
    ) else (
        echo [!] Failed to add exclusion - may need admin rights
    )
) else (
    echo Skipping Windows Defender configuration
)

echo.
pause
cls

:: =======================
:: System Tweaks
:: =======================
color 0A
echo ===============================================
echo Optional System Performance Tweaks
echo ===============================================
echo.
echo These tweaks can improve gaming performance:
echo - Disable Windows Game DVR
echo - Set High Performance power plan
echo.
set /p tweaks=Apply performance tweaks? (y/n): 

if /i "!tweaks!"=="y" (
    echo Applying performance tweaks...
    
    :: Disable Game DVR
    reg add "HKCU\System\GameConfigStore" /v GameDVR_Enabled /t REG_DWORD /d 0 /f >nul 2>&1
    reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\GameDVR" /v AllowGameDVR /t REG_DWORD /d 0 /f >nul 2>&1
    
    :: Set High Performance power plan
    powercfg -setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c >nul 2>&1
    
    echo [✓] Performance tweaks applied
) else (
    echo Skipping performance tweaks
)

echo.
pause
cls

:: =======================
:: Time Sync
:: =======================
color 0B
echo ===============================================
echo System Time Synchronization
echo ===============================================
echo.
echo Synchronizing system time...
w32tm /resync >nul 2>&1
if !errorlevel! == 0 (
    echo [✓] System time synchronized
) else (
    echo [!] Time sync not needed or failed
)

echo.
pause
cls

:: =======================
:: Installation Complete
:: =======================
color 0A
echo ===============================================
echo 🎮 Installation Complete! 🎮
echo ===============================================
echo.
echo Summary:
echo • Visual C++ Redistributables installed
echo • DirectX End-User Runtime installed
echo • Additional dependencies installed
echo • Windows Defender configured (if selected)
echo • Performance tweaks applied (if selected)
echo • System time synchronized
echo.
echo RESTART RECOMMENDED:
echo A system restart is recommended to ensure
echo all changes take effect properly.
echo.
set /p restart=Restart your computer now? (y/n): 

if /i "!restart!"=="y" (
    echo.
    echo Restarting computer in 10 seconds...
    echo Press Ctrl+C to cancel
    timeout /t 10
    shutdown /r /t 0
) else (
    echo.
    echo Please restart when convenient for best results.
)

echo.
echo Thank you for using the Simple Mod Setup Tool!
echo.
pause
exit /b 0

:: =======================
:: Download Function
:: =======================
:DownloadFile
set "url=%~1"
set "outfile=%~2"

echo Downloading: %url%
echo Saving to: %outfile%

powershell -NoProfile -Command "try { $ProgressPreference = 'SilentlyContinue'; Invoke-WebRequest -Uri '%url%' -OutFile '%outfile%' -UseBasicParsing -TimeoutSec 60; Write-Host 'Download completed' } catch { Write-Host 'Download failed: ' + $_.Exception.Message; exit 1 }"

if !errorlevel! neq 0 (
    echo PowerShell failed, trying alternative method...
    bitsadmin /transfer "Download_%random%" "%url%" "%outfile%" >nul 2>&1
    if !errorlevel! neq 0 (
        echo ERROR: Download failed completely
        echo Check your internet connection
    ) else (
        echo Download completed using bitsadmin
    )
) else (
    echo Download successful
)

echo.
goto :eof

:: =======================
:: Create Admin User Function
:: =======================
:CreateAdminUser
echo.
echo ===============================================
echo Creating New Admin User Account
echo ===============================================
echo.
echo This will create a new user account with
echo full administrator privileges.
echo.

set /p username=What do you want the username to be called? 
if "!username!"=="" (
    echo No username provided, skipping user creation.
    goto :eof
)

set /p password=Enter password for new user: 
if "!password!"=="" (
    echo No password provided, skipping user creation.
    goto :eof
)

echo.
echo Creating user account: !username!
net user "!username!" "!password!" /add >nul 2>&1
if !errorlevel! == 0 (
    echo [✓] User account created successfully
    
    echo Adding user to Administrators group...
    net localgroup administrators "!username!" /add >nul 2>&1
    if !errorlevel! == 0 (
        echo [✓] User added to Administrators group
        echo.
        echo New admin user '!username!' created successfully!
        echo You can now log out and log in with this account.
    ) else (
        echo [✗] Failed to add user to Administrators group
    )
) else (
    echo [✗] Failed to create user account
    echo User may already exist or invalid username/password
)

echo.
goto :eof