# Nairobi Spaces — Frontend CLAUDE.md
# This file is read by Claude at the start of every session on the frontend project.
# It is the single source of truth for how Claude should assist on the Next.js frontend.
# Owner: Mogoa Labs | Engineer: Caleb Mogoa | Counterpart: CLAUDE.md (backend)

---

## 1. PROJECT OVERVIEW

**Nairobi Spaces** is a short-stay accommodation agent platform. The frontend is a **Next.js 14 App Router** web application that serves four separate user portals, each with its own authentication, routing, and UI.

The frontend consumes the Go API at `https://api.nairobispaces.co.ke/v1` (production) or `http://localhost:8080/v1` (local dev).

**Current phase:** Phase 1 — Foundation & Auth portals
**Launch target:** 20 October 2026
**Repo:** `github.com/Mogoa-Labs/nairobi-spaces` (monorepo — frontend lives in `/frontend/`)

---

## 2. ENGINEER CONTEXT

- **Name:** Caleb Mogoa — junior engineer learning Go and full-stack development hands-on.
- **Background:** Strong on observability (Datadog, Dynatrace). Learning React, Next.js, and TypeScript.
- **Learning goal:** Understand every line of code. Do NOT write code Caleb hasn't asked for.
- **Approach:** Teach-as-you-build. Explain the WHY before showing code.

---

## 3. TECH STACK

```
Next.js 14       App Router (not Pages Router — never use pages/)
TypeScript 5     Strict mode — no any, no implicit any
Tailwind CSS     Utility-first styling
shadcn/ui        Radix UI primitives — accessible by default
Zustand          Client-side state (auth token, UI state)
React Query      Server state — all API calls
NextAuth.js v5   Authentication — 4 credential providers + Google OAuth2
React Hook Form  All forms — no uncontrolled inputs
Zod              Schema validation — client-side mirrors server rules
Leaflet          Interactive maps (listing location picker + display)
Recharts         Revenue charts in admin/host portals
```

**Dev tooling:**
```
npm run dev      next dev — hot reload on :3000
npm run build    next build — production build (must succeed before PR)
npm run lint     eslint + prettier — must be clean before PR
npm run type-check  tsc --noEmit — strict TypeScript check
```

---

## 4. FOUR PORTALS — ROUTING STRUCTURE

Each portal is a completely separate route group with its own layout, navbar, and auth provider. A user logged into one portal cannot access another portal's pages.

```
frontend/app/
├── (guest)/                     ← /  Guest portal
│   ├── layout.tsx               ← GuestLayout (navbar + footer)
│   ├── page.tsx                 ← /  Explore / home
│   ├── listings/
│   │   ├── page.tsx             ← /listings  (SSR browse)
│   │   └── [id]/
│   │       └── page.tsx         ← /listings/[id]  (detail + map + rules)
│   ├── bookings/
│   │   ├── page.tsx             ← /bookings  (my bookings list)
│   │   └── [id]/
│   │       └── page.tsx         ← /bookings/[id]  (detail + check-in info)
│   ├── requests/
│   │   └── page.tsx             ← /requests  (my requests list)
│   ├── wishlist/
│   │   └── page.tsx             ← /wishlist
│   ├── profile/
│   │   └── page.tsx             ← /profile  (account settings, support phone)
│   └── kyc/
│       └── page.tsx             ← /kyc  (KYC upload flow)
│
├── (guest)/login/               ← /login  Guest login
├── (guest)/register/            ← /register  Guest registration
│
├── host/                        ← /host/*  Host portal
│   ├── layout.tsx               ← HostLayout (host sidebar nav)
│   ├── login/
│   │   └── page.tsx             ← /host/login
│   ├── dashboard/
│   │   └── page.tsx             ← /host/dashboard
│   ├── listings/
│   │   ├── page.tsx             ← /host/listings  (my listings)
│   │   ├── new/
│   │   │   └── page.tsx         ← /host/listings/new  (7-step wizard)
│   │   └── [id]/
│   │       ├── page.tsx         ← /host/listings/[id]  (edit)
│   │       └── calendar/
│   │           └── page.tsx     ← /host/listings/[id]/calendar  (v2.2)
│   ├── bookings/
│   │   └── page.tsx             ← /host/bookings
│   ├── calendar/
│   │   └── page.tsx             ← /host/calendar  (all properties view)
│   ├── payouts/
│   │   └── page.tsx             ← /host/payouts
│   ├── revenue/
│   │   └── page.tsx             ← /host/revenue  (recharts graphs)
│   └── profile/
│       └── page.tsx             ← /host/profile
│
├── ops/                         ← /ops/*  Ops team portal
│   ├── layout.tsx               ← OpsLayout
│   ├── login/
│   │   └── page.tsx             ← /ops/login
│   ├── set-password/
│   │   └── page.tsx             ← /ops/set-password  (forced first-login)
│   ├── requests/
│   │   └── page.tsx             ← /ops/requests  (pending queue + countdown)
│   ├── bookings/
│   │   └── page.tsx             ← /ops/bookings  (4 views: checkins/checkouts/upcoming/all)
│   ├── kyc/
│   │   └── page.tsx             ← /ops/kyc  (pending KYC review)
│   ├── listings/
│   │   └── page.tsx             ← /ops/listings  (all listings)
│   └── users/
│       └── page.tsx             ← /ops/users
│
└── admin/                       ← /admin/*  Admin portal
    ├── layout.tsx               ← AdminLayout
    ├── login/
    │   └── page.tsx             ← /admin/login
    ├── dashboard/
    │   └── page.tsx             ← /admin/dashboard  (revenue overview)
    ├── listings/
    │   └── pending/
    │       └── page.tsx         ← /admin/listings/pending  (review queue)
    ├── ops-team/
    │   └── page.tsx             ← /admin/ops-team  (add/deactivate members)
    ├── hosts/
    │   └── page.tsx             ← /admin/hosts  (verify hosts)
    ├── payouts/
    │   └── page.tsx             ← /admin/payouts  (manual payout approvals)
    ├── revenue/
    │   └── page.tsx             ← /admin/revenue  (recharts + filters)
    └── settings/
        └── page.tsx             ← /admin/settings  (phone, rules, commission)
```

---

## 5. AUTH ARCHITECTURE

### NextAuth.js v5 — 4 credential providers

Each portal has its own NextAuth credentials provider that calls the corresponding backend login endpoint. Role mismatch is handled at the provider level — not after login.

```typescript
// frontend/auth.ts
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    // Provider 1: Guest portal (/login)
    Credentials({
      id: "guest-credentials",
      credentials: { email: {}, password: {} },
      authorize: async (creds) => {
        const res = await fetch(`${API_URL}/v1/auth/login`, { method: "POST", ... })
        // Returns user + tokens or null
      }
    }),
    // Provider 2: Host portal (/host/login)
    Credentials({ id: "host-credentials", ... }),
    // Provider 3: Ops portal (/ops/login)
    Credentials({ id: "ops-credentials", ... }),
    // Provider 4: Admin portal (/admin/login)
    Credentials({ id: "admin-credentials", ... }),
    // Provider 5: Google OAuth2 (guest only)
    Google({ ... }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      // Store accessToken, refreshToken, role, userId in JWT
      if (user) { token.accessToken = user.accessToken; token.role = user.role }
      return token
    },
    session: async ({ session, token }) => {
      // Expose to useSession()
      session.accessToken = token.accessToken as string
      session.user.role = token.role as string
      return session
    }
  }
})
```

### Route protection — middleware.ts

```typescript
// frontend/middleware.ts
export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  // Protect host routes — must be logged in with role=host
  if (pathname.startsWith("/host") && !pathname.startsWith("/host/login")) {
    if (!session || session.user.role !== "host") {
      return NextResponse.redirect(new URL("/host/login", req.url))
    }
  }
  // Protect ops routes
  if (pathname.startsWith("/ops") && !pathname.startsWith("/ops/login")) {
    if (!session || session.user.role !== "ops") {
      return NextResponse.redirect(new URL("/ops/login", req.url))
    }
  }
  // Protect admin routes
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!session || session.user.role !== "admin") {
      return NextResponse.redirect(new URL("/admin/login", req.url))
    }
  }
})

export const config = {
  matcher: ["/host/:path*", "/ops/:path*", "/admin/:path*", "/bookings/:path*", "/requests/:path*"]
}
```

### Token refresh strategy

Access tokens expire in 15 minutes. A React Query mutation runs in the background every 14 minutes to call `POST /v1/auth/refresh` and update the NextAuth session. If refresh fails (logout elsewhere), the user is redirected to their portal login.

```typescript
// frontend/lib/api-client.ts — axios instance with interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Try refresh
      const refreshed = await refreshToken()
      if (refreshed) {
        // Retry original request with new token
        return api(error.config)
      }
      // Refresh failed — sign out
      await signOut({ redirectTo: getPortalLoginUrl() })
    }
    return Promise.reject(error)
  }
)
```

---

## 6. DATA FETCHING — REACT QUERY

All server data goes through React Query. No raw `fetch` calls in components.

```typescript
// frontend/lib/query-keys.ts — centralised key factory
export const queryKeys = {
  listings: {
    all:    (filters: ListingFilters) => ["listings", filters],
    detail: (id: string)              => ["listings", id],
    calendar: (id: string, month: string) => ["listings", id, "calendar", month],
  },
  bookings: {
    all:    () => ["bookings"],
    detail: (id: string) => ["bookings", id],
  },
  requests: {
    pending: () => ["ops", "requests", "pending"],
    mine:    () => ["guest", "requests"],
  },
  settings: {
    public:    () => ["settings", "public"],
    amenities: () => ["settings", "amenities"],
    locations: () => ["settings", "locations"],
  },
}
```

```typescript
// Example query hook
export function useListing(id: string) {
  return useQuery({
    queryKey: queryKeys.listings.detail(id),
    queryFn:  () => api.get<{ data: TListing }>(`/v1/listings/${id}`).then(r => r.data.data),
    staleTime: 5 * 60 * 1000,  // 5 minutes
  })
}

// Example mutation
export function useApproveRequest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.patch(`/v1/ops/requests/${id}/approve`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.requests.pending() })
    },
  })
}
```

### Stale times by data type

| Data | staleTime | Notes |
|------|-----------|-------|
| Public settings (phone, rules) | 30 min | Rarely changes |
| Amenities list | 24 hr | Cached in Redis on server too |
| Popular locations | 6 hr | Matches server Redis cache |
| Active listings | 5 min | Browse page SSR + client revalidate |
| Pending requests (Ops) | 30 sec | Ops queue needs near-realtime |
| My bookings | 2 min | User polling their own bookings |
| Booking detail | 1 min | After payment confirmation |

---

## 7. STATE MANAGEMENT — ZUSTAND

Only UI state lives in Zustand. Server state always lives in React Query.

```typescript
// frontend/store/ui.store.ts
interface UIStore {
  // Listing wizard
  wizardStep: number
  wizardDraft: Partial<TListingDraft>
  setWizardStep: (step: number) => void
  updateWizardDraft: (patch: Partial<TListingDraft>) => void
  resetWizard: () => void

  // Date picker
  selectedCheckIn:  Date | null
  selectedCheckOut: Date | null
  setDates: (checkIn: Date | null, checkOut: Date | null) => void

  // Lightbox (v2.2)
  lightboxOpen: boolean
  lightboxPhotos: string[]
  lightboxIndex: number
  openLightbox: (photos: string[], index: number) => void
  closeLightbox: () => void

  // Global toast/alert
  toast: { message: string; type: "success" | "error" | "info" } | null
  showToast: (message: string, type: "success" | "error" | "info") => void
  clearToast: () => void
}
```

---

## 8. FOLDER STRUCTURE — FULL

```
frontend/
├── app/                          ← Next.js App Router pages
│   ├── (guest)/                  ← Guest portal route group
│   ├── host/                     ← Host portal
│   ├── ops/                      ← Ops portal
│   ├── admin/                    ← Admin portal
│   ├── api/                      ← Next.js API routes (NextAuth callbacks)
│   │   └── auth/[...nextauth]/
│   │       └── route.ts
│   └── layout.tsx                ← Root layout (fonts, metadata)
│
├── components/                   ← All React components
│   ├── ui/                       ← shadcn/ui generated components (DO NOT EDIT)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── shared/                   ← Used across all portals
│   │   ├── PageHeader.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── ErrorState.tsx
│   │   ├── EmptyState.tsx
│   │   ├── StatusBadge.tsx       ← booking/request status colours
│   │   ├── PriceBreakdown.tsx    ← price + top_up + total display
│   │   ├── PhotoLightbox.tsx     ← v2.2 fullscreen photo viewer
│   │   └── ConfirmDialog.tsx
│   ├── listings/                 ← Listing-related components
│   │   ├── ListingCard.tsx       ← browse grid card
│   │   ├── ListingDetail.tsx     ← full detail page
│   │   ├── ListingMap.tsx        ← Leaflet map display
│   │   ├── AmenitiesList.tsx     ← v2.2 predefined checklist
│   │   ├── RulesSection.tsx      ← property + standard rules merged
│   │   └── PhotoGallery.tsx      ← v2.2 clickable lightbox grid
│   ├── bookings/
│   │   ├── BookingCard.tsx
│   │   ├── BookingDetail.tsx     ← full detail + check-in info reveal
│   │   ├── CheckInInfo.tsx       ← revealed immediately on payment
│   │   ├── ExtensionOffer.tsx    ← offer banner with countdown
│   │   └── ReceiptDownload.tsx
│   ├── requests/
│   │   ├── RequestCard.tsx
│   │   ├── RequestCountdown.tsx  ← 30-min countdown timer
│   │   └── DateRangePicker.tsx   ← v2.2 blocks past + enforces 2-night min
│   ├── host/
│   │   ├── ListingWizard.tsx     ← 7-step creation wizard
│   │   ├── WizardStep*.tsx       ← one component per step
│   │   ├── CalendarView.tsx      ← v2.2 blocked/booked/free day grid
│   │   ├── ManualBlockForm.tsx   ← v2.2 host manually blocks dates
│   │   └── RevenueChart.tsx      ← recharts monthly earnings
│   ├── ops/
│   │   ├── PendingRequestRow.tsx ← with seconds_remaining countdown
│   │   ├── BookingsDashboard.tsx ← v2.2 4-view tabs
│   │   └── KYCReviewCard.tsx     ← document viewer + approve/reject
│   ├── admin/
│   │   ├── OpsTeamTable.tsx
│   │   ├── PendingListingsTable.tsx
│   │   └── CommissionEditor.tsx  ← edit tier table
│   └── forms/
│       ├── LoginForm.tsx         ← shared across all 4 portals
│       ├── RegisterForm.tsx
│       ├── RequestForm.tsx       ← with DateRangePicker
│       ├── KYCUploadForm.tsx
│       └── PayoutMethodForm.tsx
│
├── hooks/                        ← Custom hooks
│   ├── useListings.ts            ← React Query hooks for listings
│   ├── useBookings.ts
│   ├── useRequests.ts
│   ├── usePayments.ts
│   ├── useKYC.ts
│   ├── useExtensions.ts
│   ├── useReviews.ts
│   ├── useAdmin.ts
│   ├── useSettings.ts            ← public settings + amenities + locations
│   └── useAuth.ts                ← session helpers + role guards
│
├── lib/                          ← Pure utilities
│   ├── api-client.ts             ← axios instance with auth interceptor
│   ├── query-keys.ts             ← centralised React Query key factory
│   ├── formatters.ts             ← money, dates, status labels
│   ├── validators.ts             ← Zod schemas (mirror backend rules)
│   └── constants.ts              ← API_URL, APP_NAME, etc.
│
├── store/                        ← Zustand stores
│   ├── ui.store.ts
│   └── wizard.store.ts           ← listing creation wizard state
│
├── types/                        ← TypeScript types
│   ├── api.types.ts              ← API request/response shapes
│   ├── models.types.ts           ← TUser, TListing, TBooking, etc.
│   └── next-auth.d.ts            ← NextAuth session type extensions
│
├── auth.ts                       ← NextAuth configuration
├── middleware.ts                 ← Route protection
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

---

## 9. NAMING CONVENTIONS

### Files
- **Pages:** `page.tsx` (Next.js App Router convention — never change)
- **Layouts:** `layout.tsx`
- **Components:** `PascalCase.tsx` — e.g. `BookingCard.tsx`, `PhotoLightbox.tsx`
- **Hooks:** `camelCase.ts` prefixed with `use` — e.g. `useBookings.ts`
- **Utilities:** `camelCase.ts` — e.g. `formatters.ts`, `api-client.ts`
- **Stores:** `camelCase.store.ts` — e.g. `ui.store.ts`
- **Types:** `camelCase.types.ts`
- **Folders:** `kebab-case` for multi-word — e.g. `ops-team/`

### TypeScript
- **Types:** `TPascalCase` — e.g. `TBooking`, `TListingDetail`, `TUser`
- **Props:** `ComponentNameProps` — e.g. `BookingCardProps`
- **API response types:** `TApiResponse<T>` wrapping `{ data: T }`
- **Functions:** `camelCase`
- **Constants:** `UPPER_SNAKE_CASE`
- **React components:** `PascalCase` function, default export

### Tailwind
- Use design tokens via CSS variables (see Section 12) — not raw hex values
- Utility classes in JSX — never inline styles
- Custom class names only for complex animations or things Tailwind can't do

---

## 10. CODE STYLE RULES

### TypeScript
- Strict mode on — `"strict": true` in tsconfig.json
- **No `any`** — use proper types or `unknown` with a type guard
- **No `as` type casts** except where unavoidable, always add a comment explaining why
- All API response data must be typed — never trust `response.data` as untyped
- Props must always be explicitly typed with an interface
- Export types separately from implementation
- Use `const` by default, `let` only when reassignment is needed

### Components
- **Functional only** — no class components, ever
- **Single responsibility** — one component does one thing
- Keep components under 150 lines — extract sub-components if longer
- Never put business logic in components — extract to custom hooks
- Never call the API directly from a component — always via React Query hooks
- **No useEffect for data fetching** — that's React Query's job
- `useEffect` is only for: DOM side effects, event listeners, timers, syncing external state

### Forms
- Every form uses React Hook Form + Zod
- Zod schema lives in `lib/validators.ts`, not inside the component
- Show field-level errors inline, not as a toast
- Disable the submit button while mutation is pending
- Show loading state in the button while submitting

```typescript
// Pattern for every form
const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "At least 8 characters"),
})
type TFormData = z.infer<typeof schema>

export function LoginForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TFormData>({
    resolver: zodResolver(schema),
  })
  const { mutate, isPending } = useLoginMutation()

  const onSubmit = (data: TFormData) => mutate(data)

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register("email")} error={errors.email?.message} />
      <Input {...register("password")} type="password" error={errors.password?.message} />
      <Button type="submit" loading={isPending || isSubmitting}>Sign in</Button>
    </form>
  )
}
```

### Imports
- Group imports: React/Next → third-party → internal (components → hooks → lib → types)
- Use absolute imports from `@/` — never relative `../../`
- Example: `import { BookingCard } from "@/components/bookings/BookingCard"`

---

## 11. API CLIENT

All API calls go through the central Axios instance. Never use `fetch` directly.

```typescript
// frontend/lib/api-client.ts
import axios from "axios"
import { getSession } from "next-auth/react"

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + "/v1",
  headers: { "Content-Type": "application/json" },
})

// Attach JWT to every request
api.interceptors.request.use(async (config) => {
  const session = await getSession()
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`
  }
  return config
})

// Handle 401 → token refresh → retry
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true
      const refreshed = await refreshSession()  // updates NextAuth session
      if (refreshed) return api(error.config)
      signOut({ callbackUrl: getPortalLogin() })
    }
    return Promise.reject(error)
  }
)
```

### API response types

```typescript
// frontend/types/api.types.ts
export type TApiResponse<T> = { data: T }
export type TApiListResponse<T> = {
  data: T[]
  meta: { total: number; page: number; pages: number; limit: number }
}
export type TApiError = { error: { code: string; message: string } }

// Money is always a string in KES — never parse to float
export type TKESAmount = string  // e.g. "2500.00"

// Timestamps are always ISO 8601 UTC strings from the API
export type TISOTimestamp = string  // e.g. "2026-05-01T10:30:00Z"
```

---

## 12. DESIGN SYSTEM

### Brand colours (CSS variables — use these, never raw hex)

```css
--brand:       #E35336   /* Primary — CTAs, active states, brand accents */
--brand-dark:  #C03D24   /* Hover state for brand colour */
--brand-light: #F9DDD7   /* Tinted backgrounds, selected state */
--brand-pale:  #FDF1EE   /* Very light brand tint */
```

### Neutral scale
```css
--dark:   #222222   /* Headings, body text */
--dark-2: #333333   /* Secondary text */
--dark-3: #555555   /* Tertiary text */
--dark-4: #777777   /* Placeholder text */
--dark-5: #AAAAAA   /* Disabled text */
--dark-6: #CCCCCC   /* Borders */
--dark-7: #E5E5E5   /* Dividers */
--dark-8: #F2F2F2   /* Background accents */
--page:   #F5F4F2   /* Page background */
--white:  #FFFFFF
```

### Status colours (use these for booking/request/KYC status badges)
```css
--success-bg:     #E8F5E9   --success-ink:  #2E7D32
--pending-bg:     #FFF8E1   --pending-ink:  #A05C00
--error-bg:       #FDEAEA   --error-ink:    #C62828
--info-bg:        #E3F2FD   --info-ink:     #1565C0
```

### Typography
- **Display font:** `Quicksand` — weights 400, 500, 600, 700 — headings, brand name, buttons
- **Body font:** `Raleway` — weights 300, 400, 500, 600 — body copy, labels, inputs
- Import both from Google Fonts in `app/layout.tsx` via `next/font/google`

### Border radii
```css
--r-sm:   6px    /* inputs, small badges */
--r-md:   10px   /* cards, buttons */
--r-lg:   16px   /* modals, large cards */
--r-xl:   24px   /* photo thumbnails */
--r-full: 999px  /* pills, tags */
```

### Shadows
```css
--shadow-sm: 0 1px 3px rgba(0,0,0,.08)    /* cards at rest */
--shadow-md: 0 4px 14px rgba(0,0,0,.10)   /* cards on hover */
--shadow-lg: 0 12px 36px rgba(0,0,0,.12)  /* modals, dropdowns */
```

### Tailwind config additions (tailwind.config.ts)
```typescript
theme: {
  extend: {
    colors: {
      brand:       "#E35336",
      "brand-dark":"#C03D24",
    },
    fontFamily: {
      display: ["var(--font-display)"],
      body:    ["var(--font-body)"],
    },
    borderRadius: {
      sm: "6px", md: "10px", lg: "16px", xl: "24px",
    },
  }
}
```

---

## 13. COMPONENT PATTERNS

### Status badge
```typescript
// components/shared/StatusBadge.tsx
const STATUS_STYLES: Record<string, string> = {
  pending:      "bg-[var(--pending-bg)] text-[var(--pending-ink)]",
  approved:     "bg-[var(--info-bg)] text-[var(--info-ink)]",
  confirmed:    "bg-[var(--success-bg)] text-[var(--success-ink)]",
  declined:     "bg-[var(--error-bg)] text-[var(--error-ink)]",
  expired:      "bg-[var(--dark-8)] text-[var(--dark-4)]",
  active:       "bg-[var(--success-bg)] text-[var(--success-ink)]",
  pending_review: "bg-[var(--pending-bg)] text-[var(--pending-ink)]",
}
```

### Price breakdown display
```typescript
// Always show: Host price + Top-Up + Guest Total
// NEVER show top-up as a percentage — it's a fixed KES amount
// components/shared/PriceBreakdown.tsx
<div>
  <Row label="Price per night" value={formatKES(listing.price_per_night)} />
  <Row label="Service fee"     value={formatKES(listing.top_up_amount)} />
  <Divider />
  <Row label="Total per night" value={formatKES(guestPricePerNight)} bold />
  <Row label={`Total (${nights} nights)`} value={formatKES(total)} bold large />
</div>
```

### Date picker rules (v2.2)
- Block all past dates — `minDate={new Date()}`
- Enforce 2-night minimum — `checkout >= checkin + 2 days`
- Disable dates returned in `GET /v1/listings/:id/available-dates`
- Show error inline if user tries to select 1 night: *"Minimum stay is 2 nights"*

```typescript
// libs/validators.ts — mirrors backend validation
export const dateRangeSchema = z.object({
  checkIn: z.date().min(
    new Date(new Date().setHours(0,0,0,0)),
    { message: "Check-in cannot be in the past" }
  ),
  checkOut: z.date(),
}).refine(
  (d) => {
    const nights = differenceInDays(d.checkOut, d.checkIn)
    return nights >= 2
  },
  { message: "Minimum stay is 2 nights", path: ["checkOut"] }
)
```

### Photo lightbox (v2.2)
- All listing photos are clickable — opens fullscreen lightbox
- Supports keyboard navigation (←/→ arrows, Escape)
- Supports swipe gestures on mobile
- Uses Zustand `lightboxOpen/lightboxPhotos/lightboxIndex` state
- Never use a static `<img>` for listing photos without the lightbox trigger

### Listing wizard — 7 steps (Host portal)
```
Step 1: Basic info (title, description, unit type)
Step 2: Photos (upload up to 10, drag-to-reorder)
Step 3: Pricing (price_per_night, discount thresholds)
Step 4: Amenities (predefined checklist from GET /v1/amenities — v2.2)
Step 5: Location (Leaflet map picker — sets lat/lng/address)
Step 6: Check-in details (address, host_phone, Maps pin URL, WiFi, instructions)
Step 7: Rules (host rules free-text list + standard rules shown read-only)
```
Wizard state lives in Zustand `wizard.store.ts`. On refresh: restore from localStorage with key `ns-wizard-draft`. On submit: `POST /v1/host/listings` then `POST /v1/host/listings/:id/submit`.

### Ops pending queue countdown
```typescript
// components/requests/RequestCountdown.tsx
// seconds_remaining comes from GET /v1/ops/requests/pending
// Counts down locally using setInterval, re-fetches every 30s
// Colour: green → amber at 10min → red at 5min → expired
```

---

## 14. KEY FRONTEND BUSINESS RULES

Claude must know these and apply them in all frontend code and suggestions:

### Check-in info reveal (v2.1 KEY CHANGE)
- Check-in details (address, host phone, Maps pin URL, WiFi) are shown to the guest **immediately after payment confirmation** — no waiting for KYC
- The `booking.check_in_revealed_at` field is set by the backend on payment success
- On the booking detail page: if `check_in_revealed_at !== null` → show `<CheckInInfo />`
- If `check_in_revealed_at === null` → show payment pending state

### KYC prompt (non-blocking)
- KYC is prompted separately after payment — it does NOT block check-in info
- Show KYC prompt banner on the booking detail page if `show_kyc_prompt: true` in the bookings list response
- Once `kyc_verified_at` is set on the user, **never** show the KYC prompt again on any future booking
- Check `user.kyc_status === "verified"` (from `/v1/auth/me`) before showing KYC prompt

### Pricing display
- Always show: `host_price + top_up = guest_price`
- The top-up is a fixed KES amount — never show it as a percentage
- The word "commission" never appears in the guest UI — call it "service fee"
- All amounts formatted as: `KES 2,500` or `Ksh 2,500`

### Minimum stay enforcement (v2.2)
- The date picker must block the checkout date from being less than `checkin + 2 days`
- Show error inline if violated: *"Minimum stay is 2 nights"*
- This is validated server-side too (422 INVALID_DATE_RANGE) — but prevent it client-side first
- **Exception:** extensions have a 1-night minimum — the extension offer UI does NOT enforce 2 nights

### Listing status flow (v2.1)
- `draft` → host editing, not visible to guests
- `pending_review` → submitted, waiting for admin approval — show "Under Review" badge to host
- `active` → visible to guests, can receive requests
- `inactive` → host deactivated, not visible

### Ops portal — 4-view bookings dashboard (v2.2)
- Four tabs: Today's Check-ins / Today's Check-outs / Upcoming (7 days) / All
- Each tab calls `GET /v1/ops/bookings?view=<view>` with corresponding `view` param
- `today_checkins` and `today_checkouts` auto-refresh every 5 minutes
- Clicking a booking row opens full detail with check-in info

### Admin: ops team invite
- When admin adds an ops member, they receive an invite email with a temp password
- On their first login at `/ops/login`, `must_change_password = true` → immediate redirect to `/ops/set-password`
- The set-password page calls `POST /v1/auth/ops/set-password` — on success, redirect to `/ops/requests`

### Host browse-as-guest mode (v2.2)
- Host can switch to guest browsing from any host page using a toggle in the nav
- Calls `POST /v1/auth/switch-mode` → receives a guest-scoped JWT with `host_id` preserved in claims
- The UI should show a banner: *"You're browsing as a guest. Switch back to host dashboard."*
- Switch back calls `POST /v1/auth/switch-back-to-host`

---

## 15. NAVIGATION + LOGOS

### Logo placement (v2.2)
The Nairobi Spaces logo appears in:
1. Guest portal navbar (top-left, links to `/`)
2. Host portal sidebar (top, links to `/host/dashboard`)
3. Ops portal header (top-left, links to `/ops/requests`)
4. Admin portal header (top-left, links to `/admin/dashboard`)
5. Payment confirmed page (centered)
6. Browser favicon

### Guest portal navbar
- Logo (left) + Search bar (center) + Nav links (right): Explore / My Bookings / Wishlist / Profile
- On mobile: hamburger menu
- Popular locations from `GET /v1/locations/popular` shown in the search dropdown (cached 6hr — v2.2)

### Host portal sidebar
- Logo at top
- Nav items: Dashboard / My Listings / Bookings / Calendar / Payouts / Revenue / Profile
- "Browse as Guest" toggle at the bottom (v2.2)

### Ops portal header
- Logo + page title + logout
- No sidebar — simple top nav

### Admin portal header
- Logo + nav tabs: Dashboard / Listings / Ops Team / Hosts / Payouts / Revenue / Settings

---

## 16. ENVIRONMENT VARIABLES

All public env vars prefixed with `NEXT_PUBLIC_`. Never expose secrets in the browser.

```bash
# .env.local (development)
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_APP_NAME="Nairobi Spaces"
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1...  # or NEXT_PUBLIC_GOOGLE_MAPS_KEY

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-min-32-chars

GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# Production (Kubernetes Secret — never committed)
NEXT_PUBLIC_API_URL=https://api.nairobispaces.co.ke
NEXTAUTH_URL=https://nairobispaces.co.ke
```

**Rules:**
- `NEXT_PUBLIC_*` → safe to expose to browser — put API URL, app name, map key
- Non-prefixed → server-only — put NEXTAUTH_SECRET, Google OAuth secrets
- Never commit `.env.local` — only `.env.example`

---

## 17. ACCESSIBILITY + PERFORMANCE

### Accessibility (WCAG 2.1 AA — required before launch)
- All interactive elements have keyboard focus indicators
- All images have `alt` attributes — listing photos use descriptive alt text
- All form fields have associated `<label>` elements
- Colour contrast ratio ≥ 4.5:1 for body text
- Modal/dialog uses focus trap (shadcn/ui Dialog handles this automatically)
- Error messages linked to inputs via `aria-describedby`
- Loading states use `aria-live="polite"` or `aria-busy`

### Performance targets (Phase 8)
- Lighthouse score ≥ 90 on all 4 pages: Performance, Accessibility, Best Practices, SEO
- Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- Listing browse page uses SSR for initial data (Next.js `fetch` with `cache: "no-store"` for SSR)
- Listing photos served via CDN (S3 + CloudFront) — never the API server
- `next/image` for all listing photos — automatic WebP conversion + lazy loading
- `next/font` for Quicksand + Raleway — font files served locally, no Google Fonts runtime

---

## 18. TESTING RULES

### Unit tests — Vitest + Testing Library
```
npm run test          # vitest run
npm run test:watch    # vitest --watch
npm run test:coverage # vitest run --coverage
```

- Test files: `ComponentName.test.tsx` alongside the component
- Test custom hooks with `renderHook` from `@testing-library/react`
- Mock React Query with `@tanstack/react-query` test utilities
- Mock NextAuth session with `{ data: { user: { role: "guest" } }, status: "authenticated" }`

### What to test
- Form validation: does the form show the right error for each invalid input?
- Route protection: does middleware redirect correctly for each role?
- Status badge: does it render the right colour for each booking status?
- Price breakdown: does it compute and display the correct totals?
- Date picker: does it enforce 2-night minimum and block past dates?
- KYC prompt: does it show only when `show_kyc_prompt: true`?

### E2E tests — Playwright (15 flows, runs on staging)
Playwright tests live in `/e2e/` and run against the staging environment. See the engineering suite TST document for the full list of 15 flows.

---

## 19. GIT WORKFLOW

Identical to the backend CLAUDE.md. All work on feature branches — never commit to `main`.

```
main          ← protected · production-ready only · requires PR + all CI checks
feature/*     ← all new work (e.g. feature/ops-request-queue)
fix/*         ← bug fixes
chore/*       ← deps, config, tooling
docs/*        ← documentation only
```

**Commit format (Conventional Commits):**
```
feat(ops): add 4-view bookings dashboard with real-time countdown
fix(auth): handle token refresh failure redirect to correct portal
feat(listings): add photo lightbox with keyboard + swipe support
chore(deps): upgrade next to 14.2.x
```

**PR checklist:**
- `npm run build` passes (no TypeScript errors, no build failures)
- `npm run lint` clean
- `npm run type-check` clean
- New env vars added to `.env.example`
- New pages added to `middleware.ts` matcher if they need protection
- Lighthouse score not regressed (run locally with `npx lighthouse`)

---

## 20. HOW CLAUDE SHOULD BEHAVE ON THE FRONTEND

### ALWAYS
- Explain WHY before showing code — Caleb is learning React and TypeScript from scratch.
- Use the component patterns in Section 13 — don't invent new patterns.
- Follow the file/folder structure in Section 8 exactly.
- Use the design tokens in Section 12 — never raw hex values in components.
- Reference the business rules in Section 14 when building booking/payment/KYC UI.
- Show TypeScript types for all props, API responses, and function parameters.
- When writing a component, suggest what tests to write for it.
- Point out when something needs an accessibility fix.

### NEVER
- Use `any` type — explain the correct type instead.
- Use `useEffect` for data fetching — use React Query.
- Put business logic inside components — extract to hooks.
- Call the API directly in a component — use the hook.
- Use `fetch` directly — use the `api` client from `lib/api-client.ts`.
- Use raw hex colours — use CSS variables from Section 12.
- Suggest adding WhatsApp as a payout method in any form.
- Show KYC as a gate for check-in information — check-in info is revealed immediately on payment (v2.1).
- Enforce 2-night minimum on extension offer UI — extensions need only 1 night.
- Use the Pages Router (`/pages/` directory) — this project uses App Router only.

### WHEN CALEB IS STUCK
1. Ask what he's already tried.
2. Explain the concept with a real-world analogy (e.g. "React Query is like a smart data cache...").
3. Show a minimal working example — not the full solution.
4. Let Caleb apply it himself.
5. Review what he wrote and give feedback.

---

## 21. CURRENT PHASE STATUS

Update this as phases complete:

- [ ] Phase 1 — Foundation & Auth (27 Apr – 17 May 2026)
  - [ ] Next.js project init with App Router + TypeScript
  - [ ] Tailwind + shadcn/ui setup + design tokens
  - [ ] NextAuth.js v5 with 4 credential providers
  - [ ] 4 login pages (/login, /host/login, /ops/login, /admin/login)
  - [ ] Guest registration page
  - [ ] middleware.ts route protection
  - [ ] api-client.ts with auth interceptor + token refresh
  - [ ] GET /v1/settings/public fetched on app load (support phone for footer)
- [ ] Phase 2 — Listings & Host Portal (18 May – 7 Jun 2026)
- [ ] Phase 3 — Booking Request Flow (8 Jun – 28 Jun 2026)
- [ ] Phase 4 — Payments (29 Jun – 19 Jul 2026)
- [ ] Phase 5 — KYC (20 Jul – 9 Aug 2026)
- [ ] Phase 6 — Extensions (10 Aug – 23 Aug 2026)
- [ ] Phase 7 — Reviews, Admin (24 Aug – 13 Sep 2026)
- [ ] Phase 8 — Polish & Testing (14 Sep – 4 Oct 2026)
- [ ] Phase 9 — Beta & Launch (5 Oct – 20 Oct 2026)

**Currently working on:** Phase 1 — Next.js project skeleton + 4 login portals.

---

## 22. USEFUL REFERENCES

- Backend CLAUDE.md: `/CLAUDE.md` (root of repo)
- Backend Build Guide: `docs/NairobiSpaces_Backend_BuildGuide.html`
- Frontend Build Guide: `docs/NairobiSpaces_Frontend_BuildGuide.html`
- Design Reference: `docs/nairobi-spaces-design-reference.html`
- Engineering Suite (all 7 docs): `docs/NairobiSpaces_Engineering_Suite.html`
- Next.js App Router docs: https://nextjs.org/docs/app
- NextAuth.js v5 docs: https://authjs.dev
- shadcn/ui components: https://ui.shadcn.com/docs
- React Query docs: https://tanstack.com/query/v5
- Zustand docs: https://docs.pmnd.rs/zustand
- React Hook Form docs: https://react-hook-form.com
- Zod docs: https://zod.dev
- Leaflet + React Leaflet: https://react-leaflet.js.org
- Recharts docs: https://recharts.org
