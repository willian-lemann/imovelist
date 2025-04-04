import { ImageOff } from 'lucide-react'

import { useState } from 'react'

type PhotoCarouselItemProps = {
  href: string
}

export function PhotoCarouselItem({ href }: PhotoCarouselItemProps) {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return (
      <div className="object-cover rounded-lg flex items-center justify-center h-full w-full bg-secondary">
        <ImageOff />
      </div>
    )
  }

  return (
    <img
      src={href}
      alt="Property Image"
      className="object-cover rounded-lg h-full w-full"
      onError={() => setHasError(true)}
    />
  )
}
