"use client";

import { ImageOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type PhotoCarouselItemProps = {
  href: string;
  placeholderImage: string;
};

export function PhotoCarouselItem({
  placeholderImage,
  href,
}: PhotoCarouselItemProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="object-cover rounded-lg flex items-center justify-center h-full w-full bg-secondary">
        <ImageOff />
      </div>
    );
  }

  if (!placeholderImage) {
    return (
      <Image
        src={href}
        alt="Property Image"
        fill
        className="object-cover rounded-lg"
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    <Image
      src={href}
      blurDataURL={placeholderImage}
      placeholder="blur"
      alt="Property Image"
      fill
      className="object-cover rounded-lg"
      onError={() => setHasError(true)}
    />
  );
}
