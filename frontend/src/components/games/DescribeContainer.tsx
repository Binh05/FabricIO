import React from 'react'

export default function DescribeContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-container-low p-6 sm:p-7 shadow-sm">
      {children}
    </div>
  )
}
