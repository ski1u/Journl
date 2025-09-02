# a journal app lol
- brand color: #58a76d

## tasks
- floating plus button
- creating new entry modal (text input error rn)

---

## novel ideas:
- create folders (create a folder tab -> icons, name, color)
- homepage should be a statistical summary dashboard, suggestions, & widgets

## overall app:
### Journal Entries & Folders
- Add a new entry: text + photo.
- Store entry in Supabase DB + photo in Supabase storage.

- Optimistic UI (entry shows instantly while syncing).
- Live CRUD (updates across devices in real time).

### Journal Feed
- List of all entries (reverse chronological).
- Infinite scroll or pagination.
- Responsive design (cards that adapt to screen size).

### Entry Detail Screen
- Full entry view (text + photo).
- Edit & delete options.

### Navigation
- Stack Navigator: Auth flow → App flow.
- Tabs: Home (entries), Add Entry, Profile, Summary.
- Drawer (optional): Settings, Privacy, About.

### Profile & Settings
- Basic user profile (name, avatar).
- Settings: logout, theme toggle, reminders (later).

### Animations (Moti)
- Onboarding illustrations fade/scale in.
- Floating “+” button animates.
- Entry cards with subtle entry animations.