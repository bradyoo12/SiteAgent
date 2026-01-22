namespace SiteAgent.Core.Entities;

public class User
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string? GoogleId { get; set; }
    public string? Provider { get; set; }
    public string? ProfileImageUrl { get; set; }
    public int Credits { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    public ICollection<Project> Projects { get; set; } = new List<Project>();
}
