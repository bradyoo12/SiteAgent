# Azure Web App Setup Script for SiteAgent
# Run this script after logging in to Azure CLI: az login

$resourceGroup = "20260122_SiteAgent"
$location = "koreacentral"
$backendAppName = "siteagent-api"
$frontendAppName = "siteagent-web"
$appServicePlan = "siteagent-plan"

# Create App Service Plan (Linux, B1 tier)
Write-Host "Creating App Service Plan..." -ForegroundColor Cyan
az appservice plan create `
    --name $appServicePlan `
    --resource-group $resourceGroup `
    --location $location `
    --sku B1 `
    --is-linux

# Create Backend Web App (.NET 8)
Write-Host "Creating Backend Web App..." -ForegroundColor Cyan
az webapp create `
    --name $backendAppName `
    --resource-group $resourceGroup `
    --plan $appServicePlan `
    --runtime "DOTNETCORE:8.0"

# Create Frontend Web App (Node 20 for serving static files)
Write-Host "Creating Frontend Web App..." -ForegroundColor Cyan
az webapp create `
    --name $frontendAppName `
    --resource-group $resourceGroup `
    --plan $appServicePlan `
    --runtime "NODE:20-lts"

# Configure Frontend to serve static files
Write-Host "Configuring Frontend startup command..." -ForegroundColor Cyan
az webapp config set `
    --name $frontendAppName `
    --resource-group $resourceGroup `
    --startup-file "npx serve -s /home/site/wwwroot -l 8080"

# Get Publish Profiles
Write-Host "`n=== Publish Profiles ===" -ForegroundColor Green
Write-Host "Copy these and add as GitHub Secrets:`n" -ForegroundColor Yellow

Write-Host "1. AZURE_WEBAPP_PUBLISH_PROFILE_BACKEND:" -ForegroundColor Cyan
az webapp deployment list-publishing-profiles `
    --name $backendAppName `
    --resource-group $resourceGroup `
    --xml

Write-Host "`n2. AZURE_WEBAPP_PUBLISH_PROFILE_FRONTEND:" -ForegroundColor Cyan
az webapp deployment list-publishing-profiles `
    --name $frontendAppName `
    --resource-group $resourceGroup `
    --xml

Write-Host "`n=== Setup Complete ===" -ForegroundColor Green
Write-Host "Backend URL: https://$backendAppName.azurewebsites.net" -ForegroundColor Yellow
Write-Host "Frontend URL: https://$frontendAppName.azurewebsites.net" -ForegroundColor Yellow
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Copy the publish profiles above" -ForegroundColor White
Write-Host "2. Go to GitHub repo -> Settings -> Secrets and variables -> Actions" -ForegroundColor White
Write-Host "3. Add AZURE_WEBAPP_PUBLISH_PROFILE_BACKEND secret" -ForegroundColor White
Write-Host "4. Add AZURE_WEBAPP_PUBLISH_PROFILE_FRONTEND secret" -ForegroundColor White
