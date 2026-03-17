import * as React from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

const Checkbox = React.forwardRef(({ className, checked, onCheckedChange, ...props }, ref) => (
  <button
    type="button"
    ref={ref}
    role="checkbox"
    aria-checked={checked}
    onClick={(e) => {
      e.stopPropagation();
      onCheckedChange?.(!checked);
    }}
    className={`
      peer h-6 w-6 shrink-0 rounded-lg border-2 border-slate-200 bg-white 
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 
      disabled:cursor-not-allowed disabled:opacity-50 
      ${checked ? 'bg-emerald-500 border-emerald-500 text-white' : 'hover:border-blue-500'}
      flex items-center justify-center transition-all duration-300
      ${className}
    `}
    {...props}
  >
    {checked && (
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <Check className="h-4 w-4 stroke-[4]" />
      </motion.div>
    )}
  </button>
));

Checkbox.displayName = "Checkbox";

export { Checkbox };
