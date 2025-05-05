// src/components/ui/button.jsx
import React from "react"

export function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
