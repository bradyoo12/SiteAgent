using SiteAgent.Core.Entities;

namespace SiteAgent.Core.Interfaces;

public interface IGeminiService
{
    Task<string> GenerateResponseAsync(string userMessage, IEnumerable<ChatMessage> conversationHistory);
}
