using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SiteAgent.Core.Entities;
using SiteAgent.Core.Interfaces;

namespace SiteAgent.Infrastructure.Services;

public class GeminiService : IGeminiService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<GeminiService> _logger;
    private readonly string _apiKey;
    private readonly string _model;

    public GeminiService(HttpClient httpClient, IConfiguration configuration, ILogger<GeminiService> logger)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _logger = logger;
        _apiKey = _configuration["Gemini:ApiKey"] ?? throw new InvalidOperationException("Gemini API key not configured");
        _model = _configuration["Gemini:Model"] ?? "gemini-2.0-flash";
    }

    public async Task<string> GenerateResponseAsync(string userMessage, IEnumerable<ChatMessage> conversationHistory)
    {
        try
        {
            var url = $"https://generativelanguage.googleapis.com/v1beta/models/{_model}:generateContent?key={_apiKey}";

            var contents = BuildContents(userMessage, conversationHistory);
            var requestBody = new { contents };

            var response = await _httpClient.PostAsJsonAsync(url, requestBody);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogError("Gemini API error: {StatusCode} - {Error}", response.StatusCode, errorContent);
                return "죄송합니다. AI 응답을 생성하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
            }

            var result = await response.Content.ReadFromJsonAsync<GeminiResponse>();
            var text = result?.Candidates?.FirstOrDefault()?.Content?.Parts?.FirstOrDefault()?.Text;

            return text ?? "응답을 생성할 수 없습니다.";
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calling Gemini API");
            return "죄송합니다. AI 서비스에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.";
        }
    }

    private List<GeminiContent> BuildContents(string userMessage, IEnumerable<ChatMessage> conversationHistory)
    {
        var contents = new List<GeminiContent>();

        foreach (var message in conversationHistory.TakeLast(10))
        {
            contents.Add(new GeminiContent
            {
                Role = message.Role == "user" ? "user" : "model",
                Parts = new List<GeminiPart> { new() { Text = message.Content } }
            });
        }

        contents.Add(new GeminiContent
        {
            Role = "user",
            Parts = new List<GeminiPart> { new() { Text = userMessage } }
        });

        return contents;
    }
}

public class GeminiContent
{
    public string Role { get; set; } = string.Empty;
    public List<GeminiPart> Parts { get; set; } = new();
}

public class GeminiPart
{
    public string Text { get; set; } = string.Empty;
}

public class GeminiResponse
{
    public List<GeminiCandidate>? Candidates { get; set; }
}

public class GeminiCandidate
{
    public GeminiContent? Content { get; set; }
}
