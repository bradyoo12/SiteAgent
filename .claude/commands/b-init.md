Initialize the development environment by opening the frontend dev server and Visual Studio.

## Instructions

1. Switch GitHub account to bradyoo12:

```bash
gh auth switch --user bradyoo12
```

2. Open a new command prompt window and start the frontend development server:

```bash
powershell -Command "Start-Process cmd -ArgumentList '/k', 'cd /d $cwd\frontend && npm run dev'"
```

3. Open Visual Studio with the SiteAgent solution:

```bash
powershell -Command "Start-Process '$cwd\backend\SiteAgent.sln'"
```

This will:
1. Switch GitHub CLI to use the bradyoo12 account
2. Use PowerShell to open a new command prompt window
3. Navigate to the frontend folder
4. Run `npm run dev` to start the Vite development server
5. Keep the window open (`/k` flag) so you can see the server output
6. Open Visual Studio 2022 with the SiteAgent.sln solution
