<div align="center">

# 🌸 AuRA
### 당신의 느낌을 향으로 기록하다

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MariaDB](https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)

> 온라인 향수 전문 쇼핑몰 | 4Team Project | 2025.12

</div>

---

## 📌 프로젝트 소개

온라인 향수 시장의 지속적인 성장에 따라, 소비자들이 향수 정보에 쉽게 접근하고 구매까지 이어지는 **전문 향수 웹사이트**를 구축하였습니다.

각 향수마다 고유한 스토리를 제공하여 사용자가 이미지를 상상하고 감성적으로 경험할 수 있도록 설계하였으며, AI 이미지·광고 영상을 활용한 고급스러운 브랜드 경험을 구현하였습니다.

```
🎯 개발 기간 : 2025.12.02 ~ 2025.12.15 (2주)
👥 팀 구성   : 4명 (팀장 1 + 팀원 3)
🏷️ 프로젝트  : 향수 전문 E-Commerce 웹사이트
```

---

## 🛠️ 기술 스택

### Frontend
```
React.js     — SPA 구성, 상태 관리 (useState / useEffect)
React Router — 동적 페이지 이동 (navigate, useLocation)
HTML5 / CSS3 — 퍼블리싱 및 반응형 레이아웃
localStorage — 로그인 상태·다크모드·장바구니 유지
```

### Backend
```
Node.js      — 서버 런타임
Express      — REST API 라우팅
MariaDB      — 관계형 데이터베이스
```

### 협업 도구
```
GitHub       — 브랜치 전략 기반 버전 관리
Notion       — WBS 일정 관리 및 업무 체크리스트
Figma        — UI/UX 디자인 목업
ERD Cloud    — 데이터베이스 관계도 설계
DBeaver      — DB 관리
```

---

## 👥 팀원 및 역할 분담

| 이름 | 역할 | 담당 기능 |
|:---:|:---:|---|
| **김한결** | 팀장 / Full-Stack | 프로젝트 기획·총괄, Git 환경 구축, MariaDB 서버 구축, Front-Back 연동, 검색·상품등록·카테고리, 주문·마이페이지, 관리자 권한 시스템, 통합 테스트·버그 수정 |
| **윤종빈** | Back-end · AI | DB 설계, 로그인·주문·장바구니 로직, AI 챗봇·이미지 추출·광고 영상 제작, 프론트-백 하이브리드 |
| **신은지** | Front-end · UI/UX | 전체 레이아웃 설계, 메인 화면·컴포넌트 UI, 회원가입, 관리자 마이페이지·주문정보 수정 UI |
| **이선화** | Front-end · UX | 마이페이지·위시리스트·장바구니·결제·고객센터 페이지, AI 상품이미지 추출 |

---

## 🗂️ 프로젝트 구조

```
AuRA/
├── 📁 frontend/
│   ├── public/
│   └── src/
│       ├── pages/
│       │   ├── Main.jsx          # 메인 페이지 (로그인·다크모드)
│       │   ├── Category.jsx      # 카테고리 (아코디언 UI)
│       │   ├── Products.jsx      # 전체 상품 (가격 필터·정렬)
│       │   ├── ProductDetail.jsx # 상품 상세 (향 구성·스펙·스토리)
│       │   ├── Search.jsx        # 태그 기반 키워드 검색
│       │   ├── Cart.jsx          # 장바구니
│       │   ├── Payment.jsx       # 결제 (카카오페이·네이버페이·카드·현금)
│       │   ├── MyPage.jsx        # 마이페이지 (일반·관리자 분기)
│       │   ├── WishList.jsx      # 위시리스트
│       │   ├── Register.jsx      # 회원가입 (일반·사업자 분기)
│       │   └── Service.jsx       # 고객센터 (1:1문의·카카오톡)
│       └── components/
│           ├── Header.jsx
│           └── Footer.jsx
│
└── 📁 backend/
    └── api/
        ├── /auth                 # 로그인·회원가입
        ├── /products             # 상품 CRUD
        ├── /category             # 카테고리 조회
        ├── /cart                 # 장바구니
        ├── /order                # 주문·배송 상태
        ├── /payment              # 결제 (카카오페이 연동)
        ├── /wishlist             # 위시리스트
        ├── /returns              # 교환·반품
        ├── /admin                # 관리자 전용
        └── /check-users          # 회원 조회 (관리자)
```

---

## 🗄️ 데이터베이스 구조

> ERD Cloud를 활용하여 사용자 / 제품 / 주문 3개 도메인을 중심으로 설계

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   사용자 (User)  │    │  제품 (Product)  │    │   주문 (Order)  │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ member          │    │ product         │    │ orders          │
│ wishlist        │    │ category        │    │ order_items     │
│ search_history  │    │ brand           │    │ payments        │
│ chat_logs       │    │ product_image   │    │ cart            │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                      │                      │
        └──────────────────────┴──────────────────────┘
                    review / returns 연동
```

**설계 원칙**
- 실제 쇼핑몰 흐름을 반영한 정규화 구조
- 주문(orders) ↔ 주문상품(order_items) 분리로 다중 상품 주문 구현
- 데이터 중복 최소화 및 확장성 고려

---

## ✨ 주요 기능

### 🔐 인증
```javascript
// localStorage 기반 로그인 상태 유지
useEffect(() => {
  const saved = localStorage.getItem("login");
  setLogin(saved === "true");
}, []);

// 다크모드 상태 유지
document.body.classList.toggle("dark", newMode);
localStorage.setItem("darkMode", newMode);
```

### 🛒 장바구니 — 비로그인/로그인 분기 처리
```javascript
// 비로그인 → localStorage 임시 장바구니
if (!userId || userId === "null") {
  const key = "guest_cart";
  const cart = JSON.parse(localStorage.getItem(key) || "[]");
  // 중복 상품 수량 증가 처리
}

// 로그인 → DB 기반 장바구니
await fetch(`${API_URL}/api/cart/add`, {
  method: "POST",
  body: JSON.stringify({ user_id, product_id, count: quantity })
});
```

### ❤️ 위시리스트 — Toggle Pattern
```javascript
const toggleWish = () => {
  if (!userId) return alert("로그인이 필요합니다!");
  if (isInWish) {
    removeFromWish(product.product_id);
    setIsInWish(false);
  } else {
    addToWish({ product_id: product.product_id });
    setIsInWish(true);
  }
};
```

### 🔍 키워드 검색 — URL 쿼리 파라미터
```javascript
// 검색 시 URL 파라미터로 상태 관리
navigate(`/search?keyword=${searchInput}`);

// 페이지 로드 시 URL에서 키워드 추출
const params = new URLSearchParams(location.search);
const searchKeyword = params.get("keyword")?.toLowerCase();
```

### 💳 결제 — 결제수단 분기
```javascript
// 카카오페이
app.post("/api/kakao-pay/ready", async (req, res) => {
  const data = await kakaoPay(items, total);
  res.json(data);
});

// 네이버페이 / 카드 / 현금 각각 분기 처리
// Transaction 상태: ready → pending → done
```

### 🏢 관리자 — 권한 분리
```javascript
// ADMIN 권한 체크
if (localStorage.getItem("role") !== "ADMIN") return;

// 배송 상태 변경
const ORDER_STATUS_TEXT = {
  pending:   "상품 준비중",
  paid:      "배송 준비 완료",
  shipping:  "배송 중",
  completed: "배송 완료",
  cancel:    "주문 취소"
};
```

---

## 📅 WBS (업무 분담 계획)

| WBS ID | 분류 | 기능 | 담당 | 기간 |
|:---:|:---:|---|:---:|:---:|
| 1 | 기획 | 프로젝트 목표·일정·역할 분담 | 전원 | 12/02 ~ 12/03 |
| 2 | UI/UX | 공통 레이아웃 (Header·Footer) | 전원 | 12/02 ~ 12/03 |
| 2.1 | UI/UX | 페이지별 UI·반응형 설계 | 신은지, 이선화 | 12/02 ~ 12/04 |
| 3 | 상품 | 메인 배너·추천 상품 | 김한결 | 12/08 ~ 12/15 |
| 3.1 | 상품 | 상품 목록·카테고리 분류 | 윤종빈 | 12/08 ~ 12/09 |
| 4 | 회원 | 회원가입·로그인 | 신은지, 윤종빈 | 12/04 ~ 12/08 |
| 5 | 구매 | 장바구니·주문·결제 | 윤종빈, 이선화 | 12/04 ~ 12/15 |
| 6 | 마이페이지 | 주문내역·위시리스트 | 이선화, 김한결 | 12/05 ~ 12/15 |
| 7 | 커뮤니케이션 | 리뷰·고객센터 | 이선화 | 12/03 ~ 12/15 |
| 8 | AI | 이미지 생성·광고 영상·챗봇 | 윤종빈, 이선화 | 12/02 ~ 12/12 |
| 9 | 백엔드 | DB 구축·검색·테스트·버그 수정 | 김한결 | 12/02 ~ 12/15 |

---

## 📊 프로젝트 성과

```
✅ 계획된 일정 내 모든 핵심 기능 구현 완료
✅ 초기 목표 대비 115% 기능 구현
✅ AI 이미지·영상 활용 마케팅 콘텐츠 제작
✅ 관리자·사용자 권한 분리 구조 구현
✅ 카카오페이 결제 준비 API 연동
```

---

## 🔧 아쉬운 점 & 개선 사항

| 항목 | 내용 |
|---|---|
| 배포 | 로컬 환경 기반 개발 — 실서버 배포 미완료 |
| 챗봇 | 프론트·백엔드·DB 구현 완료, GPT API 결제 미진행 |
| 리뷰 | UI 구현 완료, 백엔드 연동 미완료 (NOTYET) |
| 1:1 문의 | UI 구현 완료, 기능 구현 미완료 (NOTYET) |
| 모바일 앱 | 웹 기반 개발 — 네이티브 앱 미지원 |
| 다국어 | 한국어 전용 — 글로벌 지원 필요 |

---

## 💬 팀원 회고

<details>
<summary><b>김한결 (팀장)</b></summary>

> 팀 프로젝트를 수행하며 소통과 협업이 결과물의 완성도에 직접적인 영향을 미친다는 점을 몸소 체감할 수 있었습니다. 전체 일정과 작업 흐름을 관리하고 조율하는 과정을 통해 프로젝트 운영에서 관리와 조정의 중요성을 경험하였습니다. GitHub, Notion, DBeaver 등 협업 도구를 활용하면서 체계적인 협업 환경이 작업 효율을 크게 향상시킨다는 점을 이해하게 되었고, 팀원들과 협력하여 하나의 결과물을 완성했다는 점에서 큰 성취감과 보람을 느꼈습니다.

</details>

<details>
<summary><b>윤종빈</b></summary>

> 첫 프로젝트였던 만큼 개발 과정 전반에서 많은 시행착오와 어려움을 겪었습니다. 기능 구현 과정에서 예상치 못한 문제들이 반복적으로 발생했지만, 그때마다 팀원들과 함께 원인을 분석하고 해결 방안을 논의하며 하나씩 극복해 나갔습니다. 특히 서로의 부족한 부분을 보완하며 문제를 해결해 나간 경험은 단순한 결과물 이상의 의미 있는 성과로 남았습니다.

</details>

<details>
<summary><b>신은지</b></summary>

> 첫 프로젝트이다 보니 이해하는 데 어려움이 많아 팀원들의 도움을 많이 받았고, 전반적으로 시간이 촉박하게 느껴졌습니다. 다음 프로젝트에서는 AI 도구에 대한 의존도를 줄이고, 스스로 문제를 해결하며 다른 팀원의 질문에도 도움을 줄 수 있을 만큼 성장하고자 합니다.

</details>

<details>
<summary><b>이선화</b></summary>

> 프로젝트 기간 동안 맡은 역할에 책임감을 가지고 과제를 수행하며 팀의 목표 달성에 기여하고자 노력했습니다. 이 경험을 통해 개인 건강 관리 또한 프로젝트 수행에 중요한 요소라는 점을 인식하게 되었고, 다음 프로젝트에서는 일정 관리뿐만 아니라 컨디션 조절에도 더욱 신경 쓰고자 합니다.

</details>

---

<div align="center">

**4team-project · AuRA · 2025**

</div>
