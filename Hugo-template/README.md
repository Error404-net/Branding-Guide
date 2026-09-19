Error404 Hugo Template

Reusable Error404 presentation layer extracted from error404-blog.

Included:
- layouts/index.html
- layouts/_default/baseof.html
- layouts/_default/list.html
- layouts/_default/single.html
- static/css/style.css
- static/assets/logos/libra-no-ring-multicolor.svg
- static/assets/logos/libra-no-ring-white.svg
- static/assets/logos/libra-no-ring-black.svg

Integration:
1. Copy layouts/ and static/ into the target site.
2. Keep target content and site configuration separate.
3. Set params.author and params.description.
4. Define the main menu in the target site configuration.
5. Keep the theme toggle JavaScript in baseof.html.
6. Run the site build and test dark, nfo, and light modes.

Theme modes:
- dark: branded purple/cyan/pink digital mode
- nfo: black, gray, flat terminal mode
- light: white, black, gray monochrome NFO-on-paper mode

Branding:
- Official Libra logos are used for the header and favicon.
- The footer uses the Error404 terminal response text.
- No generator credit is rendered in the final HTML.

Do not copy site-specific CNAME files or blog post images.
