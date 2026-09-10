# Sofia Dang - Personal Portfolio
 
> Personal portfolio website built with HTML, CSS, JavaScript, and PHP.
 
🔗 **Live Site:** [sofia-ls-dang.github.io/Website-Portfolio](https://sofia-ls-dang.github.io/Website-Portfolio)
 
---
 
## Overview
 
A fully custom portfolio website featuring animated menu transitions, a slide-out navigation panel, live GitHub project fetching via the GitHub REST API, and a PHP contact form.
 
---
 
## ✨ Features
 
- **Animated slide-out menu** - hidden off-screen, revealed on hover with a smooth transition
- **Red wipe transitions** - full-screen clip-path animation between sections
- **Live GitHub API fetch** - projects section dynamically pulls public repos from GitHub
- **Custom diamond cursor** - red cursor with hover state
- **Sound effects** - Web Audio API click and hover sounds on navigation
- **PHP contact form** - server-side form handling with input sanitization
- **Docker support** - local development with Apache + PHP via Docker Compose
---
 
## 🛠️ Tech Stack
 
| Layer | Technology |
|---|---|
| Structure | HTML5 |
| Styling | CSS3 (custom properties, clip-path, keyframe animations) |
| Interactivity | JavaScript (Fetch API, Web Audio API, IntersectionObserver) |
| Backend | PHP 8.2 (contact form) |
| Database | — |
| Dev Server | Docker + Apache |
| Deployment | GitHub Pages |
| Fonts | Bebas Neue, Share Tech Mono, Fira Code (Google Fonts) |
 
---
 
## 📝 Sections
 
- **About** - bio, photo, technology logos, education & program logos
- **Projects** - live-fetched from GitHub API with custom tech stack tags
- **Courses** - relevant CS coursework from UC Santa Cruz
- **Certifications** - earned and in-progress certifications
- **Contact** - PHP-powered contact form
---
 
## ⚙️ Setup
 
### With Docker (recommended — enables PHP contact form)
 
```bash
# Clone the repo
git clone https://github.com/sofia-ls-dang/Website-Portfolio.git
cd Website-Portfolio
 
# Start the container
docker-compose up
 
# Open in browser
http://localhost:8081
```
 
### Without Docker (HTML/CSS/JS only)
 
1. Open the project in VS Code
2. Install the **Live Server** extension by Ritwick Dey
3. Right click `index.html` → **Open with Live Server**
4. Opens at `http://127.0.0.1:5500`
> Note: The PHP contact form requires a running PHP server. Use Docker for full functionality.
 
---
 
## 🗂️ Project Structure
 
```
Website-Portfolio/
├── index.html              # Main page - all sections
├── css/
│   └── style.css           # All styles, variables, animations
├── js/
│   └── main.js             # GitHub API, menu system, sounds, scroll
├── php/
│   └── contact.php         # Contact form backend
├── assets/
│   ├── photos/             # Profile photo
│   ├── logos/              # Technology and education logos
│   └── fonts/              # Self-hosted fonts (DINPro)
├── Dockerfile
└── docker-compose.yml
```
 
---
 
## 🖋 What I Learned Building This
 
- **CSS clip-path animations** - the red wipe transition and angled menu highlight bars are built entirely with `clip-path: polygon()` and CSS keyframes
- **Web Audio API** - generating click and hover sounds programmatically without any audio files
- **GitHub REST API** - fetching and dynamically rendering public repos with language detection and custom tag mapping
- **IntersectionObserver** - updating the active menu state as the user scrolls through sections
- **PHP form handling** - server-side validation, sanitization, and email sending with spam protection
- **Docker + Apache** - containerizing a PHP site for reproducible local development
---
 
## 📫 Contact
 
**Sofia Dang**
- Portfolio: [sofia-ls-dang.github.io/Website-Portfolio](https://sofia-ls-dang.github.io/Website-Portfolio)
- LinkedIn: [linkedin.com/in/sofia-dang-7022252a3](https://linkedin.com/in/sofia-dang-7022252a3)
- GitHub: [github.com/sofia-ls-dang](https://github.com/sofia-ls-dang)
