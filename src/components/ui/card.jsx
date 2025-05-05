// src/components/ui/card.jsx
import React from "react"

export function Card({ className = "", children }) {
  return (
    <div className={`rounded-2xl bg-white shadow p-4 ${className}`}>
      {children}
    </div>
  )
}

export function CardContent({ children }) {
  return <div className="text-sm text-gray-700">{children}</div>
}
