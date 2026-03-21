import { useState } from 'react'
import { Apple, Facebook, Loader2 } from 'lucide-react'
import { useSignIn } from '@clerk/react'

import { Button } from '@/components/ui/button'

type SocialSignInButtonsProps = {
    disabled: boolean
    onError: (message: string) => void
}

const providers = [
    {
        label: 'Continue with iCloud',
        strategy: 'oauth_apple',
        icon: AppleIcon,
    },
    {
        label: 'Continue with Google',
        strategy: 'oauth_google',
        icon: GoogleIcon,
    },
    {
        label: 'Continue with Facebook',
        strategy: 'oauth_facebook',
        icon: FacebookIcon,
    },
] as const

export function SocialSignInButtons({ disabled, onError }: SocialSignInButtonsProps) {
    const { signIn } = useSignIn()
    const [pendingProvider, setPendingProvider] = useState<string | null>(null)

    const handleOAuthRedirect = async (strategy: (typeof providers)[number]['strategy']) => {
        if (!signIn) return

        setPendingProvider(strategy)
        onError('')

        try {
            const { error } = await signIn.sso({
                strategy,
                redirectCallbackUrl: new URL('/sso-callback', window.location.origin).toString(),
                redirectUrl: new URL('/', window.location.origin).toString(),
            })

            if (error) {
                onError('Social authentication failed. Please try another provider.')
                setPendingProvider(null)
            }
        } catch {
            onError('Social authentication failed. Please try another provider.')
            setPendingProvider(null)
        }
    }

    return (
        <div className="space-y-2.5">
            {providers.map(({ label, strategy, icon: Icon }) => {
                const isActive = pendingProvider === strategy

                return (
                    <Button
                        key={strategy}
                        className="h-11 w-full rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        disabled={disabled || pendingProvider !== null}
                        onClick={() => handleOAuthRedirect(strategy)}
                        type="button"
                        variant="outline"
                    >
                        {isActive ? <Loader2 className="size-4 animate-spin" /> : <Icon />}
                        {isActive ? 'Redirecting...' : label}
                    </Button>
                )
            })}
        </div>
    )
}

function AppleIcon() {
    return <Apple className="size-4" />
}

function GoogleIcon() {
    return (
        <svg aria-hidden className="size-4" viewBox="0 0 24 24">
            <path
                d="M21.8 12.23c0-.74-.07-1.46-.2-2.15H12v4.07h5.49a4.7 4.7 0 0 1-2.03 3.08v2.56h3.28c1.92-1.77 3.06-4.37 3.06-7.56Z"
                fill="#4285F4"
            />
            <path
                d="M12 22c2.76 0 5.08-.91 6.77-2.46l-3.28-2.56c-.91.61-2.08.98-3.49.98-2.68 0-4.95-1.81-5.76-4.24H2.85v2.64A10 10 0 0 0 12 22Z"
                fill="#34A853"
            />
            <path
                d="M6.24 13.72A5.96 5.96 0 0 1 5.92 12c0-.6.11-1.18.32-1.72V7.64H2.85A10 10 0 0 0 2 12c0 1.61.39 3.14 1.08 4.36l3.16-2.64Z"
                fill="#FBBC05"
            />
            <path
                d="M12 6.04c1.5 0 2.85.51 3.91 1.52l2.93-2.93C17.07 2.98 14.74 2 12 2a10 10 0 0 0-9.15 5.64l3.39 2.64C7.05 7.85 9.32 6.04 12 6.04Z"
                fill="#EA4335"
            />
        </svg>
    )
}

function FacebookIcon() {
    return <Facebook className="size-4" />
}
