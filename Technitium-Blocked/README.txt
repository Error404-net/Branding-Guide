ERROR404.NET — Technitium DNS "Block Page" splash
==================================================
index.html is a single self-contained file (fonts + mark inlined, zero external requests)
for Technitium's "Block Page" DNS app. Arcade New Wave theme, glitch headline, terminal
readout, circle-safe mark.

How it is dynamic
    The DNS server answers a blocked name with the block page server's IP, so the browser
    sends the BLOCKED domain as the Host header and location.hostname IS the blocked domain.
    The page reads it client-side and shows it, plus path (optional), local time, a category
    label (optional "rules"), and a pre-filled "Request access" mailto / helpdesk link.
    It cannot know WHICH blocklist matched - Technitium does not pass that to the page.
    Direct visits by IP show a generic "(the site you requested)".
    Test any time with  index.html?d=ads.example.com  (also ?p=/some/path).

Install (verify names in your app's Config dialog - they can differ by version)
    1. DNS Settings -> Blocking: set Blocking Type = Custom Address and add THIS server's IP
       as the custom blocking address (required by the app, per its own note).
    2. Apps -> Block Page -> Config: find the web root folder setting and drop index.html
       in that folder (replace the default page).
    3. Optional HTTPS: add a PKCS #12 (.pfx/.p12) cert in the app config. Browsers will show
       a certificate warning on blocked HTTPS sites - expected, per the app's note. Installing
       the app's self-signed root cert on client machines removes it.

Customizing
    - Easiest: the generator at branding.error404.net/#technitium (live preview, then Download).
    - By hand: edit the JSON in <script id="e404-config"> at the bottom of index.html:
        org, headline, message, email, helpUrl (wins over email), theme (dark|light|auto: only
        the page backdrop changes - the terminal window stays navy), showTime, showPath,
        rules ([["doubleclick.net","AD NETWORK"], ...] suffix match), domainOverride (preview only -
        leave empty in production).
    - Rebuild from source: python3 Technitium-Blocked/build.py (reads block-page.template.html).
