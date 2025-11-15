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

echo Terminating specified processes...
echo.

REM OllyDebug debugger
taskkill /f /im "ollydbg.exe" 2>nul
if %errorlevel%==0 echo - ollydbg.exe terminated

REM Process Hacker (uncommented)
taskkill /f /im "ProcessHacker.exe" 2>nul
if %errorlevel%==0 echo - ProcessHacker.exe terminated

REM Xenos variants
taskkill /f /im "Xenos64.exe" 2>nul
if %errorlevel%==0 echo - Xenos64.exe terminated

taskkill /f /im "Xenos.exe" 2>nul
if %errorlevel%==0 echo - Xenos.exe terminated

REM Extreme Injector variants
taskkill /f /im "Extreme Injector v3.exe" 2>nul
if %errorlevel%==0 echo - Extreme Injector v3.exe terminated

taskkill /f /im "ExtremeInjector.exe" 2>nul
if %errorlevel%==0 echo - ExtremeInjector.exe terminated

taskkill /f /im "Extreme.exe" 2>nul
if %errorlevel%==0 echo - Extreme.exe terminated

REM Sysinternals Suite
taskkill /f /im "tcpview.exe" 2>nul
if %errorlevel%==0 echo - tcpview.exe terminated

taskkill /f /im "autoruns.exe" 2>nul
if %errorlevel%==0 echo - autoruns.exe terminated

taskkill /f /im "autorunsc.exe" 2>nul
if %errorlevel%==0 echo - autorunsc.exe terminated

taskkill /f /im "filemon.exe" 2>nul
if %errorlevel%==0 echo - filemon.exe terminated

taskkill /f /im "procmon.exe" 2>nul
if %errorlevel%==0 echo - procmon.exe terminated

taskkill /f /im "regmon.exe" 2>nul
if %errorlevel%==0 echo - regmon.exe terminated

taskkill /f /im "procexp.exe" 2>nul
if %errorlevel%==0 echo - procexp.exe terminated

REM IDA Pro
taskkill /f /im "idaq.exe" 2>nul
if %errorlevel%==0 echo - idaq.exe terminated

taskkill /f /im "idaq64.exe" 2>nul
if %errorlevel%==0 echo - idaq64.exe terminated

REM ImmunityDebugger
taskkill /f /im "ImmunityDebugger.exe" 2>nul
if %errorlevel%==0 echo - ImmunityDebugger.exe terminated

REM Wireshark
taskkill /f /im "Wireshark.exe" 2>nul
if %errorlevel%==0 echo - Wireshark.exe terminated

taskkill /f /im "dumpcap.exe" 2>nul
if %errorlevel%==0 echo - dumpcap.exe terminated

REM Various analysis tools
taskkill /f /im "HookExplorer.exe" 2>nul
if %errorlevel%==0 echo - HookExplorer.exe terminated

taskkill /f /im "ImportREC.exe" 2>nul
if %errorlevel%==0 echo - ImportREC.exe terminated

taskkill /f /im "PETools.exe" 2>nul
if %errorlevel%==0 echo - PETools.exe terminated

taskkill /f /im "LordPE.exe" 2>nul
if %errorlevel%==0 echo - LordPE.exe terminated

taskkill /f /im "SysInspector.exe" 2>nul
if %errorlevel%==0 echo - SysInspector.exe terminated

REM SysAnalyzer suite (handling wildcards with multiple variations)
taskkill /f /im "procanalyzer.exe" 2>nul
if %errorlevel%==0 echo - procanalyzer.exe terminated

taskkill /f /im "processanalyzer.exe" 2>nul
if %errorlevel%==0 echo - processanalyzer.exe terminated

taskkill /f /im "sysAnalyzer.exe" 2>nul
if %errorlevel%==0 echo - sysAnalyzer.exe terminated

taskkill /f /im "sniffhit.exe" 2>nul
if %errorlevel%==0 echo - sniffhit.exe terminated

REM Microsoft WinDbg
taskkill /f /im "windbg.exe" 2>nul
if %errorlevel%==0 echo - windbg.exe terminated

REM Joe Sandbox
taskkill /f /im "joeboxcontrol.exe" 2>nul
if %errorlevel%==0 echo - joeboxcontrol.exe terminated

taskkill /f /im "joeboxserver.exe" 2>nul
if %errorlevel%==0 echo - joeboxserver.exe terminated

REM Resource Hacker
taskkill /f /im "ResourceHacker.exe" 2>nul
if %errorlevel%==0 echo - ResourceHacker.exe terminated

REM x32dbg and x64dbg
taskkill /f /im "x32dbg.exe" 2>nul
if %errorlevel%==0 echo - x32dbg.exe terminated

taskkill /f /im "x64dbg.exe" 2>nul
if %errorlevel%==0 echo - x64dbg.exe terminated

REM Network debugging tools
taskkill /f /im "Fiddler.exe" 2>nul
if %errorlevel%==0 echo - Fiddler.exe terminated

taskkill /f /im "httpdebugger.exe" 2>nul
if %errorlevel%==0 echo - httpdebugger.exe terminated

echo.
echo Process termination complete.
echo.
echo Now go load the menu and enjoy!
pause