# CastWise Codebase Guide

CastWise is a decision support tool for Washington State anglers. It helps users decide where to fish by taking them through an onboarding questionnaire, ranking hundreds of public access sites based on their preferences, and providing AI-generated trip briefings with tailored gear advice and live stocking updates.

## Project Structure

```
index.html                        ← Vite HTML entry
src/
  main.jsx                        ← React root, mounts <App />
  App.jsx                         ← Main shell: manages state and navigation
  App.css                         ← Global styles for the app frame and components
  components/
    MapView.jsx                   ← Interactive map with site markers and updates feed
    AnglerQuestionnaire.jsx       ← 7-step onboarding form
    AnglerProfile.jsx             ← User profile display and data reset
    SpeciesCatalog.jsx            ← Placeholder for browsing Washington fish species
    SiteRanking.jsx               ← Placeholder for rankings and includes SiteProfile detail view
    TripBriefing.jsx              ← AI-generated trip briefing and chat interface
    CatchLog.jsx                  ← Placeholder for user catch history
    NavBar.jsx                    ← Bottom navigation bar
    tabs/
      MapTab.jsx                  ← Advanced Leaflet map implementation
    FishSymbol.jsx                ← SVG icon component
  data/
    sites.js                      ← Centralized site data and enrichment logic
    ... (other data files)
  utils/
    storage.js                    ← Local storage helpers for profile and trip
    ai.js                         ← Claude API integration and prompt building
```

## Who owns what

| File | Purpose | Best person to modify |
|---|---|---|
| `App.jsx` | App orchestration and state | |
| `MapView.jsx` | Map and updates UI | |
| `AnglerQuestionnaire.jsx` | User onboarding flow | |
| `TripBriefing.jsx` | AI briefing and chat | |
| `SiteRanking.jsx` | Site details and rankings | |
| `sites.js` | Site data and metadata | |

## Component Details

### App.jsx
**What it does:** The main container that holds the app's state (profile, trip, screen) and orchestrates navigation between components.
**State / props it uses:** `screen`, `profile`, `trip`, `activeSection`, `selectedSite`.
**What's connected to it:** Imports all components and utilities.
**To modify this with AI:** Copy these files into chat → `App.jsx`, `NavBar.jsx`, `storage.js`
**Example tasks:** Change the initial loading logic, add a new global screen state.

### MapView.jsx
**What it does:** Displays the interactive Washington map and a feed of recent stocking updates.
**State / props it uses:** `profile`, `trip`, `onSelect`, `onViewTrip`, `onReset`.
**What's connected to it:** Imported by `App.jsx`. Imports `MapTab.jsx` and `sites.js`.
**To modify this with AI:** Copy these files into chat → `App.jsx` + `MapView.jsx` + `MapTab.jsx`
**Example tasks:** Change how markers look, modify the search filter logic.

### AnglerQuestionnaire.jsx
**What it does:** The 7-step onboarding form users fill out when they first open the app.
**State / props it uses:** `onComplete` prop. Internal `step` and `answers` state.
**What's connected to it:** Imported by `App.jsx`.
**To modify this with AI:** Copy these files into chat → `App.jsx` + `AnglerQuestionnaire.jsx`
**Example tasks:** Add a new question to the intake, change the available options.

### TripBriefing.jsx
**What it does:** Displays the AI-generated briefing and provides a chat interface for the user to ask questions.
**State / props it uses:** `profile`, `trip`, `onBack`, `onRemove`.
**What's connected to it:** Imported by `App.jsx`. Imports `ai.js`.
**To modify this with AI:** Copy these files into chat → `App.jsx` + `TripBriefing.jsx` + `ai.js`
**Example tasks:** Modify the briefing layout, change the system prompt for the AI.

### SiteRanking.jsx
**What it does:** Displays the top-3 site recommendations and the detailed `SiteProfile` for a selected site.
**State / props it uses:** `SiteProfile` uses `site`, `inTrip`, `onBack`, `onAdd`.
**What's connected to it:** Imported by `App.jsx`.
**To modify this with AI:** Copy these files into chat → `App.jsx` + `SiteRanking.jsx`
**Example tasks:** Change the layout of the site details, implement the ranking logic.

### AnglerProfile.jsx
**What it does:** Shows the user's saved preferences and allows them to reset their data.
**State / props it uses:** `profile`, `onReset`.
**What's connected to it:** Imported by `App.jsx`.
**To modify this with AI:** Copy these files into chat → `App.jsx` + `AnglerProfile.jsx`
**Example tasks:** Add more fields to the profile display, change the reset confirmation.

### NavBar.jsx
**What it does:** The navigation menu that allows switching between the main sections of the app.
**State / props it uses:** `activeSection`, `onSectionChange`.
**What's connected to it:** Imported by `App.jsx`.
**To modify this with AI:** Copy these files into chat → `App.jsx` + `NavBar.jsx`
**Example tasks:** Add a new icon/tab to the navigation, change the nav bar's appearance.

## Common AI Tasks

| I want to change... | Copy these files into AI chat |
|---|---|
| The onboarding questions | `App.jsx` + `AnglerQuestionnaire.jsx` |
| How sites are scored/ranked | `App.jsx` + `SiteRanking.jsx` |
| The trip briefing output | `App.jsx` + `TripBriefing.jsx` + `ai.js` |
| The map or fishing site pins | `App.jsx` + `MapView.jsx` + `MapTab.jsx` |
| The species list or filters | `SpeciesCatalog.jsx` + `sites.js` |
| Navigation or layout | `App.jsx` + `NavBar.jsx` + `App.css` |
| The catch log | `CatchLog.jsx` |
| The angler profile display | `AnglerProfile.jsx` |
