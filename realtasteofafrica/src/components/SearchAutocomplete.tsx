"use client"

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react"
import { useRouter } from "next/navigation"

import type { Area } from "@/lib/areas"
import type { Restaurant } from "@/lib/restaurants"
import { getSearchSuggestions, type SearchSuggestion } from "@/lib/searchSuggestions"

type SearchAutocompleteProps = {
  id?: string
  value: string
  onChange: (value: string) => void
  onSubmit?: (value: string) => void
  placeholder?: string
  inputClassName?: string
  restaurants: Restaurant[]
  cuisineTags: string[]
  areas: Area[]
  /** Navigate on pick vs only fill input */
  navigateOnSelect?: boolean
}

export function SearchAutocomplete({
  id: idProp,
  value,
  onChange,
  onSubmit,
  placeholder = "Search name, city, cuisine…",
  inputClassName = "",
  restaurants,
  cuisineTags,
  areas,
  navigateOnSelect = true,
}: SearchAutocompleteProps) {
  const autoId = useId()
  const id = idProp ?? autoId
  const listId = `${id}-suggestions`
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const wrapRef = useRef<HTMLDivElement>(null)

  const suggestions = useMemo(
    () => getSearchSuggestions(value, restaurants, cuisineTags, areas, 8),
    [value, restaurants, cuisineTags, areas]
  )

  useEffect(() => {
    setOpen(value.trim().length >= 2 && suggestions.length > 0)
    setActiveIndex(-1)
  }, [value, suggestions.length])

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [])

  const pick = (s: SearchSuggestion) => {
    setOpen(false)
    if (navigateOnSelect) {
      router.push(s.href)
      return
    }
    onChange(s.label)
    onSubmit?.(s.label)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) {
      if (e.key === "Enter") {
        e.preventDefault()
        onSubmit?.(value)
      }
      return
    }
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((i) => (i + 1) % suggestions.length)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (activeIndex >= 0) pick(suggestions[activeIndex]!)
      else onSubmit?.(value)
    } else if (e.key === "Escape") {
      setOpen(false)
    }
  }

  return (
    <div ref={wrapRef} className="relative min-w-0 flex-1">
      <input
        id={id}
        type="search"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        autoComplete="off"
        value={value}
        placeholder={placeholder}
        className={inputClassName}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => {
          if (suggestions.length > 0 && value.trim().length >= 2) setOpen(true)
        }}
        onKeyDown={handleKeyDown}
      />
      {open ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 top-full z-30 mt-1 max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
        >
          {suggestions.map((s, i) => (
            <li key={s.id} role="option" aria-selected={i === activeIndex}>
              <button
                type="button"
                className={`flex w-full flex-col items-start px-3 py-2.5 text-left text-sm hover:bg-amber-50 ${
                  i === activeIndex ? "bg-amber-50" : ""
                }`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(s)}
              >
                <span className="font-medium text-slate-900">{s.label}</span>
                {s.sublabel ? (
                  <span className="text-xs text-slate-500">{s.sublabel}</span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
