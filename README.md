# SDG Navigator Project

원형 카드 캐러셀 UI를 기반으로 SDG 탐색 화면과 상세 화면을 구성한 프로젝트입니다.

## Reference
- 원본 레퍼런스: https://fff.cmiscm.com/#!/main

## 실행 방법

```bash
npm start
```

- 접속 주소: `http://localhost:3000`

## 주요 기능
- 원형 카드 캐러셀 드래그/관성/스냅
- 카드 클릭 시 중앙 정렬(focus) 동작
- SDG 상세 페이지 분리 (`/sdg.html`)
- 간단 백엔드 API 연동 (목록/상세/방문/액션)
- 하단 링크 액션 (`FULLSCREAN`, `SDG SITE`)

## 프로젝트 구조
- `server.js`: Node.js 정적 파일 서버 + API
- `public/index.html`: 메인 캐러셀 페이지
- `public/sdg.html`: SDG 상세 페이지
- `public/js/carousel.js`: 캐러셀 렌더/인터랙션 로직
- `public/js/sdg-detail.js`: 상세 페이지 API 호출
- `public/css/main.css`: 메인/상세 공통 스타일

## API
- `GET /api/sdgs`
- `GET /api/sdgs/:id`
- `POST /api/sdgs/:id/visit`
- `POST /api/sdgs/:id/action`

## 커스터마이징 포인트
- 카드 배치/크기/원 위치: `public/js/carousel.js`의 `config`
- 카드/텍스트 스타일: `public/css/main.css`
- 상세 페이지 렌더링: `public/js/sdg-detail.js`
