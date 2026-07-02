# Refresh user and system PATH to load the newly installed Node.js binary
$env:PATH = [System.Environment]::GetEnvironmentVariable("Path", "User") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "Machine")

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "       STARTING LUXURY TECH SERVERS       " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# 1. Start Backend API
Write-Host "Launching Backend API on http://localhost:5000..." -ForegroundColor Yellow
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "`$env:PATH = [System.Environment]::GetEnvironmentVariable('Path', 'User') + ';' + [System.Environment]::GetEnvironmentVariable('Path', 'Machine'); node server.js" -WorkingDirectory "backend"

# 2. Start Frontend Dev Server
Write-Host "Launching Frontend Dev Server on http://localhost:3000..." -ForegroundColor Green
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "`$env:PATH = [System.Environment]::GetEnvironmentVariable('Path', 'User') + ';' + [System.Environment]::GetEnvironmentVariable('Path', 'Machine'); npm.cmd run dev" -WorkingDirectory "frontend"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Both servers have been launched in separate terminal windows." -ForegroundColor Green
Write-Host "API: http://localhost:5000" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
