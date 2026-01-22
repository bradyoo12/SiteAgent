# SiteAgent 프로젝트 가이드

## 프로젝트 개요

SiteAgent는 **대화형 AI를 통해 웹사이트를 생성해주는 서비스**입니다.
사용자가 채팅으로 원하는 사이트를 설명하면, AI 에이전트가 자동으로 웹사이트를 설계하고 생성합니다.

### 핵심 가치
- **무료 시작**: 사용자가 부담 없이 사이트 생성을 시작할 수 있음
- **대화형 UX**: 코딩 지식 없이도 자연어로 사이트 요구사항 전달
- **빠른 프리뷰**: 실시간으로 생성 결과를 확인 가능

---

## 비즈니스 모델

### 사용자 여정
```
[무료 시작] → [대화로 사이트 설계] → [임시 URL 생성] → [크레딧 구매로 전환]
```

### 수익화 전략
1. **무료 티어**
   - 기본 사이트 생성
   - 임시 URL 제공 (예: `username.siteagent.io`)
   - 제한된 기능/페이지 수

2. **유료 전환 (Buy Credits)**
   - 커스텀 도메인 연결
   - 추가 페이지/기능 해제
   - 우선 지원
   - 고급 템플릿 접근

### 전환 포인트
- 임시 URL이 생성된 시점에서 "사이트 공개" 또는 "도메인 연결" 시 크레딧 필요
- 사용자가 가치를 체험한 후 결제하도록 유도

---

## 기술 스택

### 프론트엔드
- **React** (TypeScript)
- 상태 관리: **Zustand**
- 스타일링: Tailwind CSS
- 빌드: Vite

### 백엔드
- **C# / ASP.NET Core**
- API: RESTful
- 인증: JWT + OAuth (Google, GitHub 등)
- 데이터베이스: **PostgreSQL**

### AI/에이전트
- Claude API 활용
- 대화 컨텍스트 관리
- 코드 생성 및 사이트 빌드 파이프라인

### 인프라
- 컨테이너: Docker
- 호스팅: **Azure Web App**
- 배포 자동화: Azure Web App Deploy (자동화)
- 임시 URL: `{project-id}.azurewebsites.net` 형태로 자동 생성

---

## 주요 기능 구조

### 1. 대화 인터페이스 (Chat Interface)
```
├── 메시지 입력/출력
├── AI 응답 스트리밍
├── 사이트 프리뷰 패널
└── 히스토리 관리
```

### 2. 사이트 생성 엔진 (Site Builder Engine)
```
├── 템플릿 시스템
├── 컴포넌트 라이브러리
├── 코드 생성기
└── 빌드/배포 파이프라인
```

### 3. 사용자 대시보드
```
├── 내 프로젝트 목록
├── 크레딧 잔액/구매
├── 도메인 관리
└── 설정
```

### 4. 관리자 패널
```
├── 사용자 관리
├── 사용량 통계
├── 결제 관리
└── 시스템 모니터링
```

---

## 디렉토리 구조 (예상)

```
SiteAgent/
├── claude/                    # Claude 에이전트 가이드 문서
│   └── PROJECT_GUIDE.md
├── frontend/                  # React 프론트엔드
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── store/
│   └── package.json
├── backend/                   # C# ASP.NET Core 백엔드
│   ├── SiteAgent.API/
│   ├── SiteAgent.Core/
│   ├── SiteAgent.Infrastructure/
│   └── SiteAgent.sln
├── shared/                    # 공유 타입/상수
└── docker-compose.yml
```

---

## API 엔드포인트 설계 (초안)

### 인증
- `POST /api/auth/login` - 로그인
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/oauth/{provider}` - OAuth 로그인

### 대화/AI
- `POST /api/chat/message` - 메시지 전송
- `GET /api/chat/history/{projectId}` - 대화 히스토리
- `POST /api/chat/generate` - 사이트 생성 요청

### 프로젝트
- `GET /api/projects` - 프로젝트 목록
- `POST /api/projects` - 프로젝트 생성
- `GET /api/projects/{id}` - 프로젝트 상세
- `PUT /api/projects/{id}` - 프로젝트 수정
- `DELETE /api/projects/{id}` - 프로젝트 삭제
- `POST /api/projects/{id}/publish` - 사이트 배포

### 크레딧/결제
- `GET /api/credits/balance` - 크레딧 잔액
- `POST /api/credits/purchase` - 크레딧 구매
- `GET /api/credits/history` - 사용 내역

---

## 배포 시스템 (Azure Web App)

### 아키텍처
```
[사용자 사이트 생성 요청]
        ↓
[AI가 코드 생성]
        ↓
[Azure Web App 자동 생성]
        ↓
[임시 URL 발급: {project-id}.azurewebsites.net]
        ↓
[사용자에게 프리뷰 제공]
```

### Azure 리소스 구조
- **Resource Group**: `siteagent-user-sites`
- **App Service Plan**: 공유 또는 사용자별 할당
- **Web App**: 프로젝트당 1개 생성
- **Storage Account**: 사용자 에셋 저장

### 자동화 흐름
1. 사용자가 "사이트 배포" 요청
2. 생성된 코드를 Azure Blob에 업로드
3. Azure CLI/SDK로 Web App 생성
4. 코드 배포 (`az webapp deploy`)
5. 임시 URL 반환

### API 엔드포인트 (배포 관련)
- `POST /api/projects/{id}/deploy` - Azure Web App 생성 및 배포
- `GET /api/projects/{id}/deploy/status` - 배포 상태 확인
- `DELETE /api/projects/{id}/deploy` - Web App 삭제 (리소스 정리)

### 비용 관리
- 무료 티어: App Service Free Plan (F1) 사용
- 유료 전환 시: Basic Plan (B1) 이상으로 업그레이드
- 미사용 사이트 자동 정리 (30일 미접속 시 일시 중지)

---

## 개발 우선순위

### Phase 1: MVP (핵심 기능)
1. 사용자 인증 (이메일/OAuth)
2. 기본 대화 인터페이스
3. 간단한 템플릿 기반 사이트 생성
4. 임시 URL 배포

### Phase 2: 수익화
1. 크레딧 시스템 구현
2. 결제 연동 (Stripe/토스페이먼츠)
3. 커스텀 도메인 연결

### Phase 3: 고도화
1. 고급 템플릿 및 컴포넌트
2. 실시간 협업
3. 버전 관리
4. 분석 대시보드

---

## Claude 에이전트 개발 시 참고사항

### 코드 생성 원칙
- 깔끔하고 유지보수 가능한 코드 생성
- 보안 취약점 방지 (SQL Injection, XSS 등)
- 반응형 디자인 기본 적용
- 접근성(a11y) 고려

### 대화 처리 원칙
- 사용자 의도 정확히 파악
- 모호한 요청 시 명확화 질문
- 단계별 진행 상황 안내
- 오류 발생 시 친절한 안내

### 제한사항
- 생성 가능한 사이트 유형 명확화
- 크레딧 소모 기준 명확화
- 지원하지 않는 기능 안내

---

## 참고 서비스
- [Emergent](https://app.emergent.sh/) - AI 기반 앱 빌더
- [v0.dev](https://v0.dev/) - Vercel AI UI 생성
- [Bolt.new](https://bolt.new/) - AI 웹 앱 빌더

---

*이 문서는 프로젝트 진행에 따라 지속적으로 업데이트됩니다.*
