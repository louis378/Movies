import { useState } from 'react'

export default function StarRating({ value = 0, onChange, readOnly = false, size = 'md' }) {
  const [hovered, setHovered] = useState(0)

  const sizeClass = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  }[size]

  const display = readOnly ? value : (hovered || value)

  return (
    <div
      className={`flex gap-0.5 ${readOnly ? '' : 'cursor-pointer'}`}
      onMouseLeave={() => !readOnly && setHovered(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`${sizeClass} transition-transform duration-75 select-none
            ${!readOnly ? 'hover:scale-110 active:scale-95' : ''}
            ${star <= display ? 'text-amber-400' : 'text-zinc-700'}`}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onClick={() => !readOnly && onChange?.(star)}
          role={readOnly ? undefined : 'button'}
          aria-label={readOnly ? undefined : `${star} 顆星`}
        >
          ★
        </span>
      ))}
    </div>
  )
}
