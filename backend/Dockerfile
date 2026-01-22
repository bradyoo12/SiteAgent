FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["SiteAgent.sln", "./"]
COPY ["src/SiteAgent.API/SiteAgent.API.csproj", "src/SiteAgent.API/"]
COPY ["src/SiteAgent.Core/SiteAgent.Core.csproj", "src/SiteAgent.Core/"]
COPY ["src/SiteAgent.Infrastructure/SiteAgent.Infrastructure.csproj", "src/SiteAgent.Infrastructure/"]

RUN dotnet restore

COPY . .
RUN dotnet build -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "src/SiteAgent.API/SiteAgent.API.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

EXPOSE 5000
ENV ASPNETCORE_URLS=http://+:5000

ENTRYPOINT ["dotnet", "SiteAgent.API.dll"]
