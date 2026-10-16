"use client";

import DotGrid from "@/components/reactbits/DotGrid";

/**
 * Ambient background from React Bits (DotGrid) for the dark process band,
 * tuned to stay quiet. Decorative only; pauses off-screen and respects
 * "reduce motion".
 */
export function DarkDots() {
  return (
    <div aria-hidden="true" className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]">
      <DotGrid
        dotSize={2.5}
        gap={22}
        baseColor="#3d3c39"
        activeColor="#e9e7e1"
        proximity={130}
        glow={0.15}
        clickShock={false}
        opacity={0.9}
      />
    </div>
  );
}
