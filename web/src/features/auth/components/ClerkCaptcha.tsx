const isDev = import.meta.env.DEV

export function ClerkCaptcha() {
  return (
    <div className={isDev ? 'hidden' : 'space-y-2'}>
      {/* The #clerk-captcha div must always be present in the DOM */}
      <div id="clerk-captcha" />
      {!isDev && (
        <p className="text-xs text-slate-500">
          CAPTCHA appears only when Clerk requires a challenge.
        </p>
      )}
    </div>
  )
}
