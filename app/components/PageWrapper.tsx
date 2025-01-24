'use client'

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function PageWrapper({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={cn("w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", className)}
    >
      {children}
    </motion.div>
  )
}

