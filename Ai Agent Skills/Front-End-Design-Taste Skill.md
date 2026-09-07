# Frontend Design Taste & Quality Skill

## Purpose

This is a mandatory frontend design-quality skill.

The agent MUST use this skill whenever working on **any user-facing frontend work**.

The goal is to ensure that the frontend does not become generic, visually weak, inconsistent, or obviously AI-generated.

The agent should aim for a **premium, polished, intentional, modern interface** by default.

The default design level is:

> **Premium**

The agent may move toward:

> **Experimental**

when the product, page, brand, audience, or specific section genuinely benefits from a more expressive design direction.

Do not add visual complexity merely to make something look impressive.

---

# Core Design Philosophy

The agent must think like a frontend engineer **and** a product designer.

Do not treat frontend work as:

```text
Requirements → Components → CSS → Done
```

Instead, think:

```text
Purpose
    ↓
User
    ↓
Information hierarchy
    ↓
Visual hierarchy
    ↓
Layout
    ↓
Interaction
    ↓
Motion
    ↓
Polish
    ↓
Accessibility
    ↓
Responsive behavior
```

Every visible element should have a reason to exist.

---

# Design Taste References

The following websites are the primary external references for frontend design taste.

They are NOT templates to copy.

They are references for understanding:

* visual quality
* composition
* interaction
* hierarchy
* motion
* spacing
* typography
* component design
* polish
* modern frontend conventions

The agent should study the **design decisions** behind these references and adapt the principles to the project's own visual identity.

---

# 1. 21st.dev — Component Craftsmanship

Reference:

https://21st.dev/

21st.dev is a large community catalog of crafted React/Tailwind components, sections, templates, themes, animated interfaces, heroes, dashboards, cards, forms, navigation, and other UI patterns. It contains both restrained components and highly expressive examples.

## What to learn from 21st.dev

Use it primarily as a reference for:

* Component craftsmanship
* Modern UI composition
* Button design
* Card design
* Form design
* Navigation
* Dashboards
* Empty states
* Hero sections
* Marketing sections
* Interactive components
* Component proportions
* Visual hierarchy
* Modern interaction patterns

Study how individual components are made to feel intentional rather than generic.

## Important principle

Do NOT blindly copy a component.

Instead ask:

> "What makes this component feel premium?"

Possible answers include:

* spacing
* proportions
* typography
* contrast
* interaction
* motion
* layering
* depth
* visual feedback
* composition

Then apply the underlying principle to the project's design system.

---

# 2. Refero Styles — Design-System Taste

Reference:

https://styles.refero.design/

Refero Styles provides AI-readable design systems derived from real product websites, including typography, colors, spacing, component patterns, and DESIGN.md references. It is especially useful as a source of real-world design decisions rather than generic AI-generated aesthetics.

## What to learn from Refero

Use it primarily as a reference for:

* Typography systems
* Color systems
* Spacing systems
* Component consistency
* Visual hierarchy
* Border treatment
* Radius systems
* Shadows
* Density
* Product personality
* Design-system consistency

When designing a substantial new page or feature, Refero can be used to investigate real products with a visual direction appropriate to the project.

## Important principle

Do not randomly combine design styles.

A good interface should feel like it belongs to **one coherent design system**.

Avoid situations such as:

```text
Apple-style typography
+
Linear-style dark UI
+
Glassmorphism cards
+
Dribbble gradients
+
Random 3D objects
+
Material Design buttons
```

unless there is a deliberate design reason for doing so.

---

# 3. Supahero — Hero & First-Impression Design

Reference:

https://supahero.io/

Supahero is a curated library of website hero sections and is primarily useful for studying how modern websites create strong first impressions.

## What to learn from Supahero

Use it primarily for:

* Hero composition
* First-screen hierarchy
* Headline scale
* CTA placement
* Visual storytelling
* Image composition
* 3D/graphic integration
* Whitespace
* Background treatment
* Section transitions
* Strong visual openings

When designing a landing page or marketing-oriented page, do not automatically produce:

```text
Centered heading
Paragraph
Two buttons
Gradient blob
```

That is the default AI landing-page pattern.

Instead consider:

* asymmetrical composition
* strong typography
* product imagery
* editorial layouts
* visual anchors
* layered elements
* controlled whitespace
* interactive elements
* distinctive backgrounds
* meaningful motion

The design should communicate the product before the user reads every word.

---

# 4. Motion — Motion Engineering & Interaction

Reference:

https://motion.dev/

Motion is a production-oriented animation library for React and JavaScript supporting transitions, layout animation, gestures, scroll animation, springs, and other interaction primitives. It emphasizes smooth, performant interface animation.

## What to learn from Motion

Use it as the primary reference for:

* Animation quality
* Easing
* Springs
* Enter/exit transitions
* Layout transitions
* Gesture interactions
* Hover interactions
* Press interactions
* Scroll-triggered animation
* Scroll-linked animation
* Shared-element transitions
* Staggering
* Reduced-motion support

## Motion principle

Animation should have a purpose.

Good reasons for motion:

* Explain a state change
* Provide feedback
* Establish spatial relationships
* Guide attention
* Make navigation feel continuous
* Communicate hierarchy
* Improve perceived responsiveness
* Add personality where appropriate

Bad reason:

> "The page looked empty."

Do not add animation simply because an animation library is available.

---

# 5. 60fps.design — Micro-Interaction Taste

Reference:

https://60fps.design/

60fps.design is a collection of UI/UX interaction examples from real products, including interactions involving tabs, swipes, typing, toasts, tooltips, spring physics, success states, text effects, and other micro-interactions.

## What to learn from 60fps.design

Use it primarily for:

* Micro-interactions
* Interaction feedback
* Gesture behavior
* State transitions
* Spring physics
* Success states
* Loading interactions
* Toasts
* Tabs
* Swipes
* Hover behavior
* Tap feedback
* Text transitions
* Small details that make interfaces feel alive

The important lesson is:

> Premium interfaces are often differentiated by hundreds of small interaction decisions rather than one giant animation.

---

# Reference Hierarchy

When deciding what to reference, use this mental model:

```text
Refero
↓
Overall visual language
Design system
Typography
Spacing
Colors
Components
        ↓
21st.dev
↓
Component craftsmanship
UI patterns
Component composition
        ↓
Supahero
↓
Hero / landing composition
First impression
        ↓
Motion
↓
Animation implementation
Transitions
Gestures
Layout motion
        ↓
60fps
↓
Micro-interactions
Feedback
Interaction details
```

These references complement each other.

They should not be treated as competing design systems.

---

# Default Design Level: Premium

The default design goal is:

> Professional + modern + polished + intentional + distinctive

The interface should feel like it was designed by a competent product/design team.

It should NOT feel like:

* default Bootstrap
* untouched shadcn
* generic Tailwind
* template marketplace UI
* "AI-generated dashboard"
* random Dribbble imitation
* excessive glassmorphism
* excessive gradients
* excessive rounded cards
* excessive animation

---

# Experimental Mode

The agent MAY use a more experimental design direction when it genuinely improves the product.

Experimental design may include:

* Unusual layouts
* Advanced motion
* 3D
* WebGL
* Shaders
* Dramatic typography
* Strong visual transitions
* Interactive backgrounds
* Scroll-driven storytelling
* Unconventional navigation
* Large editorial compositions
* Creative interaction patterns

However:

## Experimental does NOT mean chaotic.

Experimental design must still preserve:

* usability
* hierarchy
* accessibility
* responsiveness
* performance
* readability
* consistency
* product purpose

Ask:

> "Does this make the product better?"

If the answer is no, don't add it.

---

# Design Before Implementation

Before implementing a substantial user-facing feature, think through:

## 1. Purpose

What is the user trying to accomplish?

## 2. Priority

What is the most important information or action?

## 3. Hierarchy

What should the user notice first, second, and third?

## 4. Layout

How should the information be arranged?

## 5. Visual language

What design direction fits the existing product?

## 6. Interaction

What should happen when the user:

* clicks
* hovers
* focuses
* submits
* waits
* succeeds
* fails
* navigates
* scrolls

## 7. Motion

Where does animation improve understanding or feedback?

## 8. Responsive behavior

How does the design transform across:

* desktop
* tablet
* mobile

Do not simply shrink the desktop design.

---

# Browse References When Appropriate

The agent SHOULD browse the reference websites when working on substantial design tasks.

Examples:

* New page
* Major redesign
* New dashboard
* New landing page
* Major navigation redesign
* New design system
* Major component family
* New onboarding flow
* New hero section
* Significant interaction redesign

The agent does NOT need to browse the references for tiny changes such as:

* Fixing spacing by a few pixels
* Changing text
* Fixing a typo
* Small bug fixes
* Minor responsive fixes
* Small accessibility fixes
* Changing an existing component's label

The goal is:

```text
Substantial design task → Browse references

Tiny change → Use existing design language
```

---

# Reference Selection

When browsing references, do not simply search randomly.

Identify what needs inspiration.

Examples:

```text
Need a hero
→ Supahero
→ 21st.dev

Need a dashboard
→ Refero
→ 21st.dev

Need micro-interaction
→ 60fps.design
→ Motion

Need animation
→ Motion
→ 60fps.design

Need overall visual direction
→ Refero

Need component inspiration
→ 21st.dev
```

---

# Existing Design System Comes First

If the project already has an established design system, preserve it.

Before introducing a new visual pattern, inspect:

* Existing colors
* Typography
* Spacing
* Border radius
* Shadows
* Components
* Buttons
* Inputs
* Cards
* Navigation
* Motion
* Responsive behavior

New work should feel like it belongs to the same product.

Do not redesign the entire application merely because a reference website looks better.

---

# Avoid Visual Inconsistency

Do not introduce a component that looks completely unrelated to the rest of the application.

For example, if the application uses:

```text
8px radius
subtle borders
medium shadows
compact spacing
```

do not suddenly introduce:

```text
32px radius
huge shadows
glassmorphism
floating gradients
```

unless the design direction is intentionally being changed.

---

# Typography

Typography is one of the strongest contributors to perceived quality.

Pay attention to:

* Font family
* Font weight
* Font size
* Line height
* Letter spacing
* Heading hierarchy
* Paragraph width
* Text density
* Contrast

Avoid using huge headings everywhere.

Typography should communicate hierarchy, not merely consume space.

---

# Spacing

Use intentional spacing.

Avoid:

```text
Random padding
Random margins
Random gaps
```

Prefer a consistent spacing rhythm.

Spacing should establish relationships:

```text
Heading
  ↓ small gap
Supporting text
  ↓ medium gap
Primary action
```

rather than treating every element independently.

---

# Color

Use color intentionally.

Color can communicate:

* hierarchy
* state
* importance
* brand
* interaction
* warnings
* success
* errors

Do not use gradients, neon colors, or accent colors simply because they look modern.

A restrained palette with excellent typography and spacing often looks more premium than a visually noisy palette.

---

# Cards

Do not put everything inside a card.

Avoid the common AI pattern:

```text
Card
 ├── Card
 ├── Card
 ├── Card
 └── Card
```

Use containers only when they communicate grouping, hierarchy, separation, or interaction.

Sometimes whitespace is better than another card.

---

# Buttons

Buttons should communicate priority.

Maintain clear hierarchy between:

* Primary action
* Secondary action
* Tertiary action
* Destructive action

Do not make every action visually dominant.

---

# Forms

Forms should prioritize clarity and speed.

Consider:

* field grouping
* labels
* helper text
* validation
* error feedback
* loading state
* success state
* keyboard navigation
* focus states
* mobile usability

Do not optimize a form purely for appearance.

---

# Loading / Empty / Error / Success States

A polished frontend must design all important states.

Do not design only the "happy path."

Consider:

```text
Loading
↓
Loaded
↓
Empty
↓
Error
↓
Success
```

These states should feel like part of the same product.

---

# Micro-Interactions

Look for opportunities to improve:

* hover
* focus
* press
* selection
* expansion
* collapse
* navigation
* loading
* success
* deletion
* confirmation
* drag
* scroll

But maintain restraint.

A good rule:

> If the user notices the animation more than the action, it may be too much.

---

# Motion Quality Rules

When implementing motion:

* Prefer smooth transitions
* Use appropriate easing
* Use springs when physical behavior makes sense
* Avoid unnecessary delays
* Avoid excessive bounce
* Avoid animation that blocks interaction
* Respect reduced-motion preferences
* Keep interactions responsive
* Consider mobile performance
* Avoid animating expensive properties unnecessarily

For simple effects, CSS transitions may be preferable.

Use Motion when its capabilities genuinely improve the interaction. Motion itself recommends CSS for simple self-contained effects and provides more advanced primitives for layout, gestures, scroll, and complex animation.

---

# Performance

Premium design must not come at the cost of a poor experience.

Be careful with:

* excessive JavaScript animation
* large images
* WebGL
* shaders
* video backgrounds
* expensive blur effects
* huge DOM trees
* excessive motion
* unnecessary re-renders

Always ask:

> "Does the visual improvement justify the performance cost?"

---

# Accessibility

Visual quality never overrides accessibility.

Maintain:

* keyboard accessibility
* visible focus states
* readable contrast
* semantic HTML
* accessible labels
* reduced-motion support
* usable touch targets
* screen-reader compatibility

Do not hide important information behind animation.

---

# Responsive Design

Every user-facing design must work across screen sizes.

Consider:

```text
Desktop
Tablet
Mobile
```

Responsive design should sometimes change:

* layout
* hierarchy
* navigation
* spacing
* typography
* interaction model

Do not simply make everything smaller.

---

# Arabic / RTL Considerations

For Arabic and RTL applications, design taste must still respect the language direction.

Pay attention to:

* RTL layout
* text alignment
* icon direction
* navigation direction
* spacing
* numeric content
* mixed Arabic/English content
* Arabic typography
* mobile layouts

Do not mechanically mirror every icon.

Some icons represent concepts rather than directional movement and should remain unchanged.

---

# Reuse Before Reinventing

Before creating a new component:

1. Search the existing component system.
2. Determine whether an existing component can be reused.
3. Extend an existing component when appropriate.
4. Create a new component only when it represents genuinely new behavior or visual structure.

Do not create:

```text
Card.tsx
CardNew.tsx
PremiumCard.tsx
ModernCard.tsx
CardV2.tsx
```

when one well-designed reusable component can solve the problem.

---

# Do Not Destroy Existing Design Language

When improving one section:

Do NOT automatically redesign unrelated sections.

Do not:

* replace the whole color system
* change typography globally
* rewrite components unnecessarily
* introduce a new design framework
* replace working UI patterns

unless the task explicitly requires a broader redesign.

---

# Design Review Before Completion

Before declaring a frontend task complete, review the result as a designer.

Ask:

### Hierarchy

* Is the most important thing visually obvious?
* Is the page easy to scan?

### Composition

* Does the layout feel balanced?
* Is whitespace intentional?

### Typography

* Is the type hierarchy clear?
* Are text widths comfortable?

### Components

* Do components feel cohesive?
* Are there unnecessary containers?

### Interaction

* Does the UI communicate state changes?
* Are important interactions obvious?

### Motion

* Does motion improve the experience?
* Is anything animated unnecessarily?

### Responsiveness

* Does it work properly on mobile?
* Does the layout adapt rather than merely shrink?

### Accessibility

* Can the interface be used with keyboard and assistive technology?
* Are focus and contrast adequate?

### Polish

* Does anything look unfinished?
* Are there awkward alignments?
* Are spacing values inconsistent?
* Are icons visually inconsistent?
* Are hover/focus/pressed states missing?

---

# Anti-Patterns

Avoid these unless explicitly justified:

## Generic AI Landing Page

```text
Huge gradient heading
+
Subtitle
+
Two pill buttons
+
Three floating glass cards
+
Random blobs
```

## Everything Is Rounded

Not every element needs:

```text
rounded-full
```

or enormous corner radii.

## Everything Is a Card

Containers should have semantic purpose.

## Everything Is Animated

Motion should communicate something.

## Gradient Addiction

Gradients should support the design rather than become the design.

## Excessive Glassmorphism

Blur + transparency + glow is not automatically premium.

## Excessive Shadows

Depth should be intentional.

## Decorative Noise

Do not add:

* random blobs
* random particles
* random floating objects
* random 3D elements
* random grid backgrounds

without a design reason.

---

# Design Decision Rule

When choosing between a safe implementation and a more visually interesting one:

Prefer the more interesting implementation **when**:

* it improves hierarchy
* it improves usability
* it improves product personality
* it improves interaction
* it fits the existing design system
* it does not significantly harm performance
* it does not compromise accessibility

Otherwise choose the simpler implementation.

---

# Required Frontend Completion Report

After completing substantial frontend work, the agent should include:

```text
## Frontend Design Review

### Design Direction
Describe the visual direction chosen.

### Reference Inspiration
List which reference(s) influenced the work and why.

### Visual Hierarchy
Explain the primary hierarchy decisions.

### Interaction & Motion
Explain important interactions and animations.

### Responsive Design
Explain important responsive decisions.

### Accessibility
Explain important accessibility considerations.

### Reusability
Explain which existing components/design patterns were reused.

### Polish
List the main visual polish improvements.

### Design Trade-offs
Mention any intentional compromises.

### Final Assessment
PREMIUM / PREMIUM WITH EXPERIMENTAL ELEMENTS / NEEDS POLISH
```

For small frontend changes, this report may be shortened.

---

# Final Principle

The objective is not to make every screen flashy.

The objective is to make every screen feel:

> **Intentional.**

The agent should continuously ask:

```text
Why is this here?
Why does it look like this?
Why is it positioned here?
Why does it animate?
Why does it have this color?
Why does it have this spacing?
Why does this interaction behave this way?
```

If there is no good answer, reconsider the design.

The final result should feel like a product designed by people with strong frontend and product-design taste — not a collection of technically correct components assembled by an AI.
