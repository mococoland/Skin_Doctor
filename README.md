# 🩺 Skin Doctor App

의사용 피부 진단 앱 - 환자의 피부 상태를 확인하고 진단을 제공하는 의료진용 앱입니다.

---

## 🚀 개발 환경 실행 가이드

### ✅ 1. 프로젝트 설정

```bash
cd doctor-app
npm install
```

### ✅ 2. 개발 서버 실행

**처음 설치 시 (한 번만 실행):**
```bash
npm run android:full  # adb reverse + 앱 빌드&설치
```

**개발 중 (매번 실행):**
```bash
npm run dev  # adb reverse + Metro 서버 시작
```

### ✅ 3. 포트 설정

- **의사 앱 Metro 서버**: `8081` (기본 포트)
- **백엔드 API**: `8000`
- **환자 앱 Metro 서버**: `8082`

### ✅ 4. 사용 가능한 스크립트

```bash
npm run dev          # 개발 서버 시작 (adb reverse 포함)
npm run setup        # adb reverse 설정만
npm run start:doctor # Metro 서버만 시작
npm run android      # 앱 빌드 & 실행
npm run android:full # 포트 설정 + 앱 빌드 & 실행
```

### ✅ 5. 포트 기본 설정
- 안드로이드의 경우
- 에뮬레이터에서 Ctrl + M(또는 Cmd + M on Mac) → Dev Settings → Debug server host & port for device 선택
- 10.0.2.2:8082 입력
- (에뮬레이터라면 10.0.2.2:8082 이지만, 단말기의 경우 localhost:8082)
- iOS의 경우
- 시뮬레이터에서 Cmd + D → Dev Settings → Debug server host & port for device에서 동일하게 설정

---

## 🛠 GitHub 협업 가이드: 기능 개발부터 병합까지 (꼭 읽어주세요!)

이 프로젝트는 안정적인 협업을 위해 `main` 브랜치를 보호하고, 모든 작업을 **별도 브랜치 + Pull Request(PR)** 방식으로 관리합니다.

---

### ✅ 1. 기능 개발 시작 전

1. **main 최신화**
```bash
git checkout main
git pull origin main
```

2. **작업용 브랜치 생성**
```bash
git checkout -b feature/이름-작업내용
# 예: feature/jisu-diagnosis-api
```
> `feature/`, `fix/`, `docs/` 등 prefix 사용 규칙 지켜주세요.

---

### ✅ 2. 기능 개발 중

1. **코드 작성**
   - 코드 수정/추가
   - 디렉토리 구조 유지

2. **변경사항 저장**
```bash
git add .
git commit -m "작업 내용 요약: 진단 API 연동 추가"
```
> 커밋 메시지는 **의미 있는 한 줄 설명**으로 남겨주세요.

3. **원격 브랜치 푸시**
```bash
git push origin feature/이름-작업내용
```

---

### ✅ 3. 기능 완료 후 PR 생성

1. GitHub 웹에서 `Pull Request` 클릭
2. `base`는 `main`, `compare`는 자신의 브랜치로 설정
3. PR 제목은 작업 요약 (예: `의사 진단 API 연동 기능 추가`)
4. 본문에는 **한 줄 기능 설명**, 참고 이슈, 변경파일 요약 등 작성
5. 팀원 리뷰어 지정

---

### ✅ 4. 코드 리뷰 & 피드백 반영

- 리뷰 요청 받은 팀원은 코드 확인 후 **승인 or 피드백 댓글**
- 필요시 추가 커밋 → PR에 자동 반영됨
```bash
git add .
git commit -m "리뷰 반영: API 에러 핸들링 추가"
git push
```

---

### ✅ 5. 병합(Merge) & 브랜치 삭제

- 리뷰 승인 ≥ 1명 완료되면 `main` 브랜치로 병합 (Squash 추천)
- 병합 후, 브랜치 삭제 (GitHub에서 버튼 제공됨)

---

### ✅ 6. Pull 후 다음 작업 준비

모든 병합이 끝났으면 다시 main을 pull 받아 최신 상태로 시작하세요:
```bash
git checkout main
git pull origin main
```

---

## 💡 브랜치 명명 규칙

| 작업 유형     | 브랜치 예시                      |
|--------------|----------------------------------|
| 기능 추가     | `feature/jay-patient-list`       |
| 버그 수정     | `fix/jisu-diagnosis-api`         |
| 문서/리드미   | `docs/update-readme`             |
| 테스트        | `test/yeon-api-validation`       |

---

## ❗주의 사항

- 절대 `main` 브랜치에서 직접 작업하지 마세요.
- 무조건 **기능 단위로 브랜치 생성 → PR → 머지** 순서로 진행합니다.
- 충돌 방지를 위해 작업 전 항상 `git pull origin main`을 먼저 하세요.
- 개발 시 반드시 `npm run dev`로 Metro 서버를 시작하세요.

---

## 📱 앱 구조

```
src/
├── components/     # 재사용 가능한 UI 컴포넌트
├── screens/       # 화면별 컴포넌트
├── navigation/    # 네비게이션 설정
├── services/      # API 통신 로직
├── config/        # 앱 설정 및 상수
└── types/         # TypeScript 타입 정의
```

---

이 가이드는 모든 기능 개발의 기본 루틴입니다.  
작업 전에 꼭 확인하고, 팀원 모두 동일한 흐름으로 협업해 주세요 🙏
