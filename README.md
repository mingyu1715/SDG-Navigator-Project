# SDG Navigator Project

원형 카드 캐러셀 기반 SDG 탐색 UI + 상세 페이지 + Node.js API 프로젝트입니다.

## Reference
- 원본 레퍼런스: https://fff.cmiscm.com/#!/main

## 실행

```bash
npm start
```

- 로컬 주소: `http://localhost:3000`

## 핵심 구조

### 1) 서버 통합 진입점
- `server.js`
  - 서버 시작
  - API 라우트 연결
  - 정적 파일 서빙

### 2) API 라우트
- `routes/sdgRoutes.js`
  - `GET /api/sdgs`
  - `GET /api/sdgs/:id`
  - `POST /api/sdgs/:id/visit`
  - `POST /api/sdgs/:id/action`

### 3) 서비스 계층 (SDG별 분리)
- `services/sdg/sdg1Service.js` ~ `services/sdg/sdg17Service.js`
  - SDG별 데이터/비즈니스 로직
- `services/sdg/index.js`
  - 서비스 통합 레지스트리
- `services/sdg/createSdgService.js`
  - 공통 서비스 생성 팩토리

### 4) 공통 HTTP 유틸
- `lib/httpUtils.js`
  - `sendJson`, `sendFile`, `parseBody`

### 5) 프론트
- 메인 캐러셀
  - `public/index.html`
  - `public/js/carousel.js`
  - `public/css/main.css`
- 상세 페이지 (SDG별 폴더 분리)
  - `public/detailed/sdg-01/` ... `public/detailed/sdg-17/`
    - `index.html`
    - `style.css`
    - `script.js`
  - 공통(임시): `public/detailed/common/detail-common.js`, `detail-common.css`  
    상세 개발 시 필수 아님, 페이지별 독립 구현 가능

## 상세 페이지 라우팅
- 메인 카드 클릭 시: `/detailed/sdg-XX/`로 이동

## SDG 하나 추가/수정 방법

### 데이터/백엔드
1. `services/sdg/sdgNService.js` 수정
2. `services/sdg/index.js`에 서비스 등록/확인

### 프론트 상세
1. `public/detailed/sdg-XX/index.html`
2. `public/detailed/sdg-XX/style.css`
3. `public/detailed/sdg-XX/script.js`

## API 요약
- `GET /api/sdgs`: SDG 목록 요약
- `GET /api/sdgs/:id`: SDG 상세
- `POST /api/sdgs/:id/visit`: 방문수 증가
- `POST /api/sdgs/:id/action`: 샘플 액션 실행
