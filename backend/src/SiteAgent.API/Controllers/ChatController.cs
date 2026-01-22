using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SiteAgent.Core.Entities;
using SiteAgent.Core.Interfaces;
using SiteAgent.Infrastructure.Data;

namespace SiteAgent.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IGeminiService _geminiService;

    public ChatController(AppDbContext context, IGeminiService geminiService)
    {
        _context = context;
        _geminiService = geminiService;
    }

    [HttpPost("message")]
    public async Task<IActionResult> SendMessage([FromBody] SendMessageRequest request)
    {
        var projectId = request.ProjectId ?? Guid.NewGuid();

        var userMessage = new ChatMessage
        {
            Id = Guid.NewGuid(),
            ProjectId = projectId,
            Role = "user",
            Content = request.Content,
            CreatedAt = DateTime.UtcNow
        };
        _context.ChatMessages.Add(userMessage);
        await _context.SaveChangesAsync();

        var conversationHistory = await _context.ChatMessages
            .Where(m => m.ProjectId == projectId)
            .OrderBy(m => m.CreatedAt)
            .ToListAsync();

        var aiResponseContent = await _geminiService.GenerateResponseAsync(request.Content, conversationHistory);

        var aiMessage = new ChatMessage
        {
            Id = Guid.NewGuid(),
            ProjectId = projectId,
            Role = "assistant",
            Content = aiResponseContent,
            CreatedAt = DateTime.UtcNow
        };
        _context.ChatMessages.Add(aiMessage);
        await _context.SaveChangesAsync();

        var response = new SendMessageResponse
        {
            Content = aiResponseContent,
            ProjectId = projectId
        };

        return Ok(response);
    }

    [HttpGet("history/{projectId}")]
    public async Task<IActionResult> GetHistory(Guid projectId)
    {
        var messages = await _context.ChatMessages
            .Where(m => m.ProjectId == projectId)
            .OrderBy(m => m.CreatedAt)
            .Select(m => new ChatMessageDto
            {
                Id = m.Id,
                Role = m.Role,
                Content = m.Content,
                CreatedAt = m.CreatedAt
            })
            .ToListAsync();

        return Ok(messages);
    }
}

public class SendMessageRequest
{
    public string Content { get; set; } = string.Empty;
    public Guid? ProjectId { get; set; }
}

public class SendMessageResponse
{
    public string Content { get; set; } = string.Empty;
    public Guid ProjectId { get; set; }
}

public class ChatMessageDto
{
    public Guid Id { get; set; }
    public string Role { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
