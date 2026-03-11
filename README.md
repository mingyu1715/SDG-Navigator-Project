# SDG Card Navigator

## Run

```bash
npm start
```

Open: `http://localhost:3000`

## Structure
- `server.js`: Node backend + static file server
- `public/index.html`: SDG 카드 메인 페이지
- `public/sdg.html`: SDG 상세 페이지
- `public/js/carousel.js`: 카드 회전/스냅/페이지 이동
- `public/js/sdg-detail.js`: 상세 페이지 API 호출
- `public/css/main.css`: 공통 스타일

## API

- `GET /api/sdgs`
- `GET /api/sdgs/:id`
- `POST /api/sdgs/:id/visit`
- `POST /api/sdgs/:id/action`
