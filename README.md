# GoalsApp

Native iOS goals/habit app — SwiftUI, gamified, Claude-powered daily tasks and nudges.

## Project structure

```
GoalsApp/
  project.yml           XcodeGen spec — generates the .xcodeproj (not committed to git)
  Sources/GoalsApp/      SwiftUI source
  backend/                Node.js API + scheduler (not built yet)
```

The `.xcodeproj` is intentionally not committed — it's generated from `project.yml` by [XcodeGen](https://github.com/yonaskolb/XcodeGen). This keeps the project file as plain, diffable text instead of Xcode's binary/plist format, and avoids merge conflicts.

## First-time setup on your Mac

1. Install Xcode from the App Store if you don't have it.
2. Install [Homebrew](https://brew.sh) if you don't have it.
3. Install XcodeGen:
   ```
   brew install xcodegen
   ```
4. Clone this repo and generate the Xcode project:
   ```
   git clone <repo-url>
   cd GoalsApp
   xcodegen generate
   open GoalsApp.xcodeproj
   ```
5. In Xcode, select an iPhone simulator and hit Run (⌘R).

## After pulling new changes

Whenever `project.yml` changes (new files, new settings), re-run `xcodegen generate` before opening/building. If only `.swift` files changed, Xcode picks those up automatically — just make sure the project is already open or reopen it.

## Current state

Home screen only, with placeholder tabs for Tasks / Insights / Profile. Sample data is hardcoded in `HomeView.swift` — no backend wired up yet.
