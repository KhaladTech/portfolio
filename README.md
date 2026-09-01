# Khalad — DFIR Portfolio

A single-file static site (`index.html`) — no build step, no framework, works anywhere HTML works.

## Before you publish

Open `index.html` and update:
- **Contact section** — replace `you@example.com`, the GitHub URL, and the LinkedIn URL with your real links.
- **Hero tag** — "Open to DFIR / SOC roles" if that's no longer accurate.
- **Internship line** — add the entity name if you're comfortable naming it publicly.

## Deploy on GitHub Pages (free)

1. Create a new GitHub repo. If you want it at `https://yourusername.github.io`, name the repo exactly `yourusername.github.io`. Otherwise any name works and it'll be served at `https://yourusername.github.io/repo-name`.
2. Push this file:
   ```bash
   git init
   git add index.html README.md
   git commit -m "Portfolio site"
   git branch -M main
   git remote add origin https://github.com/yourusername/REPO_NAME.git
   git push -u origin main
   ```
3. In the repo: **Settings → Pages → Source → Deploy from a branch → `main` / root**. Save.
4. Your site goes live at the URL GitHub shows on that same page (usually within a minute or two).

### Custom domain (optional)
If you own a domain, add it under **Settings → Pages → Custom domain**, and create a `CNAME` record at your DNS provider pointing to `yourusername.github.io`.

## Adding more cases later

Each entry in the case log is a `.case` block in `index.html` — copy one, change the number, title, description, and artifact tags, and paste it above or below the existing ones (they're already in reverse-chronological order).
