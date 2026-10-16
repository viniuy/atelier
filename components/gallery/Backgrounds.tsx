"use client";

import DotGrid from "@/components/reactbits/DotGrid";

/**
 * Ambient backgrounds from React Bits (DotGrid), tuned to stay quiet: a
 * faint dot field behind the hero that leans toward the cursor, and the same
 * field on the dark process band. Decorative only; pauses off-screen and
 * respects "reduce motion".
 */
export function HeroDots() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 [mask-image:radial-gradient(90%_80%_at_75%_35%,black_20%,transparent_75%)]"
    >
      <DotGrid
        dotSize={2.5}
        gap={20}
        baseColor="#cfccc4"
        activeColor="#1a1a19"
        proximity={150}
        glow={0}
        clickShock={false}
      />
    </div>
  );
}

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
