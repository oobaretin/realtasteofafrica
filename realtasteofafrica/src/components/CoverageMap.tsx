/**
 * Texas outline with hotspot markers; clickable regions link to Browse with area pre-filtered.
 * Pins use deep orange/gold for "Taste of Africa" brand.
 */

import { RESTAURANTS } from "@/lib/restaurants"

// Hotspot: label, position, areaSlug for /restaurants?area=
const HOTSPOTS = [
  { cx: 171, cy: 151, label: "Houston", areaSlug: "houston" },
  { cx: 149, cy: 83, label: "Dallas", areaSlug: "dfw" },
  { cx: 135, cy: 140, label: "Austin", areaSlug: "austin" },
  { cx: 123, cy: 159, label: "San Antonio", areaSlug: "san-antonio" },
  { cx: 0, cy: 106, label: "El Paso", areaSlug: "el-paso" },
  { cx: 72, cy: 29, label: "West Texas", areaSlug: "west-texas" },
] as const

// Simplified Texas outline path (viewBox 0 0 200 240)
const TEXAS_PATH =
  "M 99 0 L 200 0 L 200 240 L 0 240 L 0 105 L 45 28 L 99 0 Z"

// Deep orange / gold for pins (Taste of Africa accent)
const PIN_COLOR = "#B45309"
const PIN_INNER = "#92400E"

export function CoverageMap() {
  return (
    <section
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
      aria-labelledby="coverage-map-heading"
    >
      <h2 id="coverage-map-heading" className="sr-only">
        Coverage map — 175+ locations across Texas
      </h2>
      <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-between lg:gap-12">
        <div className="flex-shrink-0">
          <svg
            viewBox="0 0 200 240"
            className="h-auto w-64 max-w-full text-slate-800 md:w-80"
            aria-hidden
          >
            <defs>
              <filter id="coverage-map-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient
                id="texas-fill"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="rgb(241, 245, 249)" />
                <stop offset="100%" stopColor="rgb(226, 232, 240)" />
              </linearGradient>
            </defs>
            <path
              d={TEXAS_PATH}
              fill="url(#texas-fill)"
              stroke="rgb(148, 163, 184)"
              strokeWidth="1.5"
              className="text-slate-300"
            />
            {HOTSPOTS.map(({ cx, cy, label, areaSlug }) => (
              <g key={areaSlug}>
                <a
                  href={`/restaurants?area=${areaSlug}`}
                  aria-label={`Browse ${label} area`}
                  className="cursor-pointer"
                >
                  <circle
                    cx={cx}
                    cy={cy}
                    r="8"
                    fill="transparent"
                    className="transition-opacity hover:opacity-20"
                  />
                  <circle
                    cx={cx}
                    cy={cy}
                    r="6"
                    fill={PIN_COLOR}
                    filter="url(#coverage-map-glow)"
                    className="drop-shadow-lg"
                  />
                  <circle
                    cx={cx}
                    cy={cy}
                    r="3"
                    fill={PIN_INNER}
                    aria-hidden
                  />
                </a>
              </g>
            ))}
          </svg>
        </div>
        <div className="flex flex-col items-center text-center lg:items-end lg:text-right">
          <p
            className="text-4xl font-bold tabular-nums tracking-tight text-amber-700 md:text-5xl lg:text-6xl"
            aria-label={`${RESTAURANTS.length} plus verified locations`}
          >
            {RESTAURANTS.length}+
          </p>
          <p className="mt-1 text-lg font-semibold text-slate-800 md:text-xl">
            Verified Locations
          </p>
          <p className="mt-2 max-w-sm text-sm text-slate-600">
            The most accurate and up-to-date directory of African restaurants,
            trucks, and markets across the Lone Star State.
          </p>
          <span className="mt-4 inline-block text-xs text-slate-500">
            Data Integrity · Last Statewide Audit: January 2026
          </span>
        </div>
      </div>
    </section>
  )
}
