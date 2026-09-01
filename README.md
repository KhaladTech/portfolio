# Khalad — DFIR Portfolio

Three parts:
- `index.html` — the public site. **Display only** — it just reads `data.json` and renders it. Don't edit it for content changes.
- `data.json` — all your content lives here (hero text, about, project, cases, skills, contact).
- `admin/cases.html` and `admin/profile.html` — pages you open yourself to add/edit content. They save straight to `data.json` in your GitHub repo through the GitHub API — no code editing needed.

## 1. Deploy to GitHub Pages

1. Create a repo. Name it `yourusername.github.io` if you want the site at that exact URL, or any name (served at `https://yourusername.github.io/repo-name`).
2. Push everything:
   ```bash
   git init
   git add .
   git commit -m "Portfolio site"
   git branch -M main
   git remote add origin https://github.com/yourusername/REPO_NAME.git
   git push -u origin main
   ```
3. In the repo: **Settings → Pages → Source → Deploy from a branch → `main` / root** → Save.
4. Site goes live at the URL shown there within a minute or two.

## 2. Create a GitHub access token (needed once, for the admin pages)

The admin pages need permission to write to your repo on your behalf.

1. Go to **github.com/settings/tokens?type=beta** (fine-grained tokens).
2. **Generate new token.**
3. Under **Repository access**, choose **Only select repositories** and pick this one.
4. Under **Permissions → Repository permissions**, set **Contents** to **Read and write**.
5. Generate, then copy the token (starts with `github_pat_...`) — GitHub only shows it once.

This token is only ever typed into the admin pages in your own browser and saved to that browser's local storage. It is never written into any file or pushed to the repo.

## 3. Use the admin pages

- Open `yourdomain/admin/cases.html` (or open the file locally in a browser while testing) to add, edit, reorder, or delete case log entries.
- Open `yourdomain/admin/profile.html` to edit the hero text, about section, certifications, featured project, skills, and contact links.
- First time on each page: enter your GitHub username, repo name, branch (`main`), and the token from step 2, then **Save & connect**.
- Every save there is a real commit to `data.json` in your repo. Refresh the live site after saving to see the change (GitHub Pages usually updates within a minute).

### Before you go live
Swap the placeholder email/GitHub/LinkedIn links in **Profile → Contact** for your real ones.

## Notes

- Since anyone could technically open `admin/cases.html` or `admin/profile.html` on your live site, nothing happens without your token — the pages are useless without it. If you'd rather keep them fully private, don't link to them from the public site (they already aren't) and only open them from your own bookmark.
- `data.json` itself is plain text and viewable by anyone (it has to be, so the public site can read it) — don't put anything in it you don't want public.
