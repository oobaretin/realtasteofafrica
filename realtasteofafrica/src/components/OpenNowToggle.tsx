"use client"

export function OpenNowToggle({
  checked,
  onChange,
  variant = "card",
}: {
  checked: boolean
  onChange: (value: boolean) => void
  /** "card" = full widget with helper text; "inline" = switch + label only for action bar */
  variant?: "card" | "inline"
}) {
  const switchEl = (
    <button
      id={variant === "inline" ? "open-now-only-bar" : "open-now-only"}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 shrink-0 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 ${
        checked ? "bg-green-600" : "bg-slate-200"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-6 w-6 translate-y-0.5 rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  )

  if (variant === "inline") {
    return (
      <div className="flex items-center gap-2">
        <label
          htmlFor="open-now-only-bar"
          className="text-sm font-medium text-slate-700 whitespace-nowrap"
        >
          Open Now
        </label>
        {switchEl}
      </div>
    )
  }

  return (
    <div className="grid gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <label
          htmlFor="open-now-only"
          className="text-sm font-semibold text-slate-900"
        >
          Open Now Only
        </label>
        {switchEl}
      </div>
      {checked ? (
        <p className="text-xs text-slate-500">
          Showing restaurants open right now in Texas.
        </p>
      ) : null}
    </div>
  )
}
