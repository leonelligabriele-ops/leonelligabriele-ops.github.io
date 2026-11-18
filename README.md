# Portfolio

A one-page personal site. Plain HTML: no build step and no dependencies.

## Edit
Open `index.html` and replace the placeholder text: name, links, projects, education and so on. To add a project, copy one `<div class="item">` block. If you want a CV link, put `cv.pdf` in this folder.

## Publish on GitHub Pages
1. Create a public repository named **`leonelligabriele-ops.github.io`**.
2. Push this folder to it:
   ```
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/leonelligabriele-ops/leonelligabriele-ops.github.io.git
   git push -u origin main
   ```
3. The site goes live at `https://leonelligabriele-ops.github.io` within a minute or two. If it doesn't, check **Settings → Pages** and make sure the source is set to "Deploy from a branch", `main`, `/ (root)`.
