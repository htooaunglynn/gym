import type { InputHTMLAttributes } from 'react'

import { Input } from '@/components/ui/input'

type FormInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
}

export function FormInput({ label, error, id, className, ...props }: FormInputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="space-y-1.5">
      <div className="group relative">
        <Input
          id={inputId}
          placeholder=" "
          className={[
            'peer h-12 rounded-xl bg-white px-3 pt-4 text-base transition-all placeholder:text-transparent',
            error ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-amber-400',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        />
        <label
          htmlFor={inputId}
          className={[
            'pointer-events-none absolute left-3 top-3.5 origin-[0] -translate-y-3 scale-75 transform text-sm text-slate-500 duration-150',
            'peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-75',
            error ? 'text-red-500' : 'peer-focus:text-amber-600',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {label}
        </label>
      </div>
      {error && <p className="text-xs text-red-500 text-left ml-1">{error}</p>}
    </div>
  )
}
