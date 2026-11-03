@echo off
title AutoTrust AI Launcher
echo ===================================================
echo Starting AutoTrust AI Full-Stack Platform...
echo ===================================================

echo [1/3] Checking Database and Seeds...
cd autotrust_backend
..\venv\Scripts\python.exe manage.py migrate
..\venv\Scripts\python.exe populate.py
cd ..

echo [2/3] Launching Django Backend Server (Port 8000)...
start "AutoTrust AI - Django Backend" cmd /k "cd autotrust_backend && ..\venv\Scripts\python.exe manage.py runserver 0.0.0.0:8000"

echo [3/3] Launching Vite Frontend Server (Port 5173)...
start "AutoTrust AI - Vite Frontend" cmd /k "cd frontend && npm run dev -- --host"

timeout /t 3 /nobreak >nul
echo Opening AutoTrust AI in your default web browser...
start http://localhost:5173/

echo ===================================================
echo AutoTrust AI is now running!
echo Frontend: http://localhost:5173/
echo Backend:  http://localhost:8000/api/
echo ===================================================
pause

