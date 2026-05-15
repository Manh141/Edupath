# EduPath Admin UI v2.0

## Added
- `app/admin/layout.tsx`
- `app/admin/page.tsx`
- `app/admin/overview/page.tsx`
- `app/admin/users/page.tsx`
- `app/admin/courses/page.tsx`
- `app/admin/orders/page.tsx`
- `app/admin/reports/page.tsx`
- `app/admin/rbac/page.tsx`
- `components/admin/*`

## Updated
- `app/globals.css` - updated the palette and fonts to Inter / Montserrat, and added utilities for the admin surface
- `components/ui/button.tsx` - added production SaaS styling and the `cta` variant
- `components/layout/AppShell.tsx` - hides the public header/footer on `/admin/*` routes
- `tsconfig.json` - changed `ignoreDeprecations` from `6.0` to `5.0`

## Palette
- Brand / heading: `#1B263B`
- Background: `#F8F9FA`
- Body text: `#415A77`
- CTA: `#F77F00`

## Fonts
- Heading: Montserrat
- Body: Inter

## New Admin Routes
- `/admin/overview`
- `/admin/users`
- `/admin/courses`
- `/admin/orders`
- `/admin/reports`
- `/admin/rbac`

## Notes
This is a production-style UI scaffold. It is not yet wired to real backend mutations or queries. You can map it directly to the API gateway or to a dedicated admin service later.
