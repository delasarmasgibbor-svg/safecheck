import * as React from "react"

const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 active:scale-95"
  
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-900/20",
    destructive: "bg-rose-600 text-white hover:bg-rose-700",
    outline: "border border-slate-700 bg-transparent hover:bg-slate-800 text-slate-100",
    secondary: "bg-slate-800 text-slate-100 hover:bg-slate-700",
    ghost: "hover:bg-slate-800 hover:text-slate-100 text-slate-400",
    link: "text-blue-500 underline-offset-4 hover:underline",
  }

  const sizes = {
    default: "h-12 px-6 py-2",
    sm: "h-9 rounded-lg px-3",
    lg: "h-14 rounded-2xl px-8",
    icon: "h-12 w-12",
  }

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className || ""}`

  return (
    <button
      className={classes}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
