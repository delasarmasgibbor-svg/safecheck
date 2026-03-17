import * as React from "react"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={`flex h-12 w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all ${className}`}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={`flex min-h-[80px] w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-none ${className}`}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Input, Textarea }
