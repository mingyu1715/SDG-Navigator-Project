# SDG Navigator

지속가능발전목표(SDGs) 17개를 원형 대시보드에서 탐색하고, 각 목표별 인터랙티브 상세 체험으로 연결하는 웹 플랫폼입니다.

- 배포 URL: <https://sdgnavigator.vercel.app/>
- 프로젝트 유형: 정적 SPA
- 주요 대상: 청소년·학생
- 주요 화면: 회전 원형 메인 대시보드, SDG 1–17 상세 체험 페이지

## 실행

```bash
npm start
```

로컬 확인 URL:

```text
http://localhost:3000
```

현재 로컬 서버는 `python3 -m http.server 3000` 기반입니다. 메인 화면에서 상세 페이지로 이동하는 흐름은 정상 확인할 수 있지만, 로컬에서 `/detailed/sdg-xx/` 경로를 직접 새로고침하면 정적 서버 특성상 404가 날 수 있습니다. 배포 환경은 `vercel.json`의 rewrite 설정으로 상세 경로 직접 진입을 처리합니다.

## 핵심 기능

- 17개 SDG 목표를 원형 카드 UI로 배치
- 드래그와 관성 기반 메인 네비게이션
- 카드 선택 시 문서 이동 없이 상세 화면으로 전환
- 브라우저 뒤로가기/앞으로가기 지원
- `/detailed/sdg-01/`부터 `/detailed/sdg-17/`까지 상세 경로 제공
- 목표별 인터랙션, 애니메이션, 결과 수치, 참고 자료 표시
- SDG 1, 16, 17 등 일부 페이지에서 지구본/지도형 시각화 사용
- Vercel 배포용 정적 SPA rewrite 설정 포함

## SDG 상세 콘텐츠

| SDG | 상세 주제 |
| --- | --- |
| 1 | 생존의 로또 |
| 2 | 잊혀진 냉장고의 복수 |
| 3 | 응급 접근의 격차 |
| 4 | 문맹의 시선 |
| 5 | 임금 시계 |
| 6 | 물통의 무게 |
| 7 | 우리 도시 에너지 믹스 |
| 8 | 성장과 고용의 딜레마 |
| 9 | 미래 연결 브릿지 |
| 10 | 부의 케이크 나누기 |
| 11 | 스마트 그린 시티 설계 |
| 12 | 쓰레기 유령 |
| 13 | 침수 한계선 |
| 14 | 바다의 위장 |
| 15 | 멸종의 도미노 |
| 16 | 침묵의 총성 |
| 17 | 글로벌 네트워크 |

## 폴더 구조

```text
.
├── index.html
├── app/
│   ├── main.js
│   ├── appNavigation.js
│   ├── router.js
│   ├── transitions.js
│   ├── views/
│   │   ├── mainView.js
│   │   ├── detailFrame.js
│   │   └── detailView.js
│   ├── details/
│   │   ├── registry.js
│   │   ├── rendererContract.js
│   │   ├── sdg01Content.js
│   │   └── sdg17Content.js
│   ├── data/
│   │   ├── sdgs.js
│   │   ├── sdgs.json
│   │   └── sdgSourceRegistry.js
│   └── services/
│       └── sdgService.js
├── css/
│   ├── app.css
│   ├── loader.css
│   └── styles/
│       ├── layout/
│       └── pages/
├── docs/
│   ├── sdg-data-source-audit.md
│   └── final-submission-checklist.md
├── vercel.json
└── package.json
```

## 주요 파일

- `index.html`: SPA 엔트리 문서
- `app/main.js`: 앱 부트스트랩
- `app/appNavigation.js`: 메인/상세 전환 흐름 제어
- `app/router.js`: History API 기반 라우팅
- `app/transitions.js`: 메인 카드와 상세 화면 전환 애니메이션
- `app/views/mainView.js`: 원형 카드 UI, 드래그, 관성 처리
- `app/views/detailFrame.js`: 상세 페이지 공통 프레임
- `app/views/detailView.js`: 상세 콘텐츠 렌더링 오케스트레이션
- `app/details/registry.js`: SDG별 커스텀 상세 렌더러 등록
- `app/details/sdgXXContent.js`: 각 SDG 상세 화면 로직
- `app/details/sdgXXContentModel.js`: 각 SDG 상세 데이터/상태 모델
- `app/data/sdgs.js`: 메인 카드용 SDG 메타데이터 로드
- `app/data/sdgSourceRegistry.js`: 수치·자료 출처 관리
- `docs/sdg-data-source-audit.md`: SDG별 데이터 출처 점검 문서
- `docs/final-submission-checklist.md`: 최종 제출 전 정적 점검 문서
- `css/styles/pages/sdgXX.css`: SDG별 상세 화면 스타일
- `vercel.json`: Vercel 상세 경로 rewrite 설정

## 상세 페이지 수정 방법

1. 화면 로직 수정: `app/details/sdgXXContent.js`
2. 수치·상태 모델 수정: `app/details/sdgXXContentModel.js`
3. 스타일 수정: `css/styles/pages/sdgXX.css`
4. 상세 페이지 등록/타이틀 수정: `app/details/registry.js`
5. SDG 기본 카드 정보 수정: `app/data/sdgs.json` 또는 `app/data/sdgs.js`

## 데이터와 출처 관리

통계, 지표, 현실값을 추가하거나 수정할 때는 공식 또는 권위 있는 출처를 먼저 확인합니다.

- 공식 통계값: 출처명, 기준연도, 지표 정의, URL을 데이터 모델 또는 `app/data/sdgSourceRegistry.js`에 남깁니다.
- 체험용 환산값: UI와 코드에서 공식 통계가 아니라 시뮬레이션 값임을 구분합니다.
- 출처 점검 내용: `docs/sdg-data-source-audit.md`에 정리합니다.

## 배포

Vercel 정적 배포를 기준으로 합니다.

```json
{
  "rewrites": [
    {
      "source": "/detailed/:path*",
      "destination": "/index.html"
    }
  ]
}
```

이 설정으로 상세 페이지 URL을 직접 열거나 새로고침해도 SPA 엔트리인 `index.html`로 진입합니다.
