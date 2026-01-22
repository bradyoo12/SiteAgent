using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SiteAgent.Core.Entities;
using SiteAgent.Infrastructure.Data;

namespace SiteAgent.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly AppDbContext _context;

    public ChatController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("message")]
    public async Task<IActionResult> SendMessage([FromBody] SendMessageRequest request)
    {
        // 임시 응답 (추후 Claude API 연동)
        var response = new SendMessageResponse
        {
            Content = $"\"{request.Content}\"에 대해 사이트를 생성할 준비가 되었습니다.\n\n현재 개발 중이므로 실제 생성 기능은 추후 연동됩니다.",
            ProjectId = request.ProjectId ?? Guid.NewGuid()
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
