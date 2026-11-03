$ErrorActionPreference = 'Stop'
$Url = "https://cdn.mysql.com/archives/mysql-8.0/mysql-8.0.35-winx64.zip"
$ZipFile = "mysql.zip"
$ExtractPath = "mysql_server"

Write-Host "Downloading MySQL..."
Invoke-WebRequest -Uri $Url -OutFile $ZipFile

Write-Host "Extracting..."
Expand-Archive -Path $ZipFile -DestinationPath $ExtractPath -Force

Write-Host "Initializing..."
$mysqlBin = "$ExtractPath\mysql-8.0.35-winx64\bin"
& "$mysqlBin\mysqld.exe" --initialize-insecure --console
Start-Sleep -Seconds 10
Write-Host "Starting MySQL server..."
Start-Process -FilePath "$mysqlBin\mysqld.exe" -WindowStyle Hidden
Start-Sleep -Seconds 5
Write-Host "Creating autotrust database..."
& "$mysqlBin\mysql.exe" -u root -e "CREATE DATABASE IF NOT EXISTS autotrust;"
Write-Host "MySQL setup complete!"
