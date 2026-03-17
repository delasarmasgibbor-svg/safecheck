import * as React from "react"

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-2xl border border-slate-200 bg-white/80 text-slate-900 shadow-sm backdrop-blur-sm ${className || ""}`}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`flex flex-col space-y-1.5 p-5 ${className || ""}`}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={`text-lg font-semibold leading-none tracking-tight ${className || ""}`}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={`p-5 pt-0 ${className || ""}`} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`flex items-center p-5 pt-0 ${className || ""}`}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardTitle, CardContent, CardFooter }
