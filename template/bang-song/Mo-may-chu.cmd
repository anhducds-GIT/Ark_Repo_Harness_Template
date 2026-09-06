@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0.."
where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo   Khong tim thay Node.js tren may nay. Cai Node roi chay lai file nay.
  echo.
  pause
  exit /b 1
)
echo Dang mo may chu tai cho. Dong cua so nay la tat may chu.
start "" http://127.0.0.1:4747/
node "bang-song/may-chu.mjs"
pause
exit /b 0
