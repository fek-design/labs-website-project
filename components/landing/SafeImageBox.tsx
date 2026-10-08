"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";
import { Cube, ImageSquare } from "@phosphor-icons/react";

export interface SafeImageBoxProps extends Omit<ImageProps, "src" | "alt"> {
  src?: string | null;
  alt: string;
  fallbackLabel?: string;
  fallbackIcon?: "cube" | "image" | "gear" | React.ReactNode;
  fallbackClassName?: string;
}

export function SafeImageBox({
  src,
  alt,
  className = "",
  fill = false,
  width,
  height,
  fallbackLabel,
  fallbackIcon = "cube",
  fallbackClassName = "",
  sizes,
  priority,
  ...rest
}: SafeImageBoxProps) {
  const [hasError, setHasError] = useState(false);

  const isValidSrc = typeof src === "string" && src.trim().length > 0;
  const showFallback = !isValidSrc || hasError;

  if (showFallback) {
    const iconElement =
      typeof fallbackIcon === "string" ? (
        fallbackIcon === "image" ? (
          <ImageSquare size={28} weight="duotone" className="text-zinc-500 opacity-60" />
        ) : (
          <Cube size={28} weight="duotone" className="text-zinc-500 opacity-60" />
        )
      ) : (
        fallbackIcon
      );

    return (
      <div
        className={`${
          fill ? "absolute inset-0 w-full h-full" : "w-full h-full"
        } bg-[#141416] border border-[#262626] flex flex-col items-center justify-center gap-1.5 p-3 select-none text-zinc-500 transition-colors ${fallbackClassName}`}
        aria-label={alt}
        role="img"
      >
        {iconElement}
        {fallbackLabel && (
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-zinc-500 text-center truncate max-w-full px-1">
            {fallbackLabel}
          </span>
        )}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      onError={() => setHasError(true)}
      className={className}
      {...rest}
    />
  );
}
