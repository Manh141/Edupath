# EduPath Admin UI v2.0

## Đã thêm
- `app/admin/layout.tsx`
- `app/admin/page.tsx`
- `app/admin/overview/page.tsx`
- `app/admin/users/page.tsx`
- `app/admin/courses/page.tsx`
- `app/admin/orders/page.tsx`
- `app/admin/reports/page.tsx`
- `app/admin/rbac/page.tsx`
- `components/admin/*`

## Đã chỉnh
- `app/globals.css` — đổi palette + font sang Inter / Montserrat, thêm utility cho admin surface
- `components/ui/button.tsx` — thêm style production SaaS + variant `cta`
- `components/layout/AppShell.tsx` — ẩn header/footer public ở route `/admin/*`
- `tsconfig.json` — đổi `ignoreDeprecations` từ `6.0` sang `5.0`

## Palette
- Brand / heading: `#1B263B`
- Background: `#F8F9FA`
- Body text: `#415A77`
- CTA: `#F77F00`

## Font
- Heading: Montserrat
- Body: Inter

## Route admin mới
- `/admin/overview`
- `/admin/users`
- `/admin/courses`
- `/admin/orders`
- `/admin/reports`
- `/admin/rbac`

## Lưu ý
Đây là UI scaffold production-style, chưa nối mutation/query thật với backend. Bạn có thể map trực tiếp vào API gateway hoặc service admin riêng sau.
