namespace SiteAgent.Core.Interfaces;

public interface IChatService
{
    Task<string> ProcessMessageAsync(string message, Guid? projectId);
}
