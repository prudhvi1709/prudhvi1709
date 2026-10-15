# Profile visual direction

## Accepted content and current proposal

Prudhvi Krovvidi's GitHub profile README. Preserve Agents Toolkit, Talks,
Dailynews, VideoAlert and Jailbreak as the selected work. Preserve the navy,
ivory, orange and cobalt visual palette and the illustrated project panels.

The owner liked the personal point-cloud reveal and confirmed it can remain the
opening visual. The work-related headline "From messy data to useful tools" did
not fit its personal subjects, so it is replaced with "A little more about me."
The owner also asked for visuals in the other sections, using SVG rather than
JPG or PNG assets. This revision is a review-ready proposal.

Confirmed personal details: KTM Duke 390; used to do powerlifting; prefers black
coffee. The public copy describes powerlifting as background, not current
training. The motorcycle silhouette is an abstract Duke-inspired motif, not a
model-accurate drawing or an official logo.

## Composition and behavior

- Opening: scattered dots gather into a sphere, reveal a motorcycle, barbell and
  coffee cup, then resolve into the owner's name. The 4.8-second reveal repeats in a 10-second cycle, holding the finished name
  between reveals. A native show/hide control can hide the looping graphic.
  The caption is personal throughout; it does not imply a work pipeline.
- Work: linked, illustrated SVG panels for Agents Toolkit, Talks and Dailynews.
- Each project has an expandable SVG walkthrough with four stages:
  - Agents Toolkit: context, plan, build, verify. Representative workflow.
  - Talks: question, demo, discuss, share. Illustrative session.
  - Dailynews: collect, rank, summarize, deliver. Publishing workflow.
- Walkthrough images use lazy loading inside closed details elements, so their
  animations start when opened. Opening the same section again does not promise
  a replay; it retains the completed overview once loaded.
- All walkthroughs finish within 4.6 seconds and settle into readable diagrams.
- Both hero and walkthroughs have dedicated mobile and reduced-motion assets.
- No JPG/PNG, scripts, external fonts or remote image services in the README.
- Normal text and links retain GitHub's native theme colors.

Primary action: https://prudhvi1709.github.io/.
Secondary actions: project panels, LinkedIn and email.

## Sources and their contribution

- Existing profile README and user feedback in this session govern scope.
- https://github.com/andriidrok1/andriidrok1 : animated ASCII identity and
  self-hosted SVGs; inspiration for identity as a reveal.
- https://github.com/Platane/Platane : contribution-grid snake; inspiration for
  a small visual narrative. No contribution data or snake source used here.
- https://github.com/timburgan/timburgan : community chess; a distinct model of
  participation using issue links and workflows. No game added here.
- https://designeer.xyz/llms-full.txt and https://supahero.io/ : discovery for
  headline and hero hierarchy; no assets, branding or component code copied.
- https://motion.dev/docs/stagger : sequencing guidance consulted through the
  official Motion MCP. Native SVG/CSS/SMIL deliver the animation as an image.
- https://developer.mozilla.org/en-US/docs/Web/SVG/Guides/SVG_as_an_image :
  image-context restrictions. No external resources or scripts in SVGs.
- Ryan's MIT Anatomy kit, vendored under scripts/vendor with its license:
  used for the agent-tool cartridge illustration.

The particle generator and workflow diagrams are original. Decorative points
and stage numbers do not represent contribution counts or measured metrics.

## Tokens

Navy #101b2a; ivory #f4f0e8; supporting text #bac6d5; orange #ff945a;
blue #2455cb; cream #f2eee5; dark type #182337; secondary type #485568;
light-blue particle accent #81b4ff. Workflow surfaces #19283c, with dark text
#101b2a on the accent-colored stage counters.

System Arial/Helvetica and system monospace. No third-party brand logos.

## Build and review

Run `node scripts/build-profile.mjs`, `node scripts/build-particles.mjs`, and
`node scripts/build-workflows.mjs`. No package installation is needed.

Iteration budget: one layout/copy correction, then fix observed render defects.
Review desktop, tablet and phone layouts; inspect first, middle and final motion
frames; check reduced motion, loading, links, contrast and overflow.

Exact published GitHub rendering remains unverified until the owner pushes.
The earlier raster workshop proposal is archived locally under the ignored
.preview directory; it is not part of the current README.


## Illustrated-panel motion

Agents Toolkit modules separate vertically and settle back into place. The talk
screen brightens and its lines draw in. Dailynews pages feed into a stack and
the RSS arcs draw in. These are illustrative metaphors; no measured activity
is implied. Panels animate once for at most 4.8 seconds, then remain still.
All panel animation is disabled by the internal reduced-motion media query.
