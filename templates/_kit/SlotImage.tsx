import Image, { type ImageProps } from "next/image";
import type { ImageSlot } from "@/lib/types";

/** next/image fed from a template's named image slot (src, alt, intrinsic size). */
export function SlotImage({
  image: slot,
  alt,
  ...props
}: { image: ImageSlot; alt?: string } & Omit<ImageProps, "src" | "alt" | "width" | "height" | "slot">) {
  return <Image src={slot.src} alt={alt ?? slot.alt} width={slot.width} height={slot.height} {...props} />;
}
