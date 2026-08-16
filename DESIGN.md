# Aletheia design reference

This is the durable, in-repo substitute for the source design. The actual design lives in a **Claude Design** project (`claude.ai/design`, project "Trang web học AI với chủ đề tím") made of four `.dc.html` pages — `Aletheia (All Pages)`, `Aletheia Landing`, `Aletheia App`, `Aletheia Course Flow` — fetched via Claude's `claude_design` MCP tool. **That tool is Claude-Code-specific and requires the project owner's `claude.ai` login** — an agent or human without it cannot open the source design directly. This document is what makes the remaining screens buildable without that access: it captures the exact copy, layout, and behavior already extracted from the source, screen by screen.

If you *do* have access to the design MCP, it's still the primary source for anything ambiguous below — this doc is a faithful transcription, not a reinterpretation, but transcription errors are possible.

## What Aletheia is

A course-platform/LMS product ("Aletheia · AI Academy") — **not** the RAG document-assistant the repo originally started as. That pivot is final and already reflected in the current code: no PDF upload/parse/chunk/embed pipeline, no `sessions`/`documents` concepts. See `CLAUDE.md` for the authoritative current project definition; this file is the design/content reference behind it.

Scope decisions already made (carry these forward — don't relitigate them while implementing):
- **Courses are manually-authored, not AI-generated.** No LLM/embedding calls anywhere in this product.
- **Payment, video, and labs are mocked.** "Enrolling" in Premium just writes a subscription record — no real payment gateway. Lessons get an optional `video_url` (render a real `<video>`/iframe if present, otherwise the design's placeholder box). Labs are a static description + optional external link (e.g. Colab/GitHub) — no in-browser code execution.
- **English only, wired through i18n.** The source design has a full VI/EN toggle; this build drops the toggle and ships English content only, but routes every UI string through `react-i18next` (see `frontend/src/i18n/`, `frontend/src/content/`) so a second locale is additive later, not a rewrite. Follow the existing pattern: page content goes through a typed `use<Page>Content()` hook in `frontend/src/content/`, never raw `t()` calls sprinkled through JSX.

## Design system

Already implemented in code — **the code is the source of truth for exact values**, not this doc:
- `frontend/src/styles/tokens.css` — full color palette (dark-default, `[data-theme="light"]` opt-in), spacing scale, radius scale, shadows, font tokens
- `frontend/src/index.css` — base typography + component classes (`.btn` + variants, `.input`, `.tag` + variants, `.card`, `.nav`, `.dialog`, `.section*` layout primitives)
- Typeface: self-hosted Inter only (300/400/500/600), no serif — `@fontsource/inter`
- `frontend/src/hooks/useScrollReveal.ts` — the design's fade+slide-up-on-scroll effect for `[data-reveal]` elements

Extend this system rather than inventing a parallel one. If a new screen needs a primitive that doesn't exist yet (e.g. `.seg`, `.radio`, `.table` — present in the design's underlying "Nocturne" component system but not yet ported), port it following the same pattern as the existing classes in `index.css`, recolored to the tokens above.

## Screen inventory

| Screen | Route (planned) | Status | Design source |
|---|---|---|---|
| Landing | `/` | **Built** | `Aletheia Landing.dc.html` |
| Sign up | `/signup` | Not built | `Aletheia App.dc.html` — `screen: "signup"` |
| Log in | `/login` | Not built | `Aletheia App.dc.html` — `screen: "login"` |
| My courses | `/courses` | Not built | `Aletheia App.dc.html` — `screen: "courses"` |
| Profile | `/profile` | Not built | `Aletheia App.dc.html` — `screen: "profile"` |
| Settings | `/settings` | Not built | `Aletheia App.dc.html` — `screen: "settings"` |
| Course detail | `/courses/:courseId` | Not built | `Aletheia Course Flow.dc.html` — `screen: "detail"` |
| Search / catalog | `/catalog` | Not built | `Aletheia Course Flow.dc.html` — `screen: "search"` |
| Subscription plans | `/subscription` | Not built | `Aletheia Course Flow.dc.html` — `screen: "subscription"` |
| Enroll (mock payment) | `/courses/:courseId/enroll` | Not built | `Aletheia Course Flow.dc.html` — `screen: "enroll"` |
| Course progress | `/courses/:courseId/learn` | Not built | `Aletheia Course Flow.dc.html` — `screen: "progress"` |
| Lesson player | `/courses/:courseId/lessons/:lessonId` | Not built | `Aletheia Course Flow.dc.html` — `screen: "lesson"` |

`ROUTES` constants already exist in `frontend/src/content/routes.ts` for `home`/`signup`/`login`/`catalog` — extend that file rather than hardcoding new route strings.

Two shell patterns, reused across screens:
- **Auth shell** (signup/login): two-column layout — left aside with brand mark, a pull-quote, and three stat figures, on a `--color-section`/`--color-section-glow` gradient background; right side is a centered form, max-width ~430px.
- **App shell** (courses/profile/settings/detail/search/subscription/enroll/progress/lesson): persistent left sidebar (246px, or 292px on the lesson player) with brand mark, nav items (My courses / Find courses / Library / Profile / Settings, each with an active-state left rule and optional count badge), and a user chip pinned to the bottom. Content area has a sticky header with a page kicker + title + 1–2 action buttons (not on detail/search/enroll/progress/lesson, which build their own headers inline).

## Signup / Login

Shared aside copy:
- Quote: *"Knowledge cannot be handed over by shortcut. It is built stage by stage."* — attributed *"Aletheia's teaching principle"*
- Stats: `48` Courses · `120+` Labs · `31` Faculty

**Signup** — kicker "Enrolment", title "Create your learning account", sub "Thirty seconds to begin the first stage of your track."
Fields: Full name (placeholder "Minh Khang Nguyen"), Email (placeholder "you@university.edu"), Password (hint "At least 10 characters; a number or symbol helps."), a **track picker** (two selectable cards: "Applied — No code needed" / "Technical — With labs"). Primary action "Create account". Divider "or", secondary action "Continue with university email". Terms note: *"By creating an account you agree to Aletheia's Academic Regulations and Data Policy."* Switch note: "Already enrolled? Sign in".

**Login** — kicker "Welcome back", title "Sign in", sub "Continue from the exact lesson you left." Fields: Email, Password. "Keep me signed in" checkbox + "Forgot password?" link. Primary action "Sign in". Same SSO divider/action. Switch note: "No account yet? Create one".

## My courses

Header: kicker "Learning", title "My courses", secondary action "Help", primary action "Add a course".
Progress stat row (4 stats): `3` In progress · `62%` Average progress · `41 hrs` Studied this term · `9` Week streak.
Tabs: In progress (3) / Completed (5) / Saved (4), each with a count-label line under it (e.g. "3 courses in progress · updated today").
Each course row: track + level tag, title, a "next up" line, a progress bar + percentage, lesson-count / time-left / instructor facts, and a CTA button whose label changes by state — **Continue** (active), **View certificate** / **Revisit lessons** (completed), **Start course** / **View requirements** (saved). Sample data for all three tabs is in the design (3 active + 2 completed + 2 saved courses) — good seed-data material.

## Profile

Header: kicker "Account", title "Profile", primary action "Save changes".
Two-column layout: main column (avatar + upload/remove actions, "Personal details" fields — full name/email/phone/institution/current track/timezone, most read-only except where noted — and a "Learning goal" section with a bio textarea + interest tags), sidebar (an "Academic record" stat list: courses completed/labs passed/total hours/average grade, and a "Certificates" list with certificate number + date).

## Settings

Header: kicker "Account", title "Settings", primary action "Save settings".
Sections: Language & materials (interface language segmented control, lecture-subtitle select — inert given English-only scope, but keep the section since subtitle language ≠ interface language even for one locale), then three toggle groups — **Notifications** (weekly reminder, new lectures in my track, weekly essay), **Labs** (autosave notebooks, use shared GPUs when free, show code suggestions), **Privacy** (show profile to classmates, appear on leaderboards, share learning data for research) — each item is a label + one-line note + an on/off switch. Closing "Data and account" panel: export-data and delete-account actions (delete-account is styled as an accent-tinted secondary button, **not red** — the design has no danger/destructive color anywhere).

## Course detail

Breadcrumb (Library / track / title) over a gradient header. Title, track + level tags, a course code (e.g. `AL-402`), lede paragraph, 4 quick facts (length, labs, start date, language). A side panel: premium/free badge, an access note, primary CTA (**Upgrade to Premium** for premium courses → enroll flow, or **Start learning free** for free ones → straight into progress), a "Preview two lessons" secondary action, and an includes-list (labs on shared GPUs, verifiable certificate, lifetime updates, "all 48 courses with Premium").
Below: **Outcomes** (a 4-item "by the end you will..." grid), **Syllabus** (chapter list — number, title, description, lesson/hour meta; sample data has 6 chapters), **Content team** card (portrait placeholder, name "Aletheia content team", role, bio — note it's explicitly *not* a single instructor), and a **Prerequisites** sidebar list with per-item completion status.

## Search / catalog

Search bar + button. Left sidebar of facets (**Track**, **Level**, **Length**, **Format**), each a checkbox list with result counts — sample facets exist for all four groups. Result count line + a sort dropdown (Most relevant / Newest / Most enrolled). Each result row: track/level tags + a "Labs" badge, title, description, lesson/hour/instructor facts, an access-state badge (free/premium), and a "View details" button.

## Subscription

Centered pricing header (kicker "Upgrade", title "One plan, the whole roadmap."). Two plan cards side by side: **Free** ($0, "start learning now, no card needed", 3 features) and **Premium** (monthly/yearly segmented toggle, price + a "Save 17%" yearly badge, 4 features, CTA "Choose this plan"). Below: a 3-question FAQ list (free-forever confirmation, cancel-anytime confirmation, how the student scholarship works).

## Enroll (mock payment)

A 3-step indicator (Choose a plan → Payment → Confirm — purely visual, this is a single-page form, not a wizard). Title "Upgrade to Premium", sub referencing the specific course being unlocked. Left column: plan picker (radio cards — Premium monthly $8/mo, Premium yearly $80/yr, Student scholarship $0) and a payment form (card number, expiry, CVC, name on card, an "I need an invoice for my institution" checkbox) — **this form never actually charges anything**, submitting just creates the `Subscription` record. Right column: an order-summary card (course being unlocked, billing cycle, next renewal date, cancel-anytime note, total, confirm button, a 14-day refund note).

## Course progress

Gradient header: track tag, course code, enrolled-date note, title, a progress bar (e.g. "42% · 8/19 lessons"), and a prominent "Continue →" button. Below: an "up next" card (highlighted, click-through to the lesson player) and a **Chapters and lessons** accordion-style list — each chapter shows its own completion meta ("3/3 LESSONS · COMPLETE" / "1/4 LESSONS · IN PROGRESS" / "0/3 LESSONS · LOCKED") and each lesson row has a status mark (done/current/todo/locked) + title + optional tag + duration. Sidebar: an "Upcoming" schedule list (live office hours, lab deadlines, midterm checks) and a "Labs" status summary (labs passed, open notebooks, GPU queue state).

Lesson **lock** rule from the sample data: a lesson is locked if its chapter hasn't been reached yet (previous chapter incomplete) — this is a derived/computed state (per the data-model note below), not a stored flag.

## Lesson player

Left rail (292px, scrollable independently): "← Back to course", course title, a slim progress bar + "8/19 lessons · 42%" label, then the same chapter/lesson list as course-progress, condensed for navigation (click any unlocked lesson to jump to it).
Main content: lesson number + chapter breadcrumb, title, a 16:9 video area (placeholder box with a play glyph + caption when no `video_url`, real `<video>`/iframe when one exists), then three tabs:
- **Lecture** (notes tab, default): body paragraph, a highlighted "key idea" blockquote, a second body paragraph, then a monospace code block.
- **Transcript**: timestamped list of `{time, text}` rows.
- **Lab**: a highlighted lab card (kicker, title, body, "Open notebook" + "Download" actions — both external-link placeholders, no in-browser execution) and a numbered steps list.
Footer bar: Previous / Mark as done / Next lesson.

## Data model & API (planned — not yet implemented)

The backend was reset to a clean template (`app/`, `tests/`, `alembic/`, `docker-compose.yml` all removed — see `CLAUDE.md`'s current repo state). This is the schema/API shape agreed on for rebuilding it, matching the screens above:

**Tables**: `User` (id, full_name, email, password_hash, track_preference, created_at) · `Course` (id, track, level, code, slug, title, kicker, lede, is_premium, duration_hours, lessons_count, instructor_name/role/bio, image_url, created_at) · `Module` (id, course_id, index, title, summary) · `Lesson` (id, module_id, index, title, duration_minutes, video_url, body_markdown, key_idea, code_snippet, transcript JSON, lab_title/body/external_url/steps JSON — all lab_* nullable) · `CoursePrerequisite` (course_id, prerequisite_course_id) · `Enrollment` (id, user_id, course_id, status: active/completed/saved, enrolled_at, completed_at) · `LessonProgress` (id, enrollment_id, lesson_id, completed_at — presence of a row = done; "current"/"locked" are derived, not stored) · `Subscription` (id, user_id, plan: monthly/yearly/student, status, started_at, renews_at, canceled_at — no real payment fields) · `Certificate` (id, user_id, course_id, certificate_number, issued_at).

**API surface**: `POST /auth/signup`, `POST /auth/login` (JWT), `GET /users/me`, `PATCH /users/me` · `GET /courses` (search/filter, facet counts), `GET /courses/{id}` · `GET /me/courses`, `POST /courses/{id}/enroll`, `POST /courses/{id}/save` · `GET /subscriptions/plans`, `POST /subscriptions` (mock pay) · `GET /courses/{id}/lessons/{lessonId}`, `POST /lessons/{id}/complete` (issues a `Certificate` if it completes the course).

Auth: `PyJWT` + `passlib[bcrypt]` (no auth library exists yet — confirmed absent from the pre-pivot `pyproject.toml` too). Layering follows the existing convention: routes → services → repositories, one pair per area (auth/course/enrollment/subscription/lesson/user).

Seed data: courses/modules/lessons need a seed script — there's no admin UI planned yet, so content is seeded directly. The sample data throughout this doc (My courses' 7 sample courses, the search results, the Transformer-architecture course detail, its full syllabus/lesson/transcript content) is real, usable seed material, not placeholder text to discard.
