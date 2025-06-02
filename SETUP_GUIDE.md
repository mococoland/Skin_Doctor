# 의사앱 + 스킨케어 백엔드 연동 가이드

## 📋 개요
이 가이드는 팀원이 만든 의사앱(Skin_Doctor)을 기존 스킨케어 프로젝트의 백엔드와 연동하는 방법을 설명합니다.

## 🏗️ 아키텍처
```
📁 C:\Users\USER\
├── 📁 Skin-Project-main\        # 메인 스킨케어 프로젝트
│   ├── 📁 skin_project\         # FastAPI 백엔드 (포트 8000)
│   └── 📁 src\                  # React Native 앱 (환자용)
└── 📁 doctor-app\               # 의사용 앱 (포트 8081)
    └── 📁 src\                  # React Native 앱 (의사용)
```

## 🚀 실행 순서

### 1단계: 백엔드 서버 실행 (필수)
먼저 스킨케어 프로젝트의 백엔드를 실행해야 합니다.

```bash
# 메인 프로젝트로 이동
cd C:\Users\USER\Skin-Project-main\skin_project

# Python 가상환경 활성화 (이미 설정되어 있다면)
# venv\Scripts\activate

# 백엔드 서버 실행
python main.py
```

백엔드가 성공적으로 실행되면 다음 메시지를 볼 수 있습니다:
```
✅ 데이터베이스 연결 성공!
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

### 2단계: 의사앱 실행

새 터미널을 열고 의사앱을 실행합니다:

```bash
# 의사앱 디렉토리로 이동
cd C:\Users\USER\doctor-app

# Metro 서버 시작
npm start

# 새 터미널에서 안드로이드 실행
npm run android
```

### 3단계: 환자앱 실행 (선택사항)

환자앱도 함께 테스트하려면:

```bash
# 메인 프로젝트로 이동
cd C:\Users\USER\Skin-Project-main

# Metro 서버 시작 (다른 포트)
npm start --port 8082

# 새 터미널에서 안드로이드 실행
npm run android
```

## 🔗 API 연동 상황

### ✅ 이미 구현된 백엔드 API
현재 스킨케어 백엔드에는 의료진 관련 모든 API가 구현되어 있습니다:

- **의사 관리**: `/api/medical/doctors`
- **병원 관리**: `/api/medical/hospitals`  
- **예약 관리**: `/api/medical/appointments`
- **진단 요청**: `/api/medical/diagnosis-requests`
- **의료 기록**: `/api/medical/records`
- **인증**: `/api/auth/login`, `/api/auth/register`

### 🆕 의사앱에 추가된 파일
```
📁 doctor-app/src/
├── 📁 config/
│   └── api.ts                   # API 설정 및 헬퍼 함수
└── 📁 services/
    └── medicalService.ts        # 의료진 API 호출 함수들
```

### 📊 실시간 데이터 연동
의사앱의 DashboardScreen이 실제 백엔드 데이터와 연동되도록 수정되었습니다:

- **실시간 예약 현황**: 오늘 예약, 대기 중, 완료된 예약 수
- **환자 통계**: 총 진료한 환자 수
- **자동 새로고침**: 화면 진입 시 최신 데이터 로드

## 🛠️ 테스트 방법

### 1. 백엔드 연결 테스트
브라우저에서 `http://localhost:8000/docs`에 접속하여 FastAPI 문서를 확인합니다.

### 2. 의사앱 API 연결 테스트
의사앱에서 대시보드 화면에 진입하면 자동으로 백엔드에서 데이터를 가져옵니다.
- 연결 성공: 실제 통계 데이터 표시
- 연결 실패: 오류 메시지 표시

### 3. 두 앱 간 데이터 공유 테스트
1. 환자앱에서 예약 생성
2. 의사앱 대시보드에서 새 예약 확인
3. 의사앱에서 진료 결과 작성
4. 환자앱에서 진료 결과 확인

## 🔧 문제 해결

### 백엔드 연결 오류
```
오류: 데이터를 불러오는 중 오류가 발생했습니다.
```
**해결방법**:
1. 백엔드 서버가 실행 중인지 확인 (`http://localhost:8000`)
2. PostgreSQL 데이터베이스가 실행 중인지 확인
3. 방화벽이 포트 8000을 차단하지 않는지 확인

### Metro 포트 충돌
두 React Native 앱을 동시에 실행할 때 포트 충돌이 발생할 수 있습니다.

**해결방법**:
```bash
# 의사앱
npm start --port 8081

# 환자앱  
npm start --port 8082
```

### Android 빌드 오류
```bash
# 캐시 클리어
npx react-native start --reset-cache

# 안드로이드 클린 빌드
cd android && ./gradlew clean && cd ..
npm run android
```

## 📱 주요 기능

### 의사앱 기능
- **대시보드**: 예약 현황, 환자 통계
- **예약 관리**: 환자 예약 조회 및 관리
- **진료 결과 작성**: 진단 결과 및 처방전 작성
- **환자 이력**: 과거 진료 기록 조회
- **프로필 관리**: 의사 정보 수정

### 환자앱 기능
- **제품 추천**: AI 기반 스킨케어 제품 추천
- **의료진 예약**: 피부과 의사 예약
- **진료 결과 조회**: 진료 기록 및 처방전 확인
- **제품 리뷰**: 사용 후기 작성 및 조회

## 🎯 다음 단계

1. **실제 인증 시스템 구현**: 현재는 테스트 데이터 사용
2. **실시간 알림**: WebSocket을 통한 실시간 알림
3. **이미지 업로드**: 피부 사진 업로드 및 분석
4. **푸시 알림**: 예약 알림, 진료 결과 알림
5. **데이터 동기화**: 두 앱 간 실시간 데이터 동기화

## 📞 지원

문제가 발생하면 다음을 확인해주세요:
1. 백엔드 로그: `skin_project/main.py` 실행 터미널
2. 의사앱 로그: Metro 터미널 및 디바이스 로그
3. 네트워크 연결: `curl http://localhost:8000/health` 