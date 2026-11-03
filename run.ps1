Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "Starting AutoTrust AI Platform..." -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Cyan

# 1. Run migrations & populate demo data
Write-Host "[1/3] Preparing Database & Seeding..." -ForegroundColor Yellow
Set-Location autotrust_backend
& "..\venv\Scripts\python.exe" manage.py migrate
& "..\venv\Scripts\python.exe" populate.py
Set-Location ..

# 2. Launch Backend
Write-Host "[2/3] Starting Django Backend on port 8000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd autotrust_backend; ..\venv\Scripts\python.exe manage.py runserver 0.0.0.0:8000"

# 3. Launch Frontend
Write-Host "[3/3] Starting Vite Frontend on port 5173..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev -- --host"

Start-Sleep -Seconds 3
Start-Process "http://localhost:5173/"

Write-Host "AutoTrust AI is live at http://localhost:5173/" -ForegroundColor Green

