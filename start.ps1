# 考研英语学习站 - 启动菜单 (PowerShell)
# UTF-8 编码

$ESC = [char]27
$CYAN = "$ESC[96m"
$GREEN = "$ESC[92m"
$BOLD = "$ESC[1m"
$RESET = "$ESC[0m"

function Show-Menu {
    Clear-Host
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host "     考研英语学习站 - 启动菜单" -ForegroundColor Cyan
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "   [1] 直接启动（日常使用）"
    Write-Host "   [2] 更新语料后启动（语料有更新时）"
    Write-Host "   [3] 检查环境后启动（首次/环境异常时）"
    Write-Host "   [0] 退出"
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host ""
}

function Start-Quick {
    Clear-Host
    Write-Host "============================================" -ForegroundColor Green
    Write-Host "    直接启动模式" -ForegroundColor Green
    Write-Host "============================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "   服务地址: $BOLD$CYAN http://localhost:3000 $RESET"
    Write-Host "   按 Ctrl+C 停止服务"
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Green
    Write-Host ""

    Set-Location $PSScriptRoot
    npm run dev

    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "[错误] 启动失败！请尝试选项 [3] 检查环境" -ForegroundColor Red
        Read-Host "按回车键返回菜单"
    }
}

function Start-WithUpdate {
    Clear-Host
    Write-Host "============================================" -ForegroundColor Green
    Write-Host "    更新语料后启动模式" -ForegroundColor Green
    Write-Host "============================================" -ForegroundColor Green
    Write-Host ""

    Write-Host "[1/2] 正在导入语料数据..." -ForegroundColor Yellow
    Set-Location $PSScriptRoot
    npm run seed-db

    if ($LASTEXITCODE -ne 0) {
        Write-Host "[错误] 语料导入失败！" -ForegroundColor Red
        Read-Host "按回车键返回菜单"
        return
    }
    Write-Host "      完成！已导入 497 单词、38 知识点、13 题目" -ForegroundColor Green

    Write-Host ""
    Write-Host "[2/2] 启动服务器..."
    Write-Host ""
    Write-Host "   服务地址: $BOLD$CYAN http://localhost:3000 $RESET"
    Write-Host "   按 Ctrl+C 停止服务"
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Green
    Write-Host ""

    npm run dev

    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "[错误] 启动失败！" -ForegroundColor Red
        Read-Host "按回车键返回菜单"
    }
}

function Start-WithCheck {
    Clear-Host
    Write-Host "============================================" -ForegroundColor Green
    Write-Host "    检查环境后启动模式" -ForegroundColor Green
    Write-Host "============================================" -ForegroundColor Green
    Write-Host ""

    Set-Location $PSScriptRoot

    # 检查 Node.js
    Write-Host "[1/5] 检查 Node.js..." -ForegroundColor Yellow
    try {
        $nodeVersion = node -v
        Write-Host "      Node.js: $nodeVersion OK" -ForegroundColor Green
    } catch {
        Write-Host "[错误] 未找到 Node.js！请安装 v18+" -ForegroundColor Red
        Read-Host "按回车键返回菜单"
        return
    }

    # 检查 npm
    Write-Host ""
    Write-Host "[2/5] 检查 npm..." -ForegroundColor Yellow
    try {
        $npmVersion = npm -v
        Write-Host "      npm: $npmVersion OK" -ForegroundColor Green
    } catch {
        Write-Host "[错误] 未找到 npm！" -ForegroundColor Red
        Read-Host "按回车键返回菜单"
        return
    }

    # 检查依赖
    Write-Host ""
    Write-Host "[3/5] 检查依赖..." -ForegroundColor Yellow
    if (-not (Test-Path "node_modules")) {
        Write-Host "      依赖未安装，正在安装..." -ForegroundColor Yellow
        npm install
        if ($LASTEXITCODE -ne 0) {
            Write-Host "[错误] 依赖安装失败！" -ForegroundColor Red
            Read-Host "按回车键返回菜单"
            return
        }
        Write-Host "      依赖安装完成！" -ForegroundColor Green
    } else {
        Write-Host "      依赖已安装 OK" -ForegroundColor Green
    }

    # 检查 .env
    Write-Host ""
    Write-Host "[4/5] 检查配置文件..." -ForegroundColor Yellow
    if (-not (Test-Path ".env")) {
        if (Test-Path ".env.example") {
            Copy-Item ".env.example" ".env"
            Write-Host "      已创建 .env 文件（请配置 JWT_SECRET）" -ForegroundColor Green
        } else {
            Write-Host "[警告] 未找到 .env.example" -ForegroundColor Yellow
        }
    } else {
        Write-Host "      .env 已存在 OK" -ForegroundColor Green
    }

    # 检查数据库
    Write-Host ""
    Write-Host "[5/5] 检查数据库..." -ForegroundColor Yellow
    if (-not (Test-Path "data\learning.db")) {
        Write-Host "      数据库不存在，正在初始化..." -ForegroundColor Yellow
        npm run init-db
        if ($LASTEXITCODE -ne 0) {
            Write-Host "[错误] 数据库初始化失败！" -ForegroundColor Red
            Read-Host "按回车键返回菜单"
            return
        }
        npm run seed-db
        if ($LASTEXITCODE -ne 0) {
            Write-Host "[警告] 语料导入可能有问题" -ForegroundColor Yellow
        }
        Write-Host "      数据库初始化完成！" -ForegroundColor Green
    } else {
        Write-Host "      数据库已存在 OK" -ForegroundColor Green
    }

    Write-Host ""
    Write-Host "============================================" -ForegroundColor Green
    Write-Host "    环境检查通过！正在启动服务器..." -ForegroundColor Green
    Write-Host "============================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "   服务地址: $BOLD$CYAN http://localhost:3000 $RESET"
    Write-Host "   按 Ctrl+C 停止服务"
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Green
    Write-Host ""

    npm run dev

    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "[错误] 启动失败！" -ForegroundColor Red
        Read-Host "按回车键返回菜单"
    }
}

# 主循环
while ($true) {
    Show-Menu
    $choice = Read-Host "请选择 [0-3]"

    switch ($choice) {
        "1" { Start-Quick }
        "2" { Start-WithUpdate }
        "3" { Start-WithCheck }
        "0" {
            Clear-Host
            Write-Host ""
            Write-Host "============================================" -ForegroundColor Cyan
            Write-Host "    感谢使用考研英语学习站！" -ForegroundColor Cyan
            Write-Host "============================================" -ForegroundColor Cyan
            Write-Host ""
            Start-Sleep -Seconds 1
            exit
        }
        default {
            Write-Host "[错误] 无效选项！" -ForegroundColor Red
            Start-Sleep -Seconds 1
        }
    }
}
