namespace SiteAgent.Core.Entities;

public class ChatMessage
{
    public Guid Id { get; set; }
    public Guid ProjectId { get; set; }
    public string Role { get; set; } = string.Empty; // "user" or "assistant"
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Project Project { get; set; } = null!;
}
