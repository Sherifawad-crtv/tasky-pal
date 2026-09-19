# TaskLabels

A simple personal task manager with color-coded labels (University, Freelance Gig, Personal, or any custom ones you add). Built as a real native app with Expo/React Native — not a PWA. Everything is stored on-device (AsyncStorage), no backend needed.

## What's inside

- Add/edit/delete tasks, mark them done, optional due date and notes
- Create, rename, recolor, and delete your own labels; filter the task list by label
- All data persists locally on the device

## 1. Test it on your phone (fastest way — no build needed)

1. Install the **Expo Go** app from the App Store or Google Play on your phone.
2. On your computer, open this project folder and run:
   ```
   npm install
   npx expo start
   ```
3. Scan the QR code that appears with your phone's camera (iOS) or the Expo Go app (Android). The app opens live on your phone. Any code change you make shows up instantly.

This is the quickest way to try it out — great for iterating on the design before you build a real installable app.

## 2. Build a real installable app (to test outside Expo Go, or share with others)

This uses **EAS Build**, Expo's free cloud build service — you don't need a Mac to build for iOS.

1. Create a free account at https://expo.dev if you don't have one.
2. Install the EAS CLI and log in:
   ```
   npm install -g eas-cli
   eas login
   ```
3. Link this project to your account (one-time):
   ```
   eas init
   ```
4. Build an installable test version:
   - **Android (installable .apk, easiest to test)**:
     ```
     eas build --platform android --profile preview
     ```
     When it finishes, EAS gives you a download link — open it on your Android phone to install directly.
   - **iOS (installable on your own iPhone)**:
     ```
     eas build --platform ios --profile preview
     ```
     For iOS you'll need an Apple Developer account ($99/year) to install on a real device; EAS walks you through registering your device the first time.

## 3. Deploy to the app stores

When you're happy with it:

```
eas build --platform android --profile production
eas build --platform ios --profile production
eas submit --platform android
eas submit --platform ios
```

- Android: needs a Google Play Developer account ($25 one-time).
- iOS: needs an Apple Developer account ($99/year).

`eas submit` uploads the build directly to Play Console / App Store Connect, where you fill in the store listing (screenshots, description) and release it.

## 4. Auto-build on every push (the "GitHub → Vercel" flow, for native)

Vercel doesn't build native apps — the direct equivalent is **EAS**, Expo's own cloud CI. This repo already has the pipeline wired up in `.github/workflows/eas-build.yml`:

- **Every push to `main`** → publishes an instant OTA update (`eas update`). Anyone who already has the app installed (via preview build or TestFlight/Play) gets the new JS instantly, no store review, no reinstall — this is the closest thing to Vercel's "push and it's live."
- **A commit whose message contains `[build]`**, or a manual trigger from the GitHub Actions tab → also kicks off a real native build (`eas build`) for a fresh installable binary.

One-time setup (do this once, in GitHub, after pushing this repo):

1. Push this project to your GitHub repo.
2. Run `eas init` locally once to link the project to your Expo account (creates a project ID in `app.json`).
3. Get an Expo access token: expo.dev → Account settings → Access tokens → Create token.
4. In your GitHub repo → Settings → Secrets and variables → Actions → New repository secret → name it `EXPO_TOKEN`, paste the token.

After that, it's fully automatic: commit → push → OTA update goes out; add `[build]` to a commit message when you actually need a new installable binary (new native permission, new library, etc.) rather than just a UI/logic change.

## Notes for you (Sherif)

- App identifiers are set to `com.sherifbuilds.tasklabels` in `app.json` — change this if you want a different bundle ID before your first store submission (it can't be changed after).
- No code changes needed between steps 1–3; the same project builds for testing and for the store.
- If you want to redesign the look later, all colors/spacing live in one place: `src/theme.ts`.
- Ask your Claude Code session to run steps 4's one-time setup (`eas init`, pushing to GitHub, adding the `EXPO_TOKEN` secret) — after that, the pipeline runs itself on every push.
