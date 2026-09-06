ERROR404.NET — Discord asset set
====================================================================
Matches the "Discord" page added to Error404-Brand-Guidelines.pdf and
BRANDING.md §9g.

discord-server-icon-512.png
    Server icon. Crops circular in Discord's UI — primary multicolor-ring
    mark, navy background.

discord-server-banner-960x540.png
    Boost-tier server banner (Server Boost Level 2+, Settings > Overview >
    Server Banner). De-cluttered arcade background with mark + wordmark
    centered.

discord-invite-splash-1920x1080.png
    Background image for the server invite page (Settings > Overview >
    Invite Background, requires Level 2 boost). Keep the bottom third
    visually uncluttered — Discord overlays the join card there.

error404-arcade-new-wave.theme.css
    A client-side theme for BetterDiscord or Vencord (custom CSS).
    NOT an official Discord feature — Discord itself has no built-in
    theming, this only works with one of those client mods installed.

    Install:
      BetterDiscord: Settings > Themes > Open Themes Folder, drop this
      file in, then enable "Error404 Arcade New Wave" in the Themes tab.

      Vencord: Settings > Themes > Local Themes > Upload theme, or paste
      the file's contents into Settings > Themes > Online Themes / QuickCSS.

    What it does: remaps Discord's CSS custom properties to the Arcade
    New Wave palette — navy backgrounds (#170c38 / #231451), #4DE1FF
    in place of blurple for accents and primary buttons, mint (#37F0A6)
    links, pink (#FF5FA2) unread/mention badges, and JetBrains Mono as
    the UI font (falls back to Consolas/monospace).

    Discord frequently renames the hashed CSS classnames it uses
    internally (e.g. the unread-pill and primary-button selectors near
    the bottom of the file) with client updates. The CSS custom-property
    overrides at the top of the file are the stable part and will keep
    working regardless; the classname rules are a best-effort pass and
    may need re-selecting with a theme inspector (Ctrl+Shift+I in
    BetterDiscord, or Vencord's built-in inspector) after an update.
