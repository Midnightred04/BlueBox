# Restore BlueBox Firestore access securely

The old Firestore rule expired on **August 2, 2025**, and the old website did not authenticate users through Firebase. BlueBox now uses Firebase **Email/Password Authentication** and includes a restricted `firestore.rules` file. **Both steps below are required.**

## 1. Create a BlueBox Firebase Auth account

1. Open the **existing** Firebase project `black-box-44047` in [Firebase Console](https://console.firebase.google.com/project/black-box-44047/overview).
2. Go to **Authentication → Sign-in method**, enable **Email/Password** (not anonymous sign-in), save.
3. Go to **Authentication → Users → Add user**. Enter an email you own and a **new, strong password** that was never embedded in BlueBox's GitHub code.
4. Copy the new user's **UID** (not their email or password).
5. If you already have a suitable Email/Password user in this project, use that user and their UID instead.

## 2. Publish private Firestore rules

1. Open [Firestore Database → Rules](https://console.firebase.google.com/project/black-box-44047/firestore/rules).
2. Open the repository [firestore.rules](https://github.com/Midnightred04/BlueBox/blob/main/firestore.rules) and copy its complete contents into Firebase's Rules editor.
3. Replace the single placeholder `REPLACE_WITH_BLUEBOX_FIREBASE_AUTH_UID` with the exact UID of your Firebase Auth user, keeping the single quotes.
4. Click **Publish**. **Do not** use `allow read, write: if true;`, and **do not** paste the Firebase account password or any service account secrets into GitHub.
5. Sign into [BlueBox](https://midnightred04.github.io/BlueBox/) with the Firebase user's email and password. Previously saved `gossip` and `plans` entries should appear.

The UID-restricted rules permit only that signed-in user to read, add, or delete entries in `gossip` and `plans`. Data already stored in Firestore is not modified by publishing rules. Existing entries with missing timestamps are also displayed.

**Note:** A Firebase app's web API key is public configuration, not an authorization secret. Security comes from Firebase Authentication + Firestore rules. Sharing the same account among friends also means everyone shares privileges. For per-person identity, add separate Firebase users and an allowlist of their UIDs in rules.

## If entries still do not appear

- If BlueBox says **Firebase permission denied**, check the UID in rules, and confirm the account is signed into the same Firebase project (`black-box-44047`).
- If BlueBox says **No entries found**, verify **Firestore Database → Data → gossip/plans** in `black-box-44047`. The original data might reside in a different Firebase project.
- If sign-in fails, verify **Email/Password** is enabled in Authentication.
- Reload the BlueBox page after GitHub Pages publishes the latest commit.

## Important security reminder

The original BlueBox GitHub history contained a simple plaintext password. Removing it from the current page does not erase it from past public commits. **Do not reuse that old password** for any accounts.
