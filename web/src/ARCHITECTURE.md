# SaaS Dashboard Architecture (Tailwind + shadcn/ui)

This project follows a **Feature-Driven Architecture** combined with a robust **Component Hierarchy** optimized for SaaS applications using React, Tailwind CSS, and shadcn/ui.

## Directory Structure

```text
src/
├── api/             # Global API clients (Axios, Fetch wrappers)
├── assets/          # Static assets (images, global icons)
├── components/      # Global & Reusable UI Components
│   ├── ui/          # Atomic components (shadcn/ui goes here unmodified)
│   ├── shared/      # Complex cross-feature composite components
│   │   ├── data-table/   # Reusable table with pagination/filtering
│   │   ├── forms/        # Form wrappers, specialized input composites
│   │   ├── page-header/  # Standardized dashboard page headers
│   │   ├── empty-state/  # Empty state illustrations & text
│   │   └── dialogs/      # Global confirm/alert dialog wrappers
│   └── layouts/     # Application Layouts
│       ├── dashboard/    # Sidebar, Topbar, Main Content Wrapper
│       ├── auth/         # Login/Signup split layouts
│       └── public/       # Landing page wrappers
├── config/          # Environment variables & constants
├── features/        # Feature Isolation (Domain-driven Design)
│   ├── auth/        # Authentication feature (Login, Register)
│   ├── billing/     # Subscriptions, Stripe integration
│   ├── users/       # User management
│   └── _template/   # Base template for new features
├── hooks/           # Global React hooks (`useWindowSize`, `useDebounce`)
├── lib/             # Third-party setups (`utils.ts` for cn(), `zod` config)
├── pages/           # Route-level components (Assemblies)
├── routes/          # React Router configuration
├── store/           # Global state (Zustand: `useAppStore`, `useUserStore`)
├── types/           # Global TypeScript interfaces
└── utils/           # Pure utility functions (dates, formatting)
```

---

## 🏗 Component Architecture Rules

To keep the UI maintainable and scalable as the SaaS grows, we split components into 3 distinct layers:

### 1. Atomic UI (`components/ui/`)

This is where generated **shadcn/ui** components live (`Button`, `Input`, `Dialog`, `Select`).

- **Rule**: Do not add business logic here.
- **Rule**: Keep them as pure UI functions. If you need to modify a shadcn component's core styling, do it here once, so the whole app benefits.

### 2. Shared Composites (`components/shared/`)

These are combinations of atomic UI components that form standard SaaS patterns used across multiple features.

- `PageHeader`: Standard layout with a title, description, and action buttons (`<PageHeader title="Users" actions={<Button>Add User</Button>} />`).
- `DataTable`: A specialized wrapper around TanStack Table or shadcn `Table` handling pagination, skeleton states, and empty states uniformly.
- `ConfirmDialog`: A reusable `<AlertDialog>` for "Are you sure you want to delete this?" actions.
- **Rule**: These components remain "dumb". They accept props and emit events but do not fetch their own data.

### 3. Feature Components (`features/[name]/components/`)

These are highly specific components tied to a domain.

- Example: `features/users/components/UserListTable.tsx`.
- Example: `features/billing/components/PricingCards.tsx`.
- **Rule**: Feature components _can_ be smart. They can consume feature hooks (`useUsers()`), interact with the feature store, or handle specific business logic.

---

## 🔄 The Data Flow Architecture (UI vs Business Logic)

We strictly separate **Presentation (UI)** from **Business Logic**.

### Presentation Layer

Components in `features/*/components` or `pages/` that primarily return JSX. If they contain forms, they only manage _local form state_ (using `react-hook-form`). When an action is required, they call a hook.

```tsx
// features/users/components/CreateUserForm.tsx
export function CreateUserForm() {
  const { mutate, isPending } = useCreateUser(); // Business Logic Hook

  const onSubmit = (data) => {
    mutate(data);
  };

  return <form onSubmit={handleSubmit(onSubmit)}>...</form>;
}
```

### Business Logic Layer

Handled by custom hooks inside `features/*/hooks/` or Zustand stores `features/*/store/`. These hooks use tools like **TanStack Query** (or standard async functions + Zustand) to fetch data, handle loading/error states, and mutate data.

```ts
// features/users/hooks/useCreateUser.ts
export const useCreateUser = () => {
  // Handles API calls, Zod validation logic, and cache invalidation
  return useMutation({ ... });
}
```

---

## 🎨 Layouts in SaaS

A typical SaaS has at least two main layouts:

1. **`AuthLayout`**: A split-screen layout where the left side is the login/register form (`children`), and the right side is a branding image or testimonial.
2. **`DashboardLayout`**:
   - Uses a persistent Sidebar/Navigation.
   - Has a Topbar (Search, Notifications, User Avatar Dropdown).
   - Contains a Main Content area that scrolls independently, usually constrained by a `max-w-7xl` container with padding.

**Usage:**

```tsx
// pages/users/index.tsx
export default function UsersPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="User Management"
        description="Manage your team members."
      />
      <UserListFeature />
    </DashboardLayout>
  );
}
```

## 🛠 Feature Isolation Structure

Every feature acts as a mini-application.

```text
src/features/billing/
├── api/             # e.g., getInvoices(), upgradePlan()
├── components/      # e.g., UpgradeModal.tsx, InvoiceList.tsx
├── hooks/           # e.g., useInvoices(), useSubscription()
├── store/           # e.g., useBillingStore() (if Zustand is needed locally)
├── types/           # e.g., Invoice interface, Zod upgrade schema
├── utils/           # e.g., calculateProration()
└── index.ts         # ONLY export what the rest of the app needs:
                     # export { BillingSettings } from './components/BillingSettings'
```

**Golden Rule:** If `features/users` needs a billing component, it imports from `features/billing/index.ts`. It **never** deep imports like `features/billing/components/UpgradeModal`.
