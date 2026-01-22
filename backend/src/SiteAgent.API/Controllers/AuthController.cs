using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SiteAgent.Core.Entities;
using SiteAgent.Core.Interfaces;
using SiteAgent.Infrastructure.Data;

namespace SiteAgent.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IAuthService _authService;

    public AuthController(AppDbContext context, IAuthService authService)
    {
        _context = context;
        _authService = authService;
    }

    [HttpPost("google")]
    public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
    {
        var googleUser = await _authService.ValidateGoogleTokenAsync(request.IdToken);
        if (googleUser == null)
        {
            return Unauthorized(new { message = "Invalid Google token" });
        }

        var user = await _context.Users.FirstOrDefaultAsync(u => u.GoogleId == googleUser.GoogleId);

        if (user == null)
        {
            user = new User
            {
                Id = Guid.NewGuid(),
                Email = googleUser.Email,
                Name = googleUser.Name,
                GoogleId = googleUser.GoogleId,
                Provider = "google",
                ProfileImageUrl = googleUser.ProfileImageUrl,
                Credits = 10,
                CreatedAt = DateTime.UtcNow
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }
        else
        {
            user.Name = googleUser.Name;
            user.ProfileImageUrl = googleUser.ProfileImageUrl;
            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }

        var token = _authService.GenerateJwtToken(user);

        return Ok(new LoginResponse
        {
            Token = token,
            User = new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                Name = user.Name,
                ProfileImageUrl = user.ProfileImageUrl,
                Credits = user.Credits
            }
        });
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            return NotFound();
        }

        return Ok(new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            Name = user.Name,
            ProfileImageUrl = user.ProfileImageUrl,
            Credits = user.Credits
        });
    }

    [Authorize]
    [HttpPost("logout")]
    public IActionResult Logout()
    {
        return Ok(new { message = "Logged out successfully" });
    }
}

public class GoogleLoginRequest
{
    public string IdToken { get; set; } = string.Empty;
}

public class LoginResponse
{
    public string Token { get; set; } = string.Empty;
    public UserDto User { get; set; } = null!;
}

public class UserDto
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? ProfileImageUrl { get; set; }
    public int Credits { get; set; }
}
