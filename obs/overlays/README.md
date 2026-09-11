# Error404 OBS Overlays

## Files

| File | Type | OBS Source | Size |
|---|---|---|---|
| `chat.html` | Chat box | Browser source | 380×600 |
| `alerts.html` | Follow/Sub/Cheer/Raid alerts | Browser source | 560×200 |
| `../transitions/stinger.webm` | Scene transition | Stinger transition | 1920×1080 |

---

## chat.html

**Add to OBS:**
1. Add a **Browser** source to any scene
2. Check "Local file" → browse to `chat.html`
3. Width: `380`, Height: `600`
4. Position: bottom-right or left edge

**Connect StreamElements:**
1. Go to streamelements.com → My Overlays → pick any overlay
2. In the overlay editor, add a **Chat Box** widget
3. Copy the overlay URL — it looks like `https://streamelements.com/overlay/XXXXXXXX/YYYYYY`
4. In OBS, change the browser source from local file to that URL
5. Remove the `demoTick()` call at the bottom of `chat.html` if keeping as local file + SE bridge

**Colors automatically cycle** through the four brand accents (blue → pink → yellow → mint) per username.

---

## alerts.html

**Add to OBS:**
1. Add a **Browser** source to the top of your source stack
2. Check "Local file" → browse to `alerts.html`
3. Width: `560`, Height: `200`
4. Position: top-center or top-left

**Connect StreamElements:**
Same overlay URL approach as chat — StreamElements fires `onEventReceived` events that the page listens for. The alerts widget captures: follows, subs, resubscribes, gift subs, cheers, raids.

**Alert durations:** Each alert shows for 5 seconds then fades. Edit `HIDE_AFTER_MS` in the script to change.

---

## stinger.webm (Scene Transition)

**Add to OBS:**
1. In OBS, click the **+** next to the scene transitions dropdown (bottom center)
2. Choose **Stinger**
3. Name it "Error404 Glitch"
4. Video file → browse to `transitions/stinger.webm`
5. Transition point: **50%** (the purple full-frame flash = the cut point)
6. Set as default transition

**Effect:** Colored bars (blue/pink/yellow/mint) sweep in from the right, flash to the Error404 purple, then bars sweep off left — seamless cut underneath the flash.
