
import { Link } from 'react-router'

export default function PageNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-16 text-foreground">
      <section className="w-full max-w-xl rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">404</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Page Not Found</h1>
        <p className="mt-4 text-sm text-muted-foreground sm:text-base">
          The page you requested does not exist or may have been moved.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            to="/"
          >
            Go to Home
          </Link>
          <Link
            className="inline-flex items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-medium transition hover:bg-muted"
            to="/dashboard"
          >
            Go to Dashboard
          </Link>
        </div>
      </section>
    </main>
  )
}
