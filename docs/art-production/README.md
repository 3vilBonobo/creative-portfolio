# Athens Cyberpunk pre-production review

Revision v002, 25 November 2026. The structural corrections are implemented. The artwork specification is a proposal awaiting the decisions listed below. No replacement artwork has been generated or integrated.

The revised inventory contains 44 core exports and 27 recommended derivatives, totaling 71 baseline files. Twenty conditional exports are gated by lighting/depth proofs, for a maximum of 91. Most are registered derivatives rather than independently generated scenes. See the master specification for production estimates and the [package index](../../art-production/reference-packages/package-index.json) for measured delivery sizes. The six reference ZIPs total 18.75 MiB and contain 91 saved screenshots.

## Start here

1. Review [responsive compositions](responsive-compositions.md), especially the proposed Hero and Contact object moves.
2. Review [shared production standards](master-specification.md) and [inventory](asset-inventory.json).
3. Open the six independent [briefs](briefs/). Each reference ZIP contains its brief, proposed inventory, layout guides, screenshots, principal artwork and relevant masks.
4. Read [verification and changed files](verification.md) before treating a source-visible behavior as a tested result.

## Six conversations

| Conversation | Brief | Reference ZIP |
|---|---|---|
| Floor 04 Hero | [Hero](briefs/floor-04-hero.md) | [Reference package](../../art-production/reference-packages/floor-04-hero-reference-v002.zip) |
| Floor 03 About | [About](briefs/floor-03-about.md) | [Reference package](../../art-production/reference-packages/floor-03-about-reference-v002.zip) |
| Floor 02 Projects | [Projects](briefs/floor-02-projects.md) | [Reference package](../../art-production/reference-packages/floor-02-projects-reference-v002.zip) |
| Floor 01 Experience | [Experience](briefs/floor-01-experience.md) | [Reference package](../../art-production/reference-packages/floor-01-experience-reference-v002.zip) |
| Floor 00 Contact | [Contact](briefs/floor-00-contact.md) | [Reference package](../../art-production/reference-packages/floor-00-contact-reference-v002.zip) |
| Four transitions | [Infrastructure](briefs/transitions.md) | [Reference package](../../art-production/reference-packages/transitions-reference-v002.zip) |

## Approval decisions

- Hero profiles. Approve the square tablet and 3:4 portrait composite sketches and the documented object positions before producing those compositions. The current universal hero remains in the application.
- Hero depth. Approve four exterior planes, grouping the mountains with distant residential fabric while keeping the Acropolis separate.
- Contact. Approve a portrait 4:7 entrance composition shared with tablet portrait, or retain the current wide crop temporarily.
- Lighting. Complete one neutral-interior day/night lighting proof and one practical-light emission/spill proof. Decide whether authored interior night planes are needed.
- Golden hour. Compare controlled grading against an authored directional-light proof. Commission the conditional golden-hour family only if the proof requires it.

Required/recommended in the inventory describes the proposed production architecture after approval. It is not authorization to generate all files. The previous 49-file proposal is superseded by this draft and is not treated as approved.

## Organization

Existing design notes remain under `docs/`. New authoritative specifications extend that convention under `docs/art-production/`. Binary references, reference ZIPs and incoming artwork staging live under `art-production/`, outside `public/`. Existing production assets retain their current paths.

Reference archives are evidence for artwork conversations. Future production archives have a distinct `-production-` filename and are delivered into staging. No Git staging, commit, push or deployment is part of this work.
