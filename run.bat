@echo off
setlocal
cd /d "%~dp0"

echo ========================================================
echo  [EduPass 2026] 공인중개사 스마트 수험 웹서비스
echo ========================================================
echo 1. 웹 개발 서버 시작 (Next.js Dev Server)
echo 2. 프로덕션 빌드 및 검증 (Build & Smoke Test)
echo 3. 프로덕션 서버 실행 (Next.js Start)
echo 4. 파이썬 가상환경 의존성 설치 (pip install)
echo 5. 수험 데이터 유효성 검사 (Python Data Validator)
echo ========================================================

set /p choice="실행할 메뉴 번호를 입력하세요 (기본값: 1): "
if "%choice%"=="" set choice=1

if "%choice%"=="1" (
    echo [INFO] 웹 개발 서버를 포트 3000에서 시작합니다...
    call npm.cmd run dev
) else if "%choice%"=="2" (
    echo [INFO] 프로덕션 빌드 및 스모크 테스트를 실행합니다...
    call npm.cmd run build
) else if "%choice%"=="3" (
    echo [INFO] 프로덕션 서버를 시작합니다...
    call npm.cmd run start
) else if "%choice%"=="4" (
    echo [INFO] Python 가상환경 의존성을 설치합니다...
    call .\venv\Scripts\python.exe -m pip install -r requirements.txt
) else if "%choice%"=="5" (
    echo [INFO] 수험 데이터 무결성 검증을 수행합니다...
    call .\venv\Scripts\python.exe scripts\validate_data.py
) else (
    echo [ERROR] 올바른 번호를 선택해주세요.
)

pause
