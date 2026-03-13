# SDG Navigator (SPA)

원형 드래그 카드 메인 화면과 상세 화면을 한 문서 안에서 전환하는 SPA 프로젝트입니다.

## 실행

```bash
npm start
```

- URL: `http://localhost:3000`

## 현재 동작

- 단일 앱 셸: `public/index.html`
- 카드 클릭 시 문서 이동 없이 in-app 라우팅 전환
- 브라우저 뒤로가기/앞으로가기 지원 (`history.pushState`)
- 새로고침 시 항상 메인(`/`)으로 복귀
- 초기 진입 시 오버레이 로더 표시

## 폴더 구조 (핵심)

- `server.js`: API + 정적 파일 + SPA fallback
- `public/index.html`: SPA 엔트리
- `public/css/app.css`: 메인/상세 공통 UI
- `public/css/loader.css`: 초기 로딩 오버레이
- `public/app/main.js`: 앱 부트스트랩, 뷰 전환 제어
- `public/app/router.js`: History API 라우터
- `public/app/transitions.js`: 메인 <-> 상세 GSAP 전환
- `public/app/views/mainView.js`: 원형 카드 UI/드래그/관성
- `public/app/views/detailView.js`: 상세 렌더링/SDG01 레거시 호스트
- `public/app/services/sdgService.js`: 상세 데이터 로드
- `public/app/data/sdgs.js`: SDG 기본 메타 데이터
- `public/app/data/detailDrafts.js`: SDG02~17 임시 상세 초안 데이터

## API

- `GET /api/sdgs`
- `GET /api/sdgs/:id`
- `POST /api/sdgs/:id/visit`
- `POST /api/sdgs/:id/action`

## SDG 상세 데이터 수정

1. 임시 상세(02~17) 수정: `public/app/data/detailDrafts.js`
2. API 기반 상세 로직 수정: `services/sdg/*`, `public/app/services/sdgService.js`
3. SDG01 레거시 화면 수정: `public/detailed/sdg-01/*`
