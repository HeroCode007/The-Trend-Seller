@echo off
echo ==========================================================
echo Registering Windows Background Task for The Trend Seller
echo ==========================================================

set SCRIPT_PATH=c:\Users\user\Desktop\TrendSeller Update\The-Trend-Seller\scripts\auto-schedule-publisher.py
set PYTHON_PATH=python.exe

schtasks /Create /SC MINUTE /MO 15 /TN "TheTrendSeller-Publisher" /TR "\"%PYTHON_PATH%\" \"%SCRIPT_PATH%\"" /F

if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Task "TheTrendSeller-Publisher" registered successfully!
    echo It will automatically check and publish due posts every 15 minutes.
) else (
    echo [ERROR] Failed to register task. Please run as Administrator.
)
pause
