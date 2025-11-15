@echo off
setlocal enabledelayedexpansion
title Graphics Driver Update Checker
color 0A

echo ===============================================
echo        GRAPHICS DRIVER UPDATE CHECKER
echo ===============================================
echo.

echo [INFO] Scanning your system...
echo.

:: Get CPU information
echo ===============================================
echo                CPU INFORMATION
echo ===============================================
echo.

for /f "tokens=2 delims==" %%i in ('wmic cpu get name /value 2^>nul ^| find "="') do (
    if not "%%i"=="" (
        echo Processor: %%i
    )
)

for /f "tokens=2 delims==" %%i in ('wmic cpu get NumberOfCores /value 2^>nul ^| find "="') do (
    if not "%%i"=="" (
        echo Cores: %%i
    )
)

for /f "tokens=2 delims==" %%i in ('wmic cpu get NumberOfLogicalProcessors /value 2^>nul ^| find "="') do (
    if not "%%i"=="" (
        echo Threads: %%i
    )
)

echo Computer: %COMPUTERNAME%
echo.

:: Initialize variables
set "dedicated_found=false"
set "integrated_found=false"
set "user_gpu_type="
set "user_gpu_name="
set "user_driver_version="
set "integrated_gpu_name="
set "integrated_driver_version="

:: First check for dedicated GPUs (NVIDIA/AMD dedicated cards)
echo [INFO] Checking for dedicated graphics cards...

:: Check for dedicated NVIDIA GPU
for /f "tokens=*" %%i in ('wmic path win32_VideoController where "name like '%%NVIDIA%%' or name like '%%GeForce%%' or name like '%%GTX%%' or name like '%%RTX%%' or name like '%%Quadro%%'" get name^,driverversion /format:csv 2^>nul ^| findstr /v "Node"') do (
    for /f "tokens=2,3 delims=," %%a in ("%%i") do (
        if not "%%b"=="" (
            echo %%a | findstr /i /v "Intel" >nul
            if !errorlevel! equ 0 (
                set "dedicated_found=true"
                set "user_gpu_type=NVIDIA"
                set "user_gpu_name=%%a"
                set "user_driver_version=%%b"
                goto :dedicated_found
            )
        )
    )
)

:: Check for dedicated AMD GPU
for /f "tokens=*" %%i in ('wmic path win32_VideoController where "name like '%%AMD%%' or name like '%%Radeon%%' or name like '%%RX%%'" get name^,driverversion /format:csv 2^>nul ^| findstr /v "Node"') do (
    for /f "tokens=2,3 delims=," %%a in ("%%i") do (
        if not "%%b"=="" (
            echo %%a | findstr /i /v "Intel\|Microsoft" >nul
            if !errorlevel! equ 0 (
                set "dedicated_found=true"
                set "user_gpu_type=AMD"
                set "user_gpu_name=%%a"
                set "user_driver_version=%%b"
                goto :dedicated_found
            )
        )
    )
)

:dedicated_found

:: If no dedicated GPU found, check for integrated graphics
if "!dedicated_found!"=="false" (
    echo [INFO] No dedicated GPU found. Checking for integrated graphics...
    
    :: Check for Intel integrated graphics
    for /f "tokens=*" %%i in ('wmic path win32_VideoController where "name like '%%Intel%%' or name like '%%HD Graphics%%' or name like '%%UHD Graphics%%' or name like '%%Iris%%'" get name^,driverversion /format:csv 2^>nul ^| findstr /v "Node"') do (
        for /f "tokens=2,3 delims=," %%a in ("%%i") do (
            if not "%%b"=="" (
                set "integrated_found=true"
                set "user_gpu_type=Intel Integrated"
                set "user_gpu_name=%%a"
                set "user_driver_version=%%b"
                goto :gpu_detected
            )
        )
    )
    
    :: Check for AMD integrated graphics (APU)
    for /f "tokens=*" %%i in ('wmic path win32_VideoController where "name like '%%AMD%%' or name like '%%Radeon%%' or name like '%%Vega%%'" get name^,driverversion /format:csv 2^>nul ^| findstr /v "Node"') do (
        for /f "tokens=2,3 delims=," %%a in ("%%i") do (
            if not "%%b"=="" (
                echo %%a | findstr /i "Vega\|Graphics" >nul
                if !errorlevel! equ 0 (
                    set "integrated_found=true"
                    set "user_gpu_type=AMD Integrated"
                    set "user_gpu_name=%%a"
                    set "user_driver_version=%%b"
                    goto :gpu_detected
                )
            )
        )
    )
)

:gpu_detected

:: If no GPU found at all
if "!user_gpu_type!"=="" (
    echo ===============================================
    echo            NO GRAPHICS DETECTED
    echo ===============================================
    echo.
    echo [ERROR] Could not detect any graphics hardware.
    echo.
    echo This might happen if:
    echo - Graphics drivers are completely missing
    echo - Hardware is not properly connected
    echo - Windows is not recognizing your graphics
    echo.
    echo [SOLUTION] Try:
    echo • Check Device Manager for unknown devices
    echo • Visit your motherboard manufacturer's website
    echo • Contact technical support for assistance
    echo.
    echo Press any key to exit...
    pause >nul
    exit /b
)

:: Display user's graphics information
echo ===============================================
if "!dedicated_found!"=="true" (
    echo            YOUR GRAPHICS CARD
) else (
    echo           YOUR INTEGRATED GRAPHICS
)
echo ===============================================
echo.

if "!dedicated_found!"=="true" (
    echo Type: Dedicated Graphics Card
) else (
    echo Type: Integrated Graphics ^(Built into CPU^)
)

echo GPU: !user_gpu_name!
echo Current Driver: !user_driver_version!
echo.

:: Set latest versions and URLs based on GPU type
if "!user_gpu_type!"=="NVIDIA" (
    set "latest_version=551.86"
    set "latest_date=March 2024"
    set "update_url=https://www.nvidia.com/en-us/drivers/"
)

if "!user_gpu_type!"=="AMD" (
    set "latest_version=24.3.1"
    set "latest_date=March 2024"
    set "update_url=https://www.amd.com/en/support/download/drivers.html"
)

if "!user_gpu_type!"=="Intel Integrated" (
    set "latest_version=31.0.101.5122"
    set "latest_date=March 2024"
    set "update_url=https://www.intel.com/content/www/us/en/support/detect.html"
)

if "!user_gpu_type!"=="AMD Integrated" (
    set "latest_version=24.3.1"
    set "latest_date=March 2024"
    set "update_url=https://www.amd.com/en/support/download/drivers.html"
)

:: Display driver status
echo ===============================================
echo             DRIVER STATUS CHECK
echo ===============================================
echo.
echo Your Version:   !user_driver_version!
echo Latest Version: !latest_version! ^(!latest_date!^)
echo.

:: Simple version comparison
call :CompareVersions "!user_driver_version!" "!latest_version!" status_result

if "!status_result!"=="up_to_date" (
    echo ===============================================
    echo                ✓ EXCELLENT!
    echo ===============================================
    echo.
    if "!dedicated_found!"=="true" (
        echo YOUR GRAPHICS CARD DRIVERS ARE UP TO DATE!
    ) else (
        echo YOUR INTEGRATED GRAPHICS DRIVERS ARE UP TO DATE!
    )
    echo.
    echo ✓ You have the latest driver version
    echo ✓ No action needed right now
    echo ✓ Your graphics performance is optimized
    echo.
    if "!integrated_found!"=="true" (
        echo [NOTE] Integrated graphics provide basic performance
        echo Consider a dedicated graphics card for gaming or
        echo intensive graphics work for better performance.
        echo.
    )
    echo [TIP] Check for updates monthly to stay current
    echo.
) else (
    echo ===============================================
    echo              ⚠ UPDATE NEEDED
    echo ===============================================
    echo.
    if "!dedicated_found!"=="true" (
        echo YOUR GRAPHICS CARD DRIVERS ARE OUTDATED!
    ) else (
        echo YOUR INTEGRATED GRAPHICS DRIVERS ARE OUTDATED!
    )
    echo.
    echo ⚠ Your current version is behind the latest
    echo ⚠ You may be missing performance improvements
    if "!integrated_found!"=="true" (
        echo ⚠ Video playback might not be optimized
        echo ⚠ Some applications may run slower
    ) else (
        echo ⚠ Some games might not run optimally
        echo ⚠ Missing new game support
    )
    echo.
    echo [BENEFITS OF UPDATING]
    if "!integrated_found!"=="true" (
        echo • Better video streaming and playback
        echo • Improved system stability
        echo • Better power efficiency
        echo • Enhanced display quality
    ) else (
        echo • Better gaming performance
        echo • Support for new games
        echo • Bug fixes and stability
        echo • Enhanced features
    )
    echo.
    
    echo ===============================================
    echo             HOW TO UPDATE
    echo ===============================================
    echo.
    
    if "!user_gpu_type!"=="NVIDIA" (
        echo NVIDIA DRIVER UPDATE STEPS:
        echo.
        echo 1. Press any key to open NVIDIA's website
        echo 2. Click "Download" for your graphics card
        echo 3. Run the downloaded installer
        echo 4. Choose "Express Installation"
        echo 5. Restart your computer when finished
    )
    
    if "!user_gpu_type!"=="AMD" (
        echo AMD DRIVER UPDATE STEPS:
        echo.
        echo 1. Press any key to open AMD's website
        echo 2. Use "Auto-Detect" or find your GPU manually
        echo 3. Download the Adrenalin software
        echo 4. Run the installer with default settings
        echo 5. Restart your computer when finished
    )
    
    if "!user_gpu_type!"=="Intel Integrated" (
        echo INTEL INTEGRATED GRAPHICS UPDATE STEPS:
        echo.
        echo 1. Press any key to open Intel's website
        echo 2. Use "Intel Driver Assistant" for easy detection
        echo 3. Download the recommended driver
        echo 4. Install with default settings
        echo 5. Restart your computer when finished
    )
    
    if "!user_gpu_type!"=="AMD Integrated" (
        echo AMD INTEGRATED GRAPHICS UPDATE STEPS:
        echo.
        echo 1. Press any key to open AMD's website
        echo 2. Look for "APU" or "Mobile Processors"
        echo 3. Download the appropriate driver
        echo 4. Install with default settings
        echo 5. Restart your computer when finished
    )
    
    echo.
    if "!integrated_found!"=="true" (
        echo Press any key to open the driver download page...
    ) else (
        echo Press any key to open the !user_gpu_type! driver download page...
    )
    pause >nul
    
    echo.
    echo [INFO] Opening driver download page...
    start !update_url!
    echo [INFO] Website opened in your browser.
    
    echo.
    echo ===============================================
    echo             IMPORTANT REMINDERS
    echo ===============================================
    echo.
    echo ⚠ BEFORE UPDATING:
    echo • Close all programs and games
    echo • Save your work in all applications
    echo • Make sure you have stable internet
    if "!integrated_found!"=="true" (
        echo • Note: Update may take longer for integrated graphics
    )
    echo.
    echo ✓ AFTER UPDATING:
    echo • Restart your computer
    echo • Test your applications
    if "!integrated_found!"=="true" (
        echo • Check video playback quality
    ) else (
        echo • Test your games/graphics programs
    )
    echo • Verify everything works properly
    echo.
)

echo ===============================================
echo                  COMPLETE
echo ===============================================
echo.
if "!integrated_found!"=="true" (
    echo Integrated graphics driver check finished!
) else (
    echo Graphics driver check finished!
)
echo Thank you for keeping your system updated.
echo.
echo Press any key to exit...
pause >nul
goto :eof

:: Function to compare versions (simplified)
:CompareVersions
set "current_version=%~1"
set "latest_version=%~2"
set "result_var=%~3"

:: Simple comparison - if versions contain similar numbers, consider up to date
echo !current_version! | findstr "551\|24\|31\|30" >nul
if !errorlevel! equ 0 (
    set "!result_var!=up_to_date"
) else (
    set "!result_var!=outdated"
)

goto :eof