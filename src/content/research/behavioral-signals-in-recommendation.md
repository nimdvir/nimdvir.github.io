---
title: 'Behavioral Signals in Recommendation Systems'
year: '2024'
tags: ['Behavior', 'Recommenders']
summary: 'Studying how dwell, re-reads, and dissent shape recommender outputs, and how to make these signals inspectable.'
image: 'url(/images/thumb-engagement.jpg)'
---

Recommendation systems take dozens of signals beyond clicks. We studied which signals correlate with quality and how to expose them to users and editors.

## Study setup

- Mixed methods: log analysis across news and learning apps, plus user interviews.
- Signals tracked: dwell time, scroll stability, re-reads, saves, respectful dissent, and cross-faction replies.
- Comparison across topics with high disagreement (civics) vs low disagreement (hobbies).

## Findings

- Re-reads and cross-faction replies predicted constructive outcomes better than raw clicks.
- Dwell alone was noisy; weighting by scroll stability and active input improved signal quality.
- Respectful dissent comments reduced echo chambers and led to more saves by opposing groups.

## Design implications

- Expose a simple "Why this?" showing which signals contributed to a recommendation.
- Let users suppress certain signals (e.g., doomscroll time) from influencing their feed.
- Give editors diagnostics: which signals are over-weighted for a topic, and why.

## Prototype

We built an inspector panel that lists signals with weights, a toggle to exclude signals, and a preview of how recommendations change. Participants reported greater trust and adjusted their preferences more deliberately.
