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
        Guid projectId;

        if (request.ProjectId.HasValue)
        {
            projectId = request.ProjectId.Value;
            var projectExists = await _context.Projects.AnyAsync(p => p.Id == projectId);
            if (!projectExists)
            {
                return BadRequest("Project not found");
            }
        }
        else
        {
            // Create a guest user if not exists
            var guestUserId = Guid.Parse("00000000-0000-0000-0000-000000000001");
            var guestUser = await _context.Users.FindAsync(guestUserId);
            if (guestUser == null)
            {
                guestUser = new User
                {
                    Id = guestUserId,
                    Email = "guest@siteagent.local",
                    Name = "Guest",
                    PasswordHash = "not-used",
                    Credits = 0,
                    CreatedAt = DateTime.UtcNow
                };
                _context.Users.Add(guestUser);
                await _context.SaveChangesAsync();
            }

            // Create a new project for this chat session
            projectId = Guid.NewGuid();
            var newProject = new Project
            {
                Id = projectId,
                UserId = guestUserId,
                Name = "Chat Session",
                Description = "Auto-created chat session",
                Status = ProjectStatus.Draft,
                CreatedAt = DateTime.UtcNow
            };
            _context.Projects.Add(newProject);
            await _context.SaveChangesAsync();
        }

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
