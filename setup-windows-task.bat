@echo off
echo ==========================================================
echo Registering Windows Background Task for The Trend Seller
echo ==========================================================

set BAT_PATH=%~dp0run-publisher.bat

schtasks /Create /SC MINUTE /MO 15 /TN "TheTrendSeller-Publisher" /TR "\"%BAT_PATH%\"" /F

if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Task "TheTrendSeller-Publisher" registered successfully!
    echo It will automatically check and publish due posts every 15 minutes.
) else (
    echo [ERROR] Failed to register task. Please run as Administrator.
)
pause
