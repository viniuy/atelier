"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ExternalLink, Lock, Monitor, Smartphone, Tablet } from "lucide-react";
import { cn } from "@/lib/utils";

const DEVICES = {
  desktop: { label: "Desktop", width: 1440, height: 900, icon: Monitor },
  tablet: { label: "iPad", width: 834, height: 1112, icon: Tablet },
  mobile: { label: "iPhone", width: 393, height: 852, icon: Smartphone },
} as const;

type Device = keyof typeof DEVICES;

/** Frame chrome around the viewport, in unscaled px. */
const FRAME: Record<Device, { x: number; top: number; bottom: number; radius: number; inner: number }> = {
  desktop: { x: 0, top: 44, bottom: 0, radius: 14, inner: 0 },
  tablet: { x: 20, top: 20, bottom: 20, radius: 44, inner: 24 },
  mobile: { x: 13, top: 13, bottom: 13, radius: 62, inner: 50 },
};

const spring = { type: "spring", stiffness: 210, damping: 30, mass: 0.9 } as const;

/**
 * Live preview of a template inside a device frame. The template runs in an
 * iframe at the device's real pixel width, so its own responsive breakpoints
 * kick in, and is then scaled down to fit the available space.
 */
export function DevicePreview({
  previewPath,
  displayUrl,
  title,
}: {
  previewPath: string;
  displayUrl: string;
  title: string;
}) {
  const [device, setDevice] = useState<Device>("desktop");
  const [stage, setStage] = useState<{ w: number; h: number } | null>(null);
  const [loaded, setLoaded] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setStage({ w: entry.contentRect.width, h: window.innerHeight });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const d = DEVICES[device];
  const f = FRAME[device];
  const outerW = d.width + f.x * 2;
  const outerH = d.height + f.top + f.bottom;
  const maxH = stage ? Math.max(480, stage.h * 0.78) : outerH;
  const scale = stage ? Math.min(1, stage.w / outerW, maxH / outerH) : 1;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label="Preview device" className="inline-flex rounded-lg bg-paper-2 p-1">
          {(Object.keys(DEVICES) as Device[]).map((key) => {
            const Icon = DEVICES[key].icon;
            const on = device === key;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={on}
                onClick={() => setDevice(key)}
                className={cn(
                  "relative flex items-center gap-2 rounded-md px-3.5 py-1.5 text-[14px] transition-colors",
                  on ? "text-ink" : "text-muted hover:text-ink",
                )}
              >
                {on && (
                  <motion.span
                    layoutId="device-pill"
                    className="absolute inset-0 rounded-md bg-card shadow-[0_1px_2px_rgb(0_0_0/0.08)]"
                    transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                  />
                )}
                <Icon className="relative size-4" aria-hidden="true" />
                <span className="relative hidden sm:inline">{DEVICES[key].label}</span>
                <span className="sr-only sm:hidden">{DEVICES[key].label}</span>
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-3 text-sm text-muted">
          <span className="hidden tabular-nums md:inline">
            {d.width} × {d.height}
            {scale < 1 && ` · ${Math.round(scale * 100)}%`}
          </span>
          <a
            href={previewPath}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink"
          >
            Full screen <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>

      <div
        ref={stageRef}
        className="relative w-full overflow-hidden rounded-xl bg-paper-2 px-0 py-6 sm:py-10"
      >
        {!stage ? (
          <div className="mx-auto aspect-[1440/940] w-full" aria-hidden="true" />
        ) : (
          <motion.div
            className="relative mx-auto"
            initial={false}
            animate={{ width: outerW * scale, height: outerH * scale }}
            transition={spring}
          >
            <motion.div
              className={cn(
                "absolute top-0 left-0 overflow-hidden shadow-[0_24px_60px_-30px_rgb(0_0_0/0.35)]",
                device === "desktop"
                  ? "border border-black/10 bg-[#f4f4f3]"
                  : "bg-[#1a1a19]",
              )}
              style={{ originX: 0, originY: 0 }}
              initial={false}
              animate={{
                width: outerW,
                height: outerH,
                scale,
                borderRadius: f.radius,
                paddingTop: f.top,
                paddingLeft: f.x,
                paddingRight: f.x,
                paddingBottom: f.bottom,
              }}
              transition={spring}
            >
              <AnimatePresence initial={false}>
                {device === "desktop" && (
                  <motion.div
                    key="browser-bar"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-x-0 top-0 flex h-11 items-center gap-4 px-4"
                    aria-hidden="true"
                  >
                    <span className="flex gap-1.5">
                      <span className="size-3 rounded-full bg-black/15" />
                      <span className="size-3 rounded-full bg-black/15" />
                      <span className="size-3 rounded-full bg-black/15" />
                    </span>
                    <span className="mx-auto flex w-full max-w-md items-center justify-center gap-1.5 truncate rounded-lg bg-black/[0.06] px-3 py-1.5 text-[13px] text-black/55">
                      <Lock className="size-3 shrink-0" aria-hidden="true" />
                      {displayUrl}
                    </span>
                    <span className="w-[54px]" />
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                className="relative h-full w-full overflow-hidden bg-white"
                initial={false}
                animate={{ borderRadius: f.inner }}
                transition={spring}
              >
                <iframe
                  src={previewPath}
                  title={title}
                  onLoad={() => setLoaded(true)}
                  className="block h-full w-full border-0"
                />
                <AnimatePresence>
                  {device === "mobile" && (
                    <motion.span
                      key="island"
                      initial={{ opacity: 0, scaleX: 0.4 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      exit={{ opacity: 0, scaleX: 0.4 }}
                      transition={spring}
                      className="pointer-events-none absolute top-[11px] left-1/2 h-[34px] w-[122px] -translate-x-1/2 rounded-full bg-black"
                      aria-hidden="true"
                    />
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {!loaded && (
                    <motion.div
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 grid place-items-center bg-paper-2"
                      aria-hidden="true"
                    >
                      <span className="size-7 animate-spin rounded-full border-2 border-line-strong border-t-ink" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
