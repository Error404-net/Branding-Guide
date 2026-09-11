# Error404.NET — OBS Setup

This directory is the source of truth for all OBS Studio configuration.
Changes here are version-controlled and auto-pushed to the Branding Guide repo.

---

## Directory map

```
obs/
├── scenes/
│   └── Error404.json          ← Scene collection (import into OBS)
├── overlays/
│   ├── chat.html              ← Chat box browser source
│   ├── alerts.html            ← Follow/sub/raid/cheer alert overlay
│   └── README.md              ← Overlay-specific setup notes
├── transitions/
│   └── stinger.webm           ← Branded scene-switch stinger (VP8+alpha)
├── assets/
│   └── logos/                 ← All logo PNGs used by the scene collection
├── renders/                   ← 1920×1080 preview renders of each scene
└── profiles/
    └── Error404/              ← OBS output/stream profile
```

---

## 1. Load the scene collection

1. Open OBS Studio
2. **Scene Collection → Import**
3. Browse to `obs/scenes/Error404.json`
4. Switch to it via **Scene Collection → Error404**

**10 scenes are included:**

| # | Scene | Purpose |
|---|---|---|
| 1 | Starting Soon | Pre-stream waiting screen |
| 2 | Live — Screen | Screen share with watermark |
| 3 | Live — Cam | Webcam on brand background |
| 4 | Just Chatting | Cam + netmesh accent, chat focus |
| 5 | BRB | Away screen |
| 6 | Ending | Stream outro |
| 7 | Browser | Chrome window capture |
| 8 | Terminal | iTerm2 window capture |
| 9 | VS Code | VS Code window capture |
| 10 | Slideshow | PowerPoint / Keynote capture |

Preview renders for each scene are in `renders/`.

---

## 2. Stinger transition

The stinger plays between scene switches: colored bars (blue → pink → yellow → mint) sweep across, flash to the Error404 purple, then exit — the actual cut happens under the flash.

**Setup in OBS:**
1. Click the **+** next to the scene transition dropdown (bottom center of OBS)
2. Choose **Stinger**
3. Name: `Error404 Glitch`
4. Video file: browse to `transitions/stinger.webm`
5. Transition point: **50%** (the purple full-frame flash is the cut point)
6. Set as your default transition

---

## 3. Chat overlay

`overlays/chat.html` — a branded chat widget styled to match the Error404 palette. Username colors cycle through blue → pink → yellow → mint. Shows mod / sub / vip badges.

**Add to OBS:**
1. In any scene, click **+** under Sources → **Browser**
2. Check **Local file** → browse to `overlays/chat.html`
3. Width: `380` / Height: `600`
4. Drag to the bottom-left or bottom-right corner of your canvas

**Connect to live Twitch chat via StreamElements:**
1. Sign in at [streamelements.com](https://streamelements.com) and connect your Twitch account
2. Go to **My Overlays** → open any overlay → copy the overlay URL
   (looks like `https://streamelements.com/overlay/xxxxxxxx/yyyyyy`)
3. In OBS, edit the browser source — uncheck "Local file" and paste the SE overlay URL
4. StreamElements fires `onEventReceived` events; the widget picks them up automatically

The file includes a rotating demo loop so you can preview the layout before going live. The demo stops automatically once real events start arriving.

---

## 4. Alert overlay

`overlays/alerts.html` — animated alerts for follows, subscriptions, resubscribes, gift subs, cheers, and raids. Each event type uses the matching brand accent with a glitch flicker + particle burst.

| Event | Color |
|---|---|
| Follow | Blue `#4DE1FF` |
| Sub / Resub | Mint `#37F0A6` |
| Gift sub | Pink `#FF5FA2` |
| Cheer | Yellow `#FFE156` |
| Raid | Pink `#FF5FA2` |

**Add to OBS:**
1. Add a **Browser** source — place it at the **top** of the source stack so it overlays everything
2. Local file → `overlays/alerts.html`
3. Width: `560` / Height: `200`
4. Position: top-center or top-left of the canvas

**Connect to StreamElements:** same overlay URL method as the chat widget above. Both widgets can share the same SE overlay URL.

Each alert displays for 5 seconds. Edit `HIDE_AFTER_MS` in the file to change timing.

---

## 5. Window capture scenes (Browser, Terminal, VS Code, Slideshow)

These scenes use `window_capture` sources. OBS tries to auto-connect based on the app name but you may need to select the window manually.

**First-time setup:**
1. In the scene, right-click the capture source → **Properties**
2. Set **Application** to the correct app (Google Chrome, iTerm2, Code, Microsoft PowerPoint)
3. Optionally set a specific **Window** if you want to lock to one window title

---

## 6. Audio sources

The collection includes two audio sources pre-configured:

| Source | Device | Notes |
|---|---|---|
| USB Microphone | System default input | Change in Properties if using a named device |
| Desktop Audio | System default output | Volume set to 60% to avoid bleed |

Filters on the mic: RNNoise noise suppression → noise gate → compressor.

---

## Assets

Logo files in `assets/logos/` are synced from the root `logos/` directory.
To update them after a logo change: `rsync -av logos/png/ obs/assets/logos/`.

The authoritative SVG masters live in the root `logos/` folder — see `logos/README.txt` for the full variant list.
