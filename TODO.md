# TODO - Profile user data + Dashboard UI

## Step 1: Fix profile data per logged-in user
- Update `client/src/pages/Profile.jsx` to read analysis history using the authenticated user email.
- Ensure it falls back safely to legacy keys.

## Step 2: Fix stats not updating with user changes
- Remove incorrect dependencies/state usage that can cause stale `localStorage` reads.
- Use the correct history key and guard against async auth changes.

## Step 3: Enhance Dashboard UI aesthetics
- Improve page background, spacing, card styles, and typography while keeping existing layout.
- Optionally add subtle gradients and consistent glass-card usage.

## Step 4: Verify visually
- Login as two different users.
- Verify Profile stats change.
- Check Dashboard looks improved across empty + result states.

