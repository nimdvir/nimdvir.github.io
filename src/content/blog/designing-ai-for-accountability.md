---
title: 'Designing AI for Accountability'
date: 'Jan 12, 2025'
tags: ['AI', 'Ethics', 'UX']
summary: 'Interaction patterns that make AI decisions legible, answerable, and appealable.'
image: 'url(/images/thumb-nasher.jpg)'
category: 'research'
---

Accountability is the promise that an AI system can be inspected, questioned, and corrected. It is not a single feature -- it is the choreography of affordances that help people see how an answer was produced and what they can do about it.

## Three layers of legibility

- **Surface cues:** confidence, input highlights, provenance badges, and model state (offline, fine-tuned, zero-shot) give an immediate signal of reliability.
- **Rationale access:** short "why" summaries linked to full traces, cited sources, and model chain steps. Avoid opaque "because model said so."
- **Counterfactuals:** show how small input changes alter outputs. This helps users distinguish model bias from data gaps.

## Patterns that work in practice

1. **Progressive disclosure for evidence.** Start with a one-line rationale and a clear "show steps" affordance; keep full traces and logs one click away.
2. **Appeal flows.** Pair every high-stakes output with "Request review" and "Report harm" entry points that capture context, inputs, and downstream impact.
3. **Source fidelity.** Inline citations that scroll to snippets, not just domains. Mark hallucination risk when citations are weak or absent.
4. **Decision checkpoints.** When AI drafts actionable changes (policy, legal, or financial), require a human confirmation step with named accountability.
5. **Retention transparency.** Show how conversations are logged, for how long, and whether they feed model fine-tuning; offer per-session opt-outs.

## What "good" looks like

In pilots with public-service teams, trust rose when people could open the "stack trace" of a response: the retrieved sources, the prompt template, and the model parameters. They also needed a fast path to human review when something felt off. The winning pattern: a compact "Why this?" row under each answer, with expandable evidence and a single-click "Escalate to human" that routes the full context.

## Design checklist

- Every critical answer has an adjacent "why" and "appeal" affordance.
- Evidence shows source snippets, not just titles.
- Counterfactuals or alternative answers are one click away.
- Audit logs are exportable for compliance teams.
- Users can suppress data reuse per session.

AI will always contain some uncertainty. Accountability design accepts that reality and builds pathways for people to see, question, and change the system when it misfires.
