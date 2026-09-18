@echo off
title The Trend Seller - Instagram Auto Publisher
echo ====================================================
echo Starting The Trend Seller Auto Schedule Publisher...
echo ====================================================
cd /d "%~dp0"
python scripts\auto-schedule-publisher.py --daemon
pause
