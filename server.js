const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");

const SDG_DATA = [
  {
    id: 1,
    title: "No Poverty",
    subtitle: "모든 형태의 빈곤 종식",
    color: "#E5243B",
    description: "취약계층 보호체계 확대와 기본소득 접근성 개선을 통해 빈곤의 악순환을 줄이는 목표입니다.",
    features: ["취약가구 지원 현황 조회", "지역별 복지 제도 안내", "지원 신청 상태 추적"]
  },
  {
    id: 2,
    title: "Zero Hunger",
    subtitle: "기아 종식과 식량안보",
    color: "#DDA63A",
    description: "안전한 식량 공급망과 영양 개선 프로그램을 통해 기아를 줄이고 지속가능한 농업을 촉진합니다.",
    features: ["급식/푸드뱅크 지도", "영양 취약지역 분석", "식량 지원 프로그램 연계"]
  },
  {
    id: 3,
    title: "Good Health",
    subtitle: "건강과 웰빙 보장",
    color: "#4C9F38",
    description: "예방 중심 공중보건과 의료 접근성 개선으로 전 생애 건강한 삶을 지원합니다.",
    features: ["예방접종 일정 알림", "지역 의료기관 검색", "건강지표 대시보드"]
  },
  {
    id: 4,
    title: "Quality Education",
    subtitle: "포용적이고 공정한 교육",
    color: "#C5192D",
    description: "학습 격차를 줄이고 모든 사람에게 평생학습 기회를 제공하는 교육 생태계를 목표로 합니다.",
    features: ["학습 리소스 모음", "과목별 진도 트래커", "온라인 멘토링 연계"]
  },
  {
    id: 5,
    title: "Gender Equality",
    subtitle: "성평등 달성",
    color: "#FF3A21",
    description: "성별에 따른 차별을 줄이고 안전한 사회환경 조성을 통해 동등한 기회를 보장합니다.",
    features: ["성평등 지표 모니터", "신고/상담 연결", "정책 안내 허브"]
  },
  {
    id: 6,
    title: "Clean Water",
    subtitle: "물과 위생 보장",
    color: "#26BDE2",
    description: "안전한 물 접근성과 위생시설 개선을 통해 수인성 질병 위험을 줄이는 목표입니다.",
    features: ["수질 측정 데이터", "노후 상수도 점검", "위생 교육 콘텐츠"]
  },
  {
    id: 7,
    title: "Clean Energy",
    subtitle: "모두를 위한 에너지",
    color: "#FCC30B",
    description: "재생에너지 확대와 에너지 효율 개선으로 지속가능한 전력 사용을 촉진합니다.",
    features: ["태양광 잠재량 확인", "전력 사용량 비교", "에너지 절감 팁"]
  },
  {
    id: 8,
    title: "Decent Work",
    subtitle: "양질의 일자리와 성장",
    color: "#A21942",
    description: "안전한 노동환경과 포용적 고용정책으로 지속가능한 경제성장을 지원합니다.",
    features: ["일자리 매칭", "근로권익 가이드", "산업별 고용 통계"]
  },
  {
    id: 9,
    title: "Industry & Innovation",
    subtitle: "산업·혁신·인프라",
    color: "#FD6925",
    description: "디지털 전환과 혁신 인프라 구축을 통해 생산성과 회복력을 높이는 목표입니다.",
    features: ["스마트 인프라 지도", "혁신 사례 아카이브", "R&D 지원 정보"]
  },
  {
    id: 10,
    title: "Reduced Inequalities",
    subtitle: "불평등 완화",
    color: "#DD1367",
    description: "소득·기회 격차를 줄이고 모두가 동등하게 참여할 수 있는 사회를 지향합니다.",
    features: ["격차 지표 시각화", "지원 정책 매칭", "지역별 불평등 추세"]
  },
  {
    id: 11,
    title: "Sustainable Cities",
    subtitle: "지속가능 도시",
    color: "#FD9D24",
    description: "도시의 주거·교통·환경 문제를 통합적으로 해결해 안전하고 포용적인 도시를 만듭니다.",
    features: ["대중교통 접근성 지도", "도시 안전 리포트", "생활권 환경 지표"]
  },
  {
    id: 12,
    title: "Responsible Consumption",
    subtitle: "책임 있는 소비와 생산",
    color: "#BF8B2E",
    description: "자원 사용을 줄이고 순환경제 전환을 촉진해 지속가능한 소비 패턴을 만듭니다.",
    features: ["탄소발자국 계산", "재활용 가이드", "친환경 제품 비교"]
  },
  {
    id: 13,
    title: "Climate Action",
    subtitle: "기후변화 대응",
    color: "#3F7E44",
    description: "기후 리스크를 줄이기 위한 완화·적응 전략을 강화하고 지역 단위 실천을 촉진합니다.",
    features: ["기후 리스크 지도", "폭염/홍수 알림", "행동 체크리스트"]
  },
  {
    id: 14,
    title: "Life Below Water",
    subtitle: "해양 생태 보전",
    color: "#0A97D9",
    description: "해양 오염과 생태계 파괴를 줄이고 바다 자원의 지속가능한 이용을 목표로 합니다.",
    features: ["해양 쓰레기 신고", "연안 생태 모니터링", "보호구역 정보"]
  },
  {
    id: 15,
    title: "Life on Land",
    subtitle: "육상 생태 보전",
    color: "#56C02B",
    description: "산림·토양·생물다양성을 보호하고 훼손된 생태계를 회복시키는 목표입니다.",
    features: ["산림 훼손 추이", "생물종 관찰 기록", "복원 프로젝트 참여"]
  },
  {
    id: 16,
    title: "Peace & Justice",
    subtitle: "평화·정의·제도",
    color: "#00689D",
    description: "투명하고 책임 있는 제도 구축으로 시민 신뢰를 높이고 사회적 갈등을 완화합니다.",
    features: ["공공데이터 투명성", "민원 처리 현황", "법률 지원 안내"]
  },
  {
    id: 17,
    title: "Partnerships",
    subtitle: "목표 달성을 위한 협력",
    color: "#19486A",
    description: "정부·기업·시민사회 간 협력을 통해 SDG 이행 역량을 확장하고 자원을 연결합니다.",
    features: ["협력 파트너 매칭", "프로젝트 제안서 템플릿", "공동 성과 대시보드"]
  },
  {
    id: 18,
    title: "Local Impact",
    subtitle: "지역 실행과 시민 참여",
    color: "#111111",
    description: "지역 단위의 실천 과제 발굴과 시민 참여를 통해 SDG 이행을 생활권에서 가속합니다.",
    features: ["동네 과제 제안", "참여형 캠페인 신청", "지역 성과 리포트"]
  }
];

const visits = new Map();

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function sendFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      sendJson(res, 404, { error: "Not found" });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = {
      ".html": "text/html; charset=utf-8",
      ".css": "text/css; charset=utf-8",
      ".js": "application/javascript; charset=utf-8",
      ".json": "application/json; charset=utf-8",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".svg": "image/svg+xml"
    }[ext] || "application/octet-stream";

    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
}

function parseBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const { pathname } = url;

  if (pathname === "/api/sdgs" && req.method === "GET") {
    const simple = SDG_DATA.map(({ id, title, subtitle, color }) => ({ id, title, subtitle, color }));
    sendJson(res, 200, simple);
    return;
  }

  const sdgMatch = pathname.match(/^\/api\/sdgs\/(\d+)$/);
  if (sdgMatch && req.method === "GET") {
    const id = Number(sdgMatch[1]);
    const goal = SDG_DATA.find((item) => item.id === id);
    if (!goal) {
      sendJson(res, 404, { error: "Goal not found" });
      return;
    }
    sendJson(res, 200, goal);
    return;
  }

  const visitMatch = pathname.match(/^\/api\/sdgs\/(\d+)\/visit$/);
  if (visitMatch && req.method === "POST") {
    const id = Number(visitMatch[1]);
    const goal = SDG_DATA.find((item) => item.id === id);
    if (!goal) {
      sendJson(res, 404, { error: "Goal not found" });
      return;
    }

    const prev = visits.get(id) || 0;
    const next = prev + 1;
    visits.set(id, next);

    sendJson(res, 200, { goalId: id, visits: next });
    return;
  }

  const actionMatch = pathname.match(/^\/api\/sdgs\/(\d+)\/action$/);
  if (actionMatch && req.method === "POST") {
    const id = Number(actionMatch[1]);
    const goal = SDG_DATA.find((item) => item.id === id);
    if (!goal) {
      sendJson(res, 404, { error: "Goal not found" });
      return;
    }

    const body = await parseBody(req);
    const action = body.action || "unknown";

    sendJson(res, 200, {
      goalId: id,
      action,
      message: `${goal.title}에 대한 '${action}' 액션이 처리되었습니다.`
    });
    return;
  }

  let filePath = path.join(PUBLIC_DIR, pathname === "/" ? "index.html" : pathname);

  // /sdg 라우트 편의 지원
  if (pathname === "/sdg") {
    filePath = path.join(PUBLIC_DIR, "sdg.html");
  }

  // path traversal 방지
  if (!filePath.startsWith(PUBLIC_DIR)) {
    sendJson(res, 403, { error: "Forbidden" });
    return;
  }

  sendFile(res, filePath);
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
