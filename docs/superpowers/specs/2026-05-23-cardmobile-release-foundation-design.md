---
title: CardMobile Release Foundation Design
date: 2026-05-23
status: draft
---

# CardMobile Release Foundation Design

## Goals

Prepare CardMobile for a public first release while keeping the current Vue 3 + Vite bridge stable. The first release focuses on the core collection loop: guest play, satisfying card reveal flow, local collection persistence, optional login sync, better draw balance, and a fix for reveal audio continuing after the overlay is closed.

The selected visual direction is **Showcase Stage**: opening a pack should feel like a premium card reveal ceremony, with controlled pauses, spotlight moments, and layered sound. The implementation must still run well on mobile.

## Scope

First release includes:

- Fix reveal audio and timer leakage when closing the draw overlay.
- Improve performance for card reveal, legendary effects, particles, and always-running animations.
- Upgrade the draw overlay, timing, animation, and sound behavior toward a high-standard gacha-game feel.
- Keep visitors playable without login.
- Add Supabase-backed login and collection sync as the zero-cost cloud path.
- Rebalance draw probabilities without changing card rarity labels or any card's assigned rarity.
- Add card saturation thresholds: when a card reaches its max owned count, it is removed from future draws for that player.
- Make probabilities roll dynamically based on the player's unsaturated cards in the selected pack.
- Defer backend-authoritative draw API, anti-cheat, leaderboard, event card pools, and full draw logging to a later phase.

Out of scope for first release:

- Ranking and leaderboards.
- Full rewrite of `js/app.js` into Vue components.
- Server-authoritative draw results.
- Remote card/pack configuration.
- Payment, stamina, currency, or monetization systems.

## Architecture

The app remains a Vue 3 + Vite shell that mounts the existing card game UI and legacy scripts. This limits release risk while giving the project a modern build pipeline.

The first release will add small, focused modules around the existing logic rather than a large rewrite:

- `CONFIG.RARITY.WEIGHTS`: base rarity weights.
- `CONFIG.RARITY.SATURATION_LIMITS`: max owned count for capped rarities, with EPIC and LR intentionally uncapped.
- Draw helpers in `js/app.js`: filter saturated cards, group unsaturated cards by rarity, calculate effective rolling odds, and draw from the remaining pool.
- Reveal controller in `js/app.js`: one place to register timers, cancel reveal sessions, and stop reveal SFX.
- Supabase client/service in `src` or a small legacy bridge: auth state, collection load, merge, and background sync.

The future backend draw API should be scheduled as phase two. In that phase, Supabase Edge Functions or a small API service will own draw calculation, draw logs, and anti-cheat rules. First release still calculates draws in the client.

## Draw Probability Design

Card rarity labels and per-card rarity assignments stay unchanged.

Base rarity weights:

```js
normal: 36
common: 25
rare: 16
superrare: 10
ultrarare: 7
epic: 4
legendary: 2
```

These weights sum to 100. Compared with the previous `40/25/15/10/6/3/1`, high-rarity cards appear slightly more often so the Showcase Stage reveal flow is visible during normal play, while legendary cards remain rare.

Saturation limits:

```js
normal: 200
common: 160
rare: 120
superrare: 80
ultrarare: 50
epic: null
legendary: null
```

EPIC and LR cards are uncapped. They are never removed from the draw pool by saturation. This keeps premium cards collectible even after repeated pulls, while lower tiers absorb long-tail collection progress.

Before each card draw:

1. Build the selected pack's available card list.
2. Remove capped cards where `collection[card.id] >= SATURATION_LIMITS[card.rarity]`.
3. Group the remaining cards by rarity.
4. Use only rarities that still have at least one unsaturated card.
5. Recalculate total weight from those remaining rarity groups.
6. Roll rarity, then roll a random card inside that rarity group.
7. Immediately update the in-memory collection so later cards in the same 10-pull respect newly reached saturation.

If `normal` and `common` are fully saturated, their weights are removed and the remaining weights are normalized. For example:

```js
rare: 16
superrare: 10
ultrarare: 7
epic: 4
legendary: 2
```

Total weight becomes 39, so effective probabilities become about:

```js
rare: 41.0%
superrare: 25.6%
ultrarare: 17.9%
epic: 10.3%
legendary: 5.1%
```

If all capped cards in a pack are saturated, the pack still remains open as long as it contains EPIC or LR cards, because those rarities are uncapped. A pack should show a completed or capped state only when no drawable cards remain, which is unlikely for packs containing uncapped EPIC or LR cards. Probability UI must show effective current odds, not only base odds.

## Collection Persistence And Sync

Guest mode remains the default. A player can open the app and draw immediately. Local collection data stays in `localStorage`.

Supabase is the first public-release cloud option because it covers Auth, Postgres tables, row-level security, and future server functions with a simple zero-cost starting point.

Suggested first-release tables:

- `profiles`
  - `id uuid primary key references auth.users(id)`
  - `display_name text`
  - `created_at timestamptz`
  - `updated_at timestamptz`
- `player_collections`
  - `user_id uuid references auth.users(id)`
  - `card_id integer`
  - `count integer`
  - `updated_at timestamptz`
  - primary key `(user_id, card_id)`

Sync flow:

1. Guest collection loads from `localStorage`.
2. When the player logs in, fetch cloud collection.
3. Merge local and cloud collection by adding counts for each card.
4. Clamp merged counts only for capped rarities. EPIC and LR counts are not clamped.
5. Save merged collection locally and upsert it to Supabase.
6. After login, draws update local state immediately and sync cloud in the background.
7. If sync fails, keep play uninterrupted and retry later or on next login/session.

RLS policy should allow each authenticated user to read and write only their own collection rows.

Publication warning: because first-release draw logic remains client-side, it is good enough for a casual public prototype but not anti-cheat safe. Moving draw results to a backend API is a scheduled follow-up.

## Reveal Audio Bug

Root cause:

`flipAllCards()` schedules multiple `setTimeout` callbacks for card flips, new-card sounds, legendary sounds, legendary animation, and draw-again state. `closeOverlay()` currently hides the overlay but does not cancel those timers or stop active SFX, so queued callbacks continue after the UI is gone.

Fix design:

- Add `revealSessionId`.
- Add `revealTimers = new Set()`.
- Add `scheduleRevealTimer(callback, delay)` that stores timer IDs and checks the active session before running.
- Add `cancelRevealSequence()`:
  - increment `revealSessionId`;
  - clear every timer in `revealTimers`;
  - empty `revealTimers`;
  - stop reveal SFX keys: `cardFlip`, `cardFlipAll`, `newCard1Star` through `newCard7Star`, `legendary`, `packOpen`;
  - close/clear legendary animation if active;
  - restore flip button state safely.
- Call cancellation from `closeOverlay()`, redraw, page switch, and before opening a new pack.

`playSound()` should continue to reuse cached `Audio` objects, but add helpers:

- `stopSound(soundKey)`
- `stopSounds(soundKeys)`
- optionally `stopSoundsByPrefix(prefix)`

Stopping means `pause()` and `currentTime = 0`.

## Animation And Sound Direction

The first release should feel closer to a polished gacha game, but with controlled mobile cost.

Reveal flow:

1. Pack opens with a short tear and stage darkening.
2. Cards enter in a paced group reveal, not as a flat static grid.
3. A first-time card gets a small pause and a clear audio cue.
4. High rarity cards get stronger spotlight, rim glow, and slower timing.
5. Legendary cards trigger the full showcase overlay.
6. Closing or redrawing immediately cancels all pending reveal behavior.

Sound rules:

- Button, pack tear, pack open, flip all, single flip, new-card, and legendary sounds should not overlap uncontrollably.
- New-card sounds should be gated by reveal session state.
- Legendary BGM or SFX should stop or hand back to pack BGM when the legendary overlay is closed or the draw overlay is closed.
- Volume controls should apply consistently to cached audio.

Animation rules:

- Use transform and opacity as the default animation properties.
- Avoid stacking too many blur, filter, and drop-shadow animations at the same time.
- Particle count should be lower on mobile than desktop.
- Infinite animations should pause or be removed when their overlay is inactive.
- Respect `prefers-reduced-motion` by shortening or disabling reveal flourish animations while keeping the game usable.
- Avoid layout shifts in cards, buttons, counters, and overlay controls.

## Performance Design

Main risks in the current project are large media files, many GIFs/images, multiple infinite CSS animations, particle DOM creation, and expensive filters.

First release optimizations:

- Cancel timers and clear particles when overlays close.
- Lazy-load collection images as currently done.
- Preload only the current pack image and soon-to-be-displayed drawn card images.
- Keep card dimensions fixed with aspect ratios to avoid reflow.
- Reduce mobile particle counts for legendary overlay.
- Scope `will-change` only to elements that are about to animate, then remove it if practical.
- Use CSS classes to pause effects when overlays are inactive.
- Keep Vite build output static and deployable.

Optional later optimizations:

- Convert large GIFs to MP4/WebM or optimized animated WebP.
- Generate responsive image sizes.
- Move large assets to object storage/CDN.

## Error Handling

- If `localStorage` is unavailable, keep an in-memory collection and show a non-blocking warning.
- If Supabase is not configured, auth and sync UI should stay hidden or disabled; guest play must still work.
- If Supabase sync fails, preserve local progress and retry later.
- If a selected pack has no drawable cards after capped rarity filtering, disable open and show completed state.
- If a pack has no valid cards because of config errors, disable open and show a clear message.

## Verification

Functional checks:

- Opening a pack still draws the configured count.
- Closing the overlay during flip-all stops all reveal sounds.
- Closing the overlay before delayed new-card or legendary sound prevents those sounds.
- Redrawing cancels old timers before opening the next pack.
- Saturated capped cards do not appear in future draws.
- Effective probability UI updates when rarities become saturated.
- Completed packs cannot be opened.
- Guest play works without Supabase environment values.
- Login merge adds local and cloud counts, clamping only capped rarities.

Build and UI checks:

- `npm run build` passes.
- Mobile viewport renders without text overlap.
- Reveal overlay works on a phone-like viewport.
- Reduced motion mode remains usable.

## Follow-Up Schedule

Phase two:

- Backend-authoritative draw API using Supabase Edge Functions or a small API service.
- Draw logs for anti-cheat, debugging, and player history.
- Event card pools and remote card/pack configuration.
- Leaderboards after the base collection loop is stable.

Phase three:

- Full Vue component migration from legacy `js/app.js`.
- Asset pipeline optimization and CDN/object storage.
- More advanced progression systems.
