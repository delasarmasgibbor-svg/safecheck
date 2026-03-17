import { motion } from 'framer-motion';

export function Skeleton({ className }) {
  return (
    <div className={`relative overflow-hidden bg-slate-900/40 rounded-2xl ${className}`}>
      <motion.div
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
      />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="glass-panel p-6 rounded-[32px] border-white/5 space-y-4">
      <div className="flex items-start gap-5">
        <Skeleton className="w-14 h-14 rounded-[20px]" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-8 w-3/4" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-xl" />
            <Skeleton className="h-6 w-16 rounded-xl" />
          </div>
          <Skeleton className="w-full h-1.5 rounded-full" />
        </div>
      </div>
    </div>
  );
}
