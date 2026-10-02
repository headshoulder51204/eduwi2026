#!/usr/bin/env bash
set -e

# Change to script directory
cd "$(dirname "$0")"

echo "========================================================"
echo " [EduPass 2026] 공인중개사 스마트 수험 웹서비스"
echo "========================================================"
echo "1. 웹 개발 서버 시작 (Next.js Dev Server)"
echo "2. 프로덕션 빌드 및 검증 (Build & Smoke Test)"
echo "3. 프로덕션 서버 실행 (Next.js Start)"
echo "4. 파이썬 가상환경 의존성 설치 (pip install)"
echo "5. 수험 데이터 유효성 검사 (Python Data Validator)"
echo "6. 신규 공부 노트 증분 분석 (Incremental Delta Ingest)"
echo "========================================================"

read -p "실행할 메뉴 번호를 입력하세요 (기본값: 1): " choice
choice=${choice:-1}

if [ "$choice" = "1" ]; then
    echo "[INFO] 웹 개발 서버를 시작합니다..."
    npm run dev
elif [ "$choice" = "2" ]; then
    echo "[INFO] 프로덕션 빌드 및 스모크 테스트를 실행합니다..."
    npm run build
elif [ "$choice" = "3" ]; then
    echo "[INFO] 프로덕션 서버를 시작합니다..."
    npm run start
elif [ "$choice" = "4" ]; then
    echo "[INFO] Python 가상환경 의존성을 설치합니다..."
    python3 -m venv venv || true
    source venv/bin/activate
    pip install -r requirements.txt
elif [ "$choice" = "5" ]; then
    echo "[INFO] 수험 데이터 무결성 검증을 수행합니다..."
    source venv/bin/activate
    python scripts/validate_data.py
elif [ "$choice" = "6" ]; then
    read -p "분석할 마크다운 파일 경로를 입력하세요: " notepath
    source venv/bin/activate
    python scripts/ingest_incremental.py "$notepath"
else
    echo "[ERROR] 올바른 번호를 선택해주세요."
fi
