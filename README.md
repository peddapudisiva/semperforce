# Semper Force

**Semper Force** is "The Operating System for Educational Leadership" — a marketing website for a platform that gives K-12 school districts a single, trustworthy system of record. It connects the systems a district already owns (student information, LMS, behavior tracking, MTSS, coaching logs, walkthroughs, surveys, finance) into one evidence layer, then shows each role — teacher, principal, superintendent, board — exactly what they need, at the altitude they operate.

The pitch: **not a signature, one school and one year.** A district can trial the platform at a single site before committing district-wide.

This repository is the public-facing site: the problem it solves, how the platform works, example dashboards, measured outcomes, and a way to request a demo.

## What's on the site

- **The Problem** — the research behind why district leadership time is spent on admin instead of leadership (NCES, RAND, and Center for American Progress data, cited and linked).
- **Our Solution** — how the platform connects existing systems without a rip-and-replace migration, and renders one evidence layer differently for each role.
- **Sample Engagement** — tabbed example dashboards (Principal, Superintendent, PLC, WASC) showing what each role actually sees.
- **Outcome** — the measurable changes districts report in their first year.
- **About** and **Contact** — who built it and how to request a demo.

The homepage mirrors this structure section by section, with a reclaimed-hours calculator and a short insights/blog preview.

## Interaction design

- Three-point explanations (e.g. "why this problem matters") start as a single merged card and split into three on click, each opening a detail popup with the full explanation and sources.
- Dashboard stats animate with a count-up effect and staggered reveal as they scroll into view.
- The homepage hero has a rotating background photo slideshow.

## Tech

Static HTML, CSS and vanilla JavaScript — no build step, no framework, no backend. The contact form and reclaimed-hours calculator are front-end only (no data is actually submitted anywhere).

## Running locally

```bash
python -m http.server 8080
```

Then open `http://localhost:8080` in a browser. Start at `index.html`; the nav links to every other page.

## Pages

| Page | File |
|---|---|
| Home | `index.html` |
| The Problem | `problem.html` |
| Our Solution | `solution.html` |
| Sample Engagement | `sample-engagement.html` |
| Outcome | `outcome.html` |
| About | `about.html` |
| Contact | `contact.html` |
