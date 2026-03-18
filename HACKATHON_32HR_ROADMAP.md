# ⏱️ CivicCore — 32-Hour Hackathon Execution Roadmap

> Hour-by-hour battle plan. Every minute counts. Follow this exactly and you'll have a **hackathon-winning product**.

---

## 🗓️ Timeline Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│ PHASE 1: Critical Fixes & Foundation          │ Hours 0-4   (4 hrs)   │
│ PHASE 2: WOW Feature #1 — Analytics Dashboard │ Hours 4-8   (4 hrs)   │
│ PHASE 3: WOW Feature #2 — SLA Timer System    │ Hours 8-11  (3 hrs)   │
│ PHASE 4: WOW Feature #3 — AI Resolution Score │ Hours 11-14 (3 hrs)   │
│ ☕ SLEEP/REST BREAK                            │ Hours 14-18 (4 hrs)   │
│ PHASE 5: WOW Feature #4 — Leaderboard & Tiers │ Hours 18-21 (3 hrs)   │
│ PHASE 6: UX Polish & Landing Page Redesign    │ Hours 21-25 (4 hrs)   │
│ PHASE 7: Demo Prep & Seed Data                │ Hours 25-28 (3 hrs)   │
│ PHASE 8: Final Testing & Presentation Prep    │ Hours 28-32 (4 hrs)   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🔴 PHASE 1: Critical Fixes & Foundation (Hours 0–4)

> **Goal:** Fix all the bugs and gaps that would embarrass you during demo.

### Hour 0–0.5: Setup & Quick Wins
- [ ] Open project, run `npm run dev`, verify everything works
- [ ] Delete dead `analyzeImageAction()` function from `app/actions/report.ts` (lines 105-121)
- [ ] Fix complaint detail access — remove redirect on line 56-58 in `complaints/[id]/page.tsx` → allow ALL logged-in users to view ANY complaint (keep edit/delete for admins only)
- [ ] **Commit:** `fix: allow public complaint viewing + remove dead code`

### Hour 0.5–1.5: Loading States & Error Pages
- [ ] Create `app/dashboard/loading.tsx` — animated skeleton (pulsing cards + map placeholder)
- [ ] Create `app/admin/loading.tsx` — animated skeleton
- [ ] Create `app/not-found.tsx` — branded 404 page with CivicCore logo + "Back to Dashboard" button
- [ ] Create `app/error.tsx` — branded error page with retry button
- [ ] **Commit:** `feat: add loading skeletons, 404, and error pages`

### Hour 1.5–3: Dashboard Search & Filter
- [ ] Add search bar above complaint list (search by title/description/category)
- [ ] Add filter chips: All | Pothole | Garbage | Water Leak | Broken Streetlight | Fallen Tree
- [ ] Add severity filter: All | Low | Medium | High | Critical
- [ ] Add status filter: All | Pending | In Progress | Resolved
- [ ] **Commit:** `feat: add search + filter on dashboard`

### Hour 3–4: Map Clustering + Mobile Fix
- [ ] Install `leaflet.markercluster` → add marker clustering on dashboard map
- [ ] Test mobile responsiveness (375px width):
  - Fix admin dashboard card overflow
  - Fix complaint detail sidebar stacking
  - Fix map height on mobile (should be 300px not 500px)
- [ ] Add responsive meta tag if missing
- [ ] **Commit:** `feat: map clustering + mobile responsiveness`

### ✅ Phase 1 Checkpoint:
At this point you have: a bug-free, polished base with search/filter, loading states, error pages, and a mobile-friendly map. **This alone puts you ahead of 70% of hackathon teams.**

---

## 🟡 PHASE 2: WOW Feature #1 — Analytics Dashboard (Hours 4–8)

> **Goal:** Build a public-facing analytics page that screams "DATA-DRIVEN."

### Hour 4–5: Schema & API
- [ ] Create `app/analytics/page.tsx` (server component)
- [ ] Write Prisma queries for:
  - Total complaints by category (for pie chart)
  - Complaints per day/week for last 30 days (for line chart)
  - Resolution rate by month (for bar chart)
  - Average resolution time by severity
  - Top 5 reporters by karma (leaderboard preview)

### Hour 5–7: Charts with Recharts
- [ ] Install `recharts` (already in deps ✅)
- [ ] Build **Complaints Over Time** — Area chart with gradient fill
- [ ] Build **Category Distribution** — Donut chart with custom colors
- [ ] Build **Resolution Rate Trend** — Bar chart (Resolved vs Pending per week)
- [ ] Build **Severity Breakdown** — Horizontal bar chart
- [ ] Build **Key Metrics Row** — 4 stat cards (Total Issues, Resolution Rate, Avg Response Time, Active Citizens)

### Hour 7–8: Polish & Responsive
- [ ] Add dark glassmorphism styling consistent with app theme
- [ ] Make charts responsive for mobile
- [ ] Add "Analytics" link to navbar
- [ ] Add page transitions with Framer Motion (fade-in on load)
- [ ] **Commit:** `feat: public analytics dashboard with live charts`

### ✅ Phase 2 Checkpoint:
You now have a **stunning analytics page** with 4-5 interactive charts. Judges LOVE data visualization — this is a massive differentiator.

---

## 🟡 PHASE 3: WOW Feature #2 — SLA Timer System (Hours 8–11)

> **Goal:** Every complaint gets a deadline. If missed, it auto-escalates. Real accountability.

### Hour 8–9: Schema Update
- [ ] Add to `schema.prisma`:
  ```prisma
  // In Complaint model:
  slaDeadline    DateTime?
  escalatedAt    DateTime?
  escalationLevel Int       @default(0)
  ```
- [ ] Run `npx prisma db push`
- [ ] Update `createReport` action to auto-set `slaDeadline` based on severity:
  - CRITICAL → +24 hours
  - HIGH → +72 hours
  - MEDIUM → +7 days
  - LOW → +14 days

### Hour 9–10: Escalation Logic
- [ ] Create `app/actions/escalation.ts`:
  - `checkAndEscalate()` → finds all complaints past SLA deadline that aren't resolved
  - Auto-bumps severity (LOW→MEDIUM, MEDIUM→HIGH, HIGH→CRITICAL)
  - Sets `escalatedAt` timestamp
  - Increments `escalationLevel`
- [ ] Create `app/api/cron/escalate/route.ts` — API route that runs escalation (can be triggered manually or by cron)

### Hour 10–11: UI — Countdown Timer
- [ ] Create `components/complaint/sla-timer.tsx`:
  - Shows countdown: "⏱️ 2d 14h 32m remaining"
  - Color-coded: Green (>50% time left), Yellow (25-50%), Red (<25%), Flashing Red (overdue)
  - Shows "🔥 OVERDUE — Escalated to HIGH" when past deadline
- [ ] Add SLA timer to complaint cards (dashboard list + admin list + complaint detail page)
- [ ] **Commit:** `feat: SLA timer with auto-escalation system`

### ✅ Phase 3 Checkpoint:
You now have **real-time accountability** — every complaint has a ticking deadline. This is something 99% of civic apps DON'T HAVE. Judges will be impressed.

---

## 🟡 PHASE 4: WOW Feature #3 — AI Before/After Resolution Scoring (Hours 11–14)

> **Goal:** When admin uploads resolution photo, AI verifies it actually shows improvement.

### Hour 11–12: AI Comparison Logic
- [ ] Add to `lib/ai.ts`:
  - `compareImages(originalBuffer, resolutionBuffer)` function
  - Uses ResNet-50 to extract feature vectors from both images
  - Computes cosine similarity between feature vectors
  - Returns `resolutionScore` (0-100)
  - Score logic: If both images have same category (e.g., both show road) = likely valid. If completely different = suspicious.

### Hour 12–13: Backend Integration
- [ ] Add `resolutionScore Float?` field to Complaint model in Prisma
- [ ] Run `npx prisma db push`
- [ ] Update `resolveComplaintAction()` in `report.ts`:
  - After uploading resolution image, run AI comparison
  - Store the score in `resolutionScore` field
  - If score < 30, add warning flag (but still allow resolution)

### Hour 13–14: UI — Score Display
- [ ] Create `components/complaint/resolution-score.tsx`:
  - Circular progress gauge showing score (0-100%)
  - Color: Green (70-100%), Yellow (40-69%), Red (0-39%)
  - Labels: "✅ Verified Resolution", "⚠️ Needs Review", "❌ Suspicious"
- [ ] Show Before vs After images side-by-side on complaint detail page with AI score between them
- [ ] Add score to admin dashboard as a column
- [ ] **Commit:** `feat: AI before/after resolution verification scoring`

### ✅ Phase 4 Checkpoint:
Your AI pipeline now has a **second brain** — it doesn't just classify issues, it VERIFIES resolutions. This is a killer demo moment. "The AI won't let fake resolutions pass."

---

## 😴 SLEEP/REST BREAK (Hours 14–18)

> **Seriously, rest.** You've built the core WOW features. The next phase needs a fresh mind. Even 2-3 hours of sleep will help you code 2x faster.

- [ ] Push all code to Git
- [ ] Take a break / power nap

---

## 🟢 PHASE 5: WOW Feature #4 — Leaderboard & Tier System (Hours 18–21)

> **Goal:** Make civic engagement feel like a game. Citizens compete to be the top contributor.

### Hour 18–19: Tier System
- [ ] Create `lib/karma.ts` — tier calculation logic:
  ```
  0-49 pts     → 🥉 Bronze Citizen
  50-149 pts   → 🥈 Silver Guardian
  150-349 pts  → 🥇 Gold Defender
  350-699 pts  → 💎 Platinum Sentinel
  700+ pts     → 👑 Diamond Champion
  ```
- [ ] Update `ranking` field on User model (auto-calculated)
- [ ] Show tier badge on profile page next to karma points

### Hour 19–20: Leaderboard Page
- [ ] Create `app/leaderboard/page.tsx`:
  - Top 20 citizens ranked by karma
  - Show rank #, avatar, name, tier badge, karma points, report count
  - Highlight current user's position with glow effect
  - Podium design for top 3 (Gold/Silver/Bronze cards)
- [ ] Add "Leaderboard" link to navbar

### Hour 20–21: Achievements System (Lite)
- [ ] Create 6-8 achievement badges (compute on-the-fly, no new DB model needed):
  - 🏁 **First Report** — Filed your first civic report
  - 🔟 **Dedicated Reporter** — Filed 10+ reports
  - 🌟 **Community Star** — Got 10+ upvotes on a single report
  - ✅ **Problem Solver** — 5+ of your reports were resolved
  - 💬 **Discussion Starter** — Got 10+ comments on a report
  - 🌙 **Night Owl** — Filed a report between 10 PM – 5 AM
  - 🏆 **Top Contributor** — Reached Gold tier or above
- [ ] Show achievements grid on profile page
- [ ] **Commit:** `feat: leaderboard + tier system + achievements`

### ✅ Phase 5 Checkpoint:
Full gamification is live — tiers, leaderboard, achievements. This makes users WANT to report issues. "Civic engagement through gamification."

---

## 🔵 PHASE 6: UX Polish & Landing Page Redesign (Hours 21–25)

> **Goal:** Make the app look SO GOOD that judges are impressed before they see any features.

### Hour 21–23: Landing Page Overhaul
- [ ] Redesign `app/page.tsx` with these sections:
  1. **Hero Section** — Animated gradient text + floating concentric circles (already have)
  2. **NEW: "How It Works"** — 3-step visual flow:
     - Step 1: 📸 "Snap a Photo" → AI auto-detects issue
     - Step 2: 🤖 "AI Classifies" → Category, severity, location auto-filled
     - Step 3: ✅ "Authority Resolves" → Before/After proof with AI verification
  3. **NEW: Live Stats Counter** — "X Issues Reported | Y% Resolved | Z Active Citizens" (fetch real data from DB)
  4. **Feature Grid** — Expand to 6 cards (add SLA Timer, Analytics, Leaderboard)
  5. **NEW: Tech Stack Section** — Show logos of Next.js, HuggingFace, Prisma, Leaflet, Socket.IO
  6. **Footer** — Team names, GitHub link, hackathon name

### Hour 23–24: Micro-Animations
- [ ] Add Framer Motion animations throughout:
  - Landing page sections: `fadeInUp` on scroll
  - Dashboard cards: `staggerChildren` animation (cards appear one by one)
  - Map markers: bounce animation when appearing
  - Stat counters on analytics: `countUp` animation (0 → 324)
  - Page transitions: fade between routes
- [ ] Add hover effects on all interactive elements

### Hour 24–25: Final Design Polish
- [ ] Add custom favicon (CivicCore branded shield icon)
- [ ] Add SEO meta tags to `layout.tsx`:
  ```tsx
  export const metadata = {
    title: 'CivicCore — AI-Powered Civic Issue Resolution',
    description: 'Report infrastructure issues...',
    openGraph: { ... },
  }
  ```
- [ ] Add `generateMetadata` in `complaints/[id]/page.tsx` for shareable complaint links
- [ ] Review all pages on mobile (375px) — fix any remaining overflow
- [ ] **Commit:** `feat: landing page redesign + animations + SEO`

### ✅ Phase 6 Checkpoint:
The app now looks **premium**. First impression = 10/10. Judges are wowed before you even start talking about AI.

---

## 🟣 PHASE 7: Demo Prep & Seed Data (Hours 25–28)

> **Goal:** Make the demo FLAWLESS. Real data, perfect flow, no broken states.

### Hour 25–26: Seed Realistic Data
- [ ] Create `scripts/seed.ts`:
  - Add 15-20 realistic complaints across different categories:
    - 4 Potholes (different severities)
    - 3 Garbage dumping
    - 3 Water logging
    - 2 Broken streetlights
    - 2 Fallen trees
    - Mix of PENDING, IN_PROGRESS, RESOLVED statuses
  - Scatter locations across a real Indian city (use Mumbai/Delhi/your city coordinates)
  - Add 5-6 fake users with different karma levels and tiers
  - Add upvotes and comments on popular complaints
  - Set SLA deadlines (some overdue, some on-track)
- [ ] Add some resolved complaints with resolution images and scores
- [ ] Run seed script: `npx tsx scripts/seed.ts`

### Hour 26–27: Demo Flow Rehearsal
- [ ] Practice the EXACT demo flow 3 times:
  1. **Start**: Open landing page → Show "How it Works" → Click "Report Issue"
  2. **AI Demo**: Upload a real pothole photo → Watch AI classify it live → Show confidence bars
  3. **Map View**: Show all 15+ complaints plotted on map with clusters
  4. **Search**: Search for "pothole" → Filter by HIGH severity → Show results
  5. **Community**: Click a complaint → Show comments, upvotes, SLA timer
  6. **Admin Switch**: Login as admin → Show Command Center → Change status → Resolve with photo
  7. **AI Verification**: Show Before vs After side-by-side with AI confidence score
  8. **Analytics**: Open analytics page → Show charts (complaints trend, resolution rate, category breakdown)
  9. **Leaderboard**: Show top citizens, tier badges, achievements
  10. **Close**: Back to landing page → Show live stats → End

### Hour 27–28: Fix Any Broken Flows
- [ ] Test every single page on both desktop and mobile
- [ ] Fix any console errors
- [ ] Make sure map loads fast (no CORS issues)
- [ ] Verify AI analysis works with 2-3 different test images
- [ ] **Final Commit:** `chore: seed data + demo preparation`

### ✅ Phase 7 Checkpoint:
Your demo is rehearsed and bulletproof. You have real data, real AI results, and a smooth 10-step flow.

---

## 🏁 PHASE 8: Final Testing & Presentation Prep (Hours 28–32)

> **Goal:** Presentation wins hackathons, not just code. Polish your pitch.

### Hour 28–29: Presentation Slides
- [ ] Create 8-10 slides:
  1. **Title Slide**: CivicCore logo + tagline + team names
  2. **Problem**: "80% of civic complaints go unresolved. Zero accountability."
  3. **Solution**: CivicCore — AI-powered reporting with proof-of-work verification
  4. **Demo**: (Live Demo — 3-4 minutes)
  5. **AI Pipeline**: ResNet-50 → BART Zero-Shot → Category + Severity + Confidence
  6. **Key Innovation**: Before/After AI Verification + SLA Escalation
  7. **Impact**: Show analytics screenshot — Resolution rate, response time improvement
  8. **Tech Stack**: Architecture diagram (Next.js → Prisma → HuggingFace → Socket.IO)
  9. **Future Scope**: Mobile PWA, Predictive Heatmaps, CivicBot AI, Ward Analytics
  10. **Thank You + Q&A**

### Hour 29–30: README Update
- [ ] Update `README.md` with:
  - All new features listed
  - Updated screenshots (take fresh screenshots of every page)
  - Architecture diagram
  - Clear setup instructions
  - Demo video link (if time permits — record a 2-min walkthrough)

### Hour 30–31: Final Bug Sweep
- [ ] Run `npm run build` — fix any build errors
- [ ] Test on a fresh browser (incognito) — clear cache, login fresh
- [ ] Verify auth flow (Google + credentials both work)
- [ ] Check all API routes respond correctly
- [ ] Make sure no `console.log`s are visible in production

### Hour 31–32: Presentation Practice
- [ ] Practice full presentation (slides + live demo) 3 times
- [ ] Time it: Target **5-7 minutes** total
  - Problem: 30 seconds
  - Solution overview: 30 seconds
  - **Live Demo: 3-4 minutes** (this is the star)
  - Tech / Innovation: 1 minute
  - Future scope: 30 seconds
- [ ] Prepare for judge questions:
  - "How does the AI handle edge cases?" → Show confidence scores + fallback logic
  - "What about fake reports?" → AI verification + karma system prevents abuse
  - "How does it scale?" → Map clustering, pagination, DB indexing
  - "What's the business model?" → Municipal SaaS licensing, smart city partnerships

---

## 📊 Feature vs Time Summary

| Phase | Feature | Hours | Impact on Judges |
|-------|---------|-------|-----------------|
| 1 | Critical Bug Fixes + Search/Filter | 0-4 | ⭐⭐⭐ Foundation |
| 2 | Analytics Dashboard (Recharts) | 4-8 | ⭐⭐⭐⭐⭐ WOW |
| 3 | SLA Timer + Auto-Escalation | 8-11 | ⭐⭐⭐⭐⭐ WOW |
| 4 | AI Before/After Resolution Score | 11-14 | ⭐⭐⭐⭐⭐ KILLER |
| 😴 | REST | 14-18 | 🧠 Brain recovery |
| 5 | Leaderboard + Tiers + Achievements | 18-21 | ⭐⭐⭐⭐ Great |
| 6 | Landing Page + Animations + SEO | 21-25 | ⭐⭐⭐⭐ Wow visual |
| 7 | Seed Data + Demo Rehearsal | 25-28 | ⭐⭐⭐⭐⭐ Critical |
| 8 | Slides + README + Final Test | 28-32 | ⭐⭐⭐⭐⭐ Win/Lose here |

---

## 🚨 Emergency Rules

> **If you're running behind:**

1. **Cut Phase 5 (Leaderboard)** first — it's nice-to-have, not demo-critical
2. **Never cut Phase 7 (Seed Data)** — an empty app = dead demo
3. **Never cut Phase 8 (Presentation)** — a bad pitch with great code still loses
4. **Phase 4 (AI Scoring)** is the biggest differentiator — protect this phase
5. If exhausted, skip rest but DON'T skip demo rehearsal

---

## 💬 Judge-Winning One-Liners (Keep These Ready)

- *"CivicCore doesn't just report — it verifies. Our AI checks if the resolution is real."*
- *"Every complaint has a ticking SLA. Miss the deadline? Auto-escalation kicks in."*
- *"We use the same zero-shot classification pipeline that enterprise NLP systems use."*
- *"Citizens don't just complain — they compete. Our gamification turns civic duty into civic pride."*
- *"This isn't a prototype. This is a production-grade civic accountability platform."*

---

> **🎯 Final Word:** You have 32 hours. That's enough to build something EXCEPTIONAL. Phase 1-4 alone gives you 4 massive features that 95% of hackathon teams won't have. Execute this plan and you WIN. 🏆
