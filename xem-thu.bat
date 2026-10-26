@echo off
rem Bam dup vao file nay de xem website tren may. Dong cua so den de tat.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\server.ps1" -Port 8000
pause
