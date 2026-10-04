# ERROR404.NET · Gravatar

[Preview and download](https://branding.error404.net/#gravatar) · [Gravatar editor](https://gravatar.com/profile/avatars)

| Asset | Use |
| --- | --- |
| `avatar-color-1024.png` | Default: canonical multicolor Libra symbol on brand purple |
| `avatar-night-1024.png` | Light monochrome symbol on brand purple |
| `avatar-daylight-1024.png` | Dark monochrome symbol on white |
| `profile-background-1920x1080.png` | Optional profile background; preview cropping in Gravatar |

The square PNGs have opaque backgrounds and generous padding for circle crops.
The icon-only geometry matches the email signature and existing monograms; no tiny
wordmark or tagline is included. SVG companions are editable source assets; upload
the PNGs to Gravatar. Background dimensions are our export size, not a required
Gravatar size. Keep the existing crop padding when uploading.

## Apply to Gravatar

1. Download an avatar from the guide or this folder.
2. Sign in to Gravatar and open the avatar editor.
3. Upload the PNG, review the crop, and assign it to your verified email address.
4. Choose a G rating for these general-audience brand marks.
5. If desired, apply the background in your profile design settings and review the crop.

The guide provides files and previews; it does not sign in to or update your account.
Gravatar-enabled services may take up to 24 hours to refresh. A GitHub repository
update does not change your GitHub account photo.

Reference: [Gravatar support](https://support.gravatar.com/basic/).

## Rebuild

With Node.js and Puppeteer installed, run `node gravatar/build-assets.cjs` from
this repository. The script reads the canonical email signature mark and night/daylight
monograms and regenerates all SVG/PNG companions using Chromium. Keep the generated
files committed so GitHub Pages needs no build step.
