# CardMobile V1 Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development only when the user explicitly authorizes subagents; otherwise use superpowers:executing-plans or inline execution. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the first public-release foundation: rolling draw odds with capped low/mid rarities, reveal audio cancellation, premium reveal polish, and optional guest-to-Supabase collection sync.

**Architecture:** Keep the existing Vue 3 + Vite legacy bridge. Make focused changes to `CONFIG`, `js/app.js`, `js/effects.js`, `css/styles.css`, `css/mobile.css`, and the Vue bootstrap so the legacy app remains deployable as static Vite output. Supabase sync is optional and disabled unless environment values exist.

**Tech Stack:** Vue 3, Vite, legacy browser JavaScript, CSS, optional Supabase REST/Auth configuration.

---

### Task 1: Draw Rules And Saturation

**Files:**
- Modify: `D:\Projects\CardMobile\js\config.js`
- Modify: `D:\Projects\CardMobile\js\app.js`

- [ ] Update base rarity weights to `36/25/16/10/7/4/2`.
- [ ] Add `CONFIG.RARITY.SATURATION_LIMITS` with `normal:200`, `common:160`, `rare:120`, `superrare:80`, `ultrarare:50`, `epic:null`, `legendary:null`.
- [ ] Add helpers for capped rarity detection, card saturation, drawable pack cards, effective probability calculation, and temporary 10-pull collection state.
- [ ] Update single-card and multi-card draw paths so capped cards disappear once they hit the threshold, while EPIC/LR never cap.
- [ ] Update probability UI to show effective rolling odds and capped/uncapped status.
- [ ] Verify with a small Node/browser simulation that saturated capped cards are excluded and uncapped premium cards remain drawable.

### Task 2: Reveal Audio And Timer Cancellation

**Files:**
- Modify: `D:\Projects\CardMobile\js\app.js`
- Modify: `D:\Projects\CardMobile\js\effects.js`

- [ ] Add a reveal session id and timer registry.
- [ ] Route reveal-related `setTimeout` calls through a cancellable scheduler.
- [ ] Add `stopSound`, `stopSounds`, and `stopRevealSounds`.
- [ ] Call cancellation from close overlay, redraw, page switch, and new pack open.
- [ ] Expose a safe `window.CardEffects.closeLegendaryAnimation()` path and call it during cancellation.
- [ ] Verify by triggering flip-all then closing overlay in the browser: no delayed new-card or legendary sound continues.

### Task 3: Showcase Stage UI And Performance Polish

**Files:**
- Modify: `D:\Projects\CardMobile\js\app.js`
- Modify: `D:\Projects\CardMobile\css\styles.css`
- Modify: `D:\Projects\CardMobile\css\mobile.css`
- Modify: `D:\Projects\CardMobile\js\effects.js`

- [ ] Add overlay stage classes during reveal and higher-rarity card spotlight classes.
- [ ] Tune reveal timing by rarity and first-time status.
- [ ] Reduce legendary particle counts on mobile.
- [ ] Add CSS for stage overlay, spotlight, active/inactive animation scoping, and reduced motion.
- [ ] Verify mobile layout with browser screenshot.

### Task 4: Optional Supabase Collection Sync

**Files:**
- Modify: `D:\Projects\CardMobile\src\main.js`
- Modify: `D:\Projects\CardMobile\index.html`
- Modify: `D:\Projects\CardMobile\js\app.js`
- Modify: `D:\Projects\CardMobile\css\styles.css`

- [ ] Expose Vite env values as `window.CARDMOBILE_ENV`.
- [ ] Add compact auth/sync UI that stays hidden or disabled when Supabase config is absent.
- [ ] Implement optional sync using Supabase REST/Auth endpoints or a light client approach without blocking guest play.
- [ ] Merge local and cloud counts by addition, clamping only capped rarities.
- [ ] Background-sync after draws when logged in.
- [ ] Verify guest mode works without env values and build succeeds.

### Task 5: Verification

**Files:**
- Modify or create small verification scripts if needed.

- [ ] Run `npm run build`.
- [ ] Run browser check at mobile viewport.
- [ ] Check no unrelated user asset changes were touched.
- [ ] Report remaining Supabase setup requirements.
