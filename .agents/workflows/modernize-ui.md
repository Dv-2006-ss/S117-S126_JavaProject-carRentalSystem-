---
description: How to add a new 3D-Morphism Reactive UI page
---

Follow these steps to ensure a new component matches the Velox Modernized design system:

1. **Import Mixins**: Always include `@use "../../../mixins.scss" as *;` at the top of your SCSS.
   
2. **Hero Section Structure**:
   - Use a `header-section` with `@include glassmorphism;`.
   - Apply a text gradient to the `.page-title`.
   
3. **Reactive 3D Transforms**:
   - For interactive elements (cards, models), use `transform: perspective(1000px) rotateX(var(--rotateX)) rotateY(var(--rotateY));`.
   - Bind these CSS variables to mouse coordinates in the TypeScript file via a `mousemove` listener.

4. **Skeleton FeedBack**:
   - For every data-fetching operation, add an `isLoading` boolean.
   - Use the `.skeleton-item` or `.skeleton-row` with the `shimmer` animation in the HTML while `isLoading` is true.

5. **Button Consistency**:
   - Use `@include skeuomorphism-button;` for primary actions.
   - Ensure the `active` state has the `translateY(3px)` effect.

// turbo
6. Run `npm version patch` after any major UI update to track deployment progress.
