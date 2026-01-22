using SiteAgent.Core.Entities;

namespace SiteAgent.Core.Interfaces;

public interface IAuthService
{
    Task<GoogleUserInfo?> ValidateGoogleTokenAsync(string idToken);
    string GenerateJwtToken(User user);
}

public class GoogleUserInfo
{
    public string GoogleId { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? ProfileImageUrl { get; set; }
}
