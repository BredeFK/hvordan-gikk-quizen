# Hvordan Gikk Quizen?

A small React app for tracking daily quiz scores at Iterate. The team solves the Aftenposten daily quiz together at the
lunch table, and this app records and visualizes the results.

See [ReactViteTypescriptInfo.md](ReactViteTypescriptInfo.md) for more info

---

### Features

- **Daily results** — view the score for any given weekday, defaulting today
- **Statistics** — average score, median, best/worst days, and trends broken down by weekday and month
- **Admin panel** — enter or update a result for a selected date, with an optional Slack notification on save
- **Real-time updates** — scores refresh automatically via Server-Sent Events when a result is registered
- **Google login** — authentication through Google OAuth; only signed-in users can access the admin and profile pages

### Tech stack

React · TypeScript · Vite · Radix UI · MUI · React Router

### Getting started

```bash
yarn
yarn dev
```

**.env**

````dotenv
VITE_API_BASE=http://localhost:8080
````

The app runs on [http://localhost:5173](http://localhost:5173) by default.
