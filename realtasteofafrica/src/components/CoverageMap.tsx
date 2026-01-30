/**
 * Simple Texas outline with glowing city dots and 180+ counter.
 * Cities: Houston, Dallas, Austin, San Antonio, El Paso, Amarillo.
 */

// Approximate positions for cities on a 200×240 Texas viewBox (lon -106.5 to -93.5, lat 25.8 to 36.5)
const CITY_POINTS = [
  { cx: 171, cy: 151, label: "Houston" },
  { cx: 149, cy: 83, label: "Dallas" },
  { cx: 135, cy: 140, label: "Austin" },
  { cx: 123, cy: 159, label: "San Antonio" },
  { cx: 0, cy: 106, label: "El Paso" },
  { cx: 72, cy: 29, label: "Amarillo" },
] as const

// Simplified Texas outline path (viewBox 0 0 200 240)
const TEXAS_PATH =
  "M 99 0 L 200 0 L 200 240 L 0 240 L 0 105 L 45 28 L 99 0 Z"

export function CoverageMap() {
  return (
    <section
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
      aria-labelledby="coverage-map-heading"
    >
      <h2 id="coverage-map-heading" className="sr-only">
        Coverage map — 180+ locations across Texas
      </h2>
      <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-between lg:gap-12">
        <div className="flex-shrink-0">
          <svg
            viewBox="0 0 200 240"
            className="h-auto w-64 max-w-full text-slate-800 md:w-80"
            aria-hidden
          >
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
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
            {CITY_POINTS.map(({ cx, cy, label }) => (
              <g key={label}>
                <circle
                  cx={cx}
                  cy={cy}
                  r="6"
                  fill="rgb(251, 191, 36)"
                  filter="url(#glow)"
                  className="drop-shadow-lg"
                />
                <circle
                  cx={cx}
                  cy={cy}
                  r="3"
                  fill="rgb(245, 158, 11)"
                  aria-hidden
                />
              </g>
            ))}
          </svg>
        </div>
        <div className="flex flex-col items-center text-center lg:items-end lg:text-right">
          <p
            className="text-4xl font-bold tabular-nums tracking-tight text-amber-600 md:text-5xl lg:text-6xl"
            aria-label="180 plus locations verified"
          >
            180+
          </p>
          <p className="mt-1 text-lg font-semibold text-slate-800 md:text-xl">
            Locations Verified
          </p>
          <p className="mt-2 max-w-sm text-sm text-slate-600">
            From Houston to El Paso, Dallas to the Valley — we track African
            restaurants, food trucks, and markets across the Lone Star State.
          </p>
        </div>
      </div>
    </section>
  )
}
