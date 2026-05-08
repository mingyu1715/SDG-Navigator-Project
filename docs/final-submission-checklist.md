# Final Submission Checklist

Last updated: 2026-05-08

## Scope

This checklist is for final static review before project submission.

Included:

- Git and deployment state
- README and docs completeness
- JavaScript syntax checks
- CSS and HTML reference checks
- Vercel routing configuration
- SDG 1-17 detail registration and file coverage

Excluded unless explicitly requested:

- Browser visual verification
- In-app browser screenshots
- Poster HTML inspection
- Service QR and survey QR inspection

## Git and Deployment

| Check | Pass condition |
| --- | --- |
| Current branch | `main` |
| Working tree | `git status --short` has no tracked changes |
| Remote state | local `main` is pushed to `origin/main` |
| Latest commit | final docs/check changes are included |
| Deployment URL | README uses `https://sdgnavigator.vercel.app/` |

## Documentation

| File | Required state |
| --- | --- |
| `README.md` | Project purpose, run command, deployment URL, structure, data/source policy |
| `docs/sdg-data-source-audit.md` | SDG 1-17 source coverage and simulation/derived/official distinction |
| `docs/final-submission-checklist.md` | Final static review steps and exclusions |

## Static Syntax Checks

Run syntax checks on application JavaScript files:

```bash
find app -type f -name '*.js' -print
node --check path/to/file.js
```

Expected result:

- no JavaScript syntax errors
- no unresolved edited import paths found during static inspection
- no markdown whitespace errors from `git diff --check`

## Routing and Vercel

Required route behavior:

- Main app entry is `index.html`.
- SDG detail routes use `/detailed/sdg-01/` through `/detailed/sdg-17/`.
- `vercel.json` rewrites `/detailed/:path*` to `/index.html`.
- README explains that local `python3 -m http.server` can show 404 on direct detail refresh, while Vercel handles it through rewrite.

## SDG 1-17 File Coverage

Each goal should have:

- `app/details/sdgXXContent.js`
- `app/details/sdgXXContentModel.js`
- page style in `css/styles/pages/`
- registration in `app/details/registry.js`
- source or simulation basis where numeric values are shown

Special style cases:

- SDG1 uses `sdg01-base.css` and `sdg01-visual.css`.
- SDG2 uses the current SDG2 style set plus legacy/lite/rx styles where still imported.

## Data and Source Rules

Before marking final:

- Official values must have source name, source year/report basis when available, and URL.
- Derived values must state the conversion rule or assumption.
- Simulation values must not be presented as official statistics.
- New source metadata should be added to `app/data/sdgSourceRegistry.js`.
- Source audit changes should be mirrored in `docs/sdg-data-source-audit.md`.

## Final Commands

Recommended final command sequence:

```bash
git status --short
git diff --check
git log --oneline -3
```

If changes are made during the final pass:

```bash
git add <changed-files>
git commit -m "docs: complete final submission documentation"
git push origin main
git status --short
```
