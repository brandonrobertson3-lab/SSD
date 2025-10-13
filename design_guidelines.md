# Design Guidelines: SSD Business Management Suite

## Design Approach: Utility-First Design System

**Selected Approach:** Design System (Material Design + Linear-inspired)
**Justification:** This is a productivity-focused business management tool requiring efficient workflows, data clarity, and professional reliability. Drawing inspiration from Linear's clean interfaces and Material Design's proven patterns for data-dense applications.

**Core Principles:**
- Clarity over decoration - every element serves a functional purpose
- Scannable data layouts for quick decision-making
- Consistent patterns reduce cognitive load across modules
- Professional appearance builds trust for business operations

---

## Color Palette

**Light Mode (Primary):**
- Background: 0 0% 98%
- Surface: 0 0% 100%
- Surface Elevated: 0 0% 100% with subtle shadow
- Primary Brand: 220 75% 45% (professional blue for plumbing industry)
- Primary Hover: 220 75% 40%
- Text Primary: 220 15% 15%
- Text Secondary: 220 10% 50%
- Border: 220 15% 88%
- Success: 145 65% 45%
- Warning: 35 90% 55%
- Error: 0 75% 55%

**Dark Mode:**
- Background: 220 20% 8%
- Surface: 220 18% 12%
- Surface Elevated: 220 18% 15%
- Primary Brand: 220 75% 55%
- Primary Hover: 220 75% 60%
- Text Primary: 220 10% 95%
- Text Secondary: 220 10% 65%
- Border: 220 15% 22%

**Status Colors:**
- Scheduled: 200 80% 50%
- In-Progress: 35 90% 55%
- Completed: 145 65% 45%
- Cancelled: 0 5% 50%

---

## Typography

**Font Family:**
- Primary: 'Inter', system-ui, sans-serif (via Google Fonts)
- Monospace: 'JetBrains Mono' for numbers, prices, dates

**Scale:**
- Headings (Module Titles): text-2xl font-semibold
- Section Headers: text-lg font-medium
- Body Text: text-base font-normal
- Small Text (metadata): text-sm text-secondary
- Table Headers: text-sm font-medium uppercase tracking-wide
- Numbers/Prices: text-base font-mono

---

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16
- Card padding: p-6
- Section spacing: mb-8
- Input spacing: space-y-4
- Button padding: px-4 py-2
- Table cell padding: px-4 py-3

**Grid Structure:**
- Sidebar: 240px fixed width (collapsible to 60px icon-only)
- Main content: max-w-7xl mx-auto px-6
- Dashboard cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-4
- Forms: max-w-2xl for optimal readability
- Tables: full width with horizontal scroll on mobile

---

## Component Library

### Navigation
- **Sidebar:** Fixed left, dark background, icons + labels, active state with primary color accent bar
- **Module Icons:** 20px, stroke-width 2, consistent with lucide-react library
- **Mobile:** Hamburger menu, slide-out drawer

### Data Display
- **Dashboard Cards:** White/dark surface, rounded-lg, shadow-sm, p-6, icon top-left, metric large and bold
- **Tables:** Striped rows, hover states, sticky headers, alternating bg for row distinction
- **Status Badges:** Rounded-full px-3 py-1 text-xs with status-specific colors
- **Metrics:** Large font-mono numbers with labels beneath

### Forms & Inputs
- **Input Fields:** border rounded-md px-4 py-2 focus:ring-2 focus:ring-primary
- **Labels:** text-sm font-medium mb-1 above inputs
- **Buttons Primary:** bg-primary text-white rounded-md px-4 py-2 hover:bg-primary-hover
- **Buttons Secondary:** border border-primary text-primary rounded-md px-4 py-2
- **Modals:** Centered overlay, max-w-2xl, rounded-lg, p-6, backdrop blur

### Business-Specific Components
- **Invoice Preview:** A4 proportions, company header with logo placement area, line items table, subtotal/tax/total right-aligned
- **Contract View:** Professional document layout, signature areas, terms clearly sectioned
- **Time Cards:** Weekly view grid, daily entry rows, total hours calculation prominent
- **Tool Cards:** Image thumbnail left, details right, condition badge, assignment status

---

## Interactions & States

**Hover States:**
- Table rows: subtle background change
- Cards: slight elevation increase (shadow-md)
- Buttons: darken/lighten by 5%

**Loading States:**
- Skeleton screens for tables (pulse animation)
- Spinner for buttons during actions
- Progress bar for file uploads

**Empty States:**
- Centered icon (48px), helpful message, primary CTA to add first item

**Animations:**
- Minimal and purposeful only
- Modal enter/exit: fade + scale
- Sidebar toggle: width transition 200ms
- No decorative animations

---

## Module-Specific Layouts

**Dashboard:** 4-column metric cards at top, recent activity feed below, chart placeholders

**Customer/Job Lists:** Search bar top-right, table with action column (view/edit/delete icons), pagination bottom

**Invoice Creation:** Two-column form (client left, job details right), parts search with dropdown, line items dynamic table, preview button prominent

**Expense Tracker:** Filter by job dropdown, receipt thumbnail preview, running total visible

**Tool Crib:** Card grid view with image, tool details overlay on hover, filter by category/status

---

## Deployment Considerations

- Ensure all localStorage keys are prefixed consistently (ssd*)
- Print styles for invoices/contracts using @media print
- Mobile-first responsive breakpoints: sm:640px, md:768px, lg:1024px, xl:1280px
- Dark mode toggle in settings with system preference detection
- Offline-first capability with sync status indicator (already in code)