# Gemini AI 챗봇 통합

## Original Request
> Gemini AI를 이용해서 챗봇을 만들거야

## Problem Statement

현재 SiteAgent 프로젝트에는 채팅 UI와 인프라가 이미 구축되어 있지만, AI 응답 부분이 placeholder로 구현되어 있습니다. 실제 Gemini AI를 통합하여 사용자에게 지능적인 대화 경험을 제공해야 합니다.

**현재 상태:**
- ✅ 채팅 UI 구현 완료 (ChatMessage, ChatInput, Chat 페이지)
- ✅ 메시지 저장 DB 구조 완료 (ChatMessage 엔티티)
- ✅ API 엔드포인트 존재 (`POST /api/chat/message`)
- ✅ 상태 관리 설정 완료 (Zustand chatStore)
- ❌ AI 통합 미구현 (현재 placeholder 응답 반환)

## Success Criteria

- [ ] Gemini API를 통해 사용자 메시지에 대한 AI 응답 생성
- [ ] 대화 컨텍스트 유지 (이전 메시지들을 고려한 응답)
- [ ] API 키가 안전하게 백엔드에서 관리됨
- [ ] 에러 발생 시 사용자 친화적 에러 메시지 표시
- [ ] 응답 생성 중 로딩 상태 표시 (기존 UI 활용)

## Implementation Guidance

### 권장 접근 방식: 백엔드 통합

API 키 보안과 기존 C# 백엔드 인프라 활용을 위해 백엔드 통합 방식을 권장합니다.

### 구현할 파일들

| 경로 | 작업 | 목적 |
|------|------|------|
| `backend/src/SiteAgent.Core/Interfaces/IGeminiService.cs` | 생성 | 서비스 인터페이스 정의 |
| `backend/src/SiteAgent.Infrastructure/Services/GeminiService.cs` | 생성 | Gemini API 호출 구현 |
| `backend/src/SiteAgent.API/Controllers/ChatController.cs` | 수정 | GeminiService 연동 |
| `backend/src/SiteAgent.API/appsettings.json` | 수정 | Gemini 설정 추가 |
| `backend/src/SiteAgent.API/Program.cs` | 수정 | DI 컨테이너에 서비스 등록 |

### 핵심 구현 사항

**1. GeminiService 구현**
```csharp
public interface IGeminiService
{
    Task<string> GenerateResponseAsync(string userMessage, IEnumerable<ChatMessage> conversationHistory);
}
```

**2. ChatController 업데이트**
- `IGeminiService` 주입
- 대화 히스토리 조회 후 Gemini에 컨텍스트 전달
- 사용자 메시지와 AI 응답 모두 DB에 저장

**3. 설정**
```json
"Gemini": {
  "ApiKey": "${GEMINI_API_KEY}",
  "Model": "gemini-2.0-flash"
}
```

### 참고할 기존 패턴

- API 서비스 패턴: `backend/src/SiteAgent.Infrastructure/` 참고
- 채팅 API: `backend/src/SiteAgent.API/Controllers/ChatController.cs`
- 프론트엔드 상태 관리: `frontend/src/store/chatStore.ts`

## Design & Mockups

기존 Chat UI를 그대로 사용합니다:
- `frontend/src/pages/Chat.tsx` - 채팅 페이지
- `frontend/src/components/chat/ChatMessage.tsx` - 메시지 표시
- `frontend/src/components/chat/ChatInput.tsx` - 입력 컴포넌트

**UI 변경 없음** - 백엔드 AI 연동만 필요

## Out of Scope

- 채팅 UI 디자인 변경
- 스트리밍 응답 구현 (향후 개선 가능)
- 다중 AI 모델 지원
- 이미지/파일 업로드 기능
- 음성 입력/출력

## Dependencies

- Gemini API 키 발급 필요 (Google AI Studio)
- NuGet 패키지: `Google.Cloud.ArtificialIntelligence.V1` 또는 REST API 직접 호출

## Technical Notes

- Gemini 2.0 Flash 모델 사용 권장 (빠른 응답, 비용 효율적)
- 환경변수 또는 Azure Key Vault로 API 키 관리
- 대화 컨텍스트는 ProjectId 기준으로 관리됨
