import React from 'react'

/**
 * Parses **text** markdown bold syntax into <strong> elements.
 * Use this for every CMS-sourced prose string so editors can bold
 * any text by wrapping it in double asterisks.
 */
export function renderBold(text: string): React.ReactNode {
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  )
}
