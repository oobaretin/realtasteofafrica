"use client"

import { useEffect, useRef } from "react"
import type { Map as LeafletMap } from "leaflet"

import "leaflet/dist/leaflet.css"

import type { Restaurant } from "@/lib/restaurants"

const TEXAS_CENTER: [number, number] = [31.0, -99.0]
const DEFAULT_ZOOM = 6

type BrowseMapProps = {
  restaurants: Restaurant[]
  userPosition?: { lat: number; lng: number } | null
  className?: string
}

export function BrowseMap({ restaurants, userPosition, className = "" }: BrowseMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<LeafletMap | null>(null)

  const mappable = restaurants.filter(
    (r) => r.latitude != null && r.longitude != null
  )

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    let cancelled = false

    void import("leaflet").then((L) => {
      if (cancelled || !containerRef.current) return

      const map = L.map(containerRef.current, {
        scrollWheelZoom: true,
        zoomControl: true,
      }).setView(TEXAS_CENTER, DEFAULT_ZOOM)

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
        maxZoom: 19,
      }).addTo(map)

      const pinIcon = L.divIcon({
        className: "browse-map-pin",
        html: '<span style="display:block;width:14px;height:14px;border-radius:50%;background:#B45309;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35)"></span>',
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      })

      const bounds = L.latLngBounds([])

      for (const r of mappable) {
        const lat = r.latitude!
        const lng = r.longitude!
        bounds.extend([lat, lng])
        const marker = L.marker([lat, lng], { icon: pinIcon })
        marker.bindPopup(
          `<strong>${escapeHtml(r.name)}</strong><br>${escapeHtml(r.city)}, TX<br><a href="/restaurants/${r.slug}">View listing</a>`
        )
        marker.addTo(map)
      }

      if (userPosition) {
        const userIcon = L.divIcon({
          className: "browse-map-user",
          html: '<span style="display:block;width:16px;height:16px;border-radius:50%;background:#2563EB;border:3px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4)"></span>',
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        })
        L.marker([userPosition.lat, userPosition.lng], { icon: userIcon })
          .bindPopup("You are here")
          .addTo(map)
        bounds.extend([userPosition.lat, userPosition.lng])
      }

      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: userPosition ? 13 : 11 })
      }

      mapRef.current = map
    })

    return () => {
      cancelled = true
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps -- init map once

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    void import("leaflet").then((L) => {
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) map.removeLayer(layer)
      })

      const pinIcon = L.divIcon({
        className: "browse-map-pin",
        html: '<span style="display:block;width:14px;height:14px;border-radius:50%;background:#B45309;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35)"></span>',
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      })

      const bounds = L.latLngBounds([])
      const mapped = restaurants.filter(
        (r) => r.latitude != null && r.longitude != null
      )

      for (const r of mapped) {
        const lat = r.latitude!
        const lng = r.longitude!
        bounds.extend([lat, lng])
        L.marker([lat, lng], { icon: pinIcon })
          .bindPopup(
            `<strong>${escapeHtml(r.name)}</strong><br>${escapeHtml(r.city)}, TX<br><a href="/restaurants/${r.slug}">View listing</a>`
          )
          .addTo(map)
      }

      if (userPosition) {
        const userIcon = L.divIcon({
          className: "browse-map-user",
          html: '<span style="display:block;width:16px;height:16px;border-radius:50%;background:#2563EB;border:3px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4)"></span>',
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        })
        L.marker([userPosition.lat, userPosition.lng], { icon: userIcon })
          .bindPopup("You are here")
          .addTo(map)
        bounds.extend([userPosition.lat, userPosition.lng])
      }

      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: userPosition ? 13 : 11 })
      }
    })
  }, [restaurants, userPosition])

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm ${className}`}>
      <div ref={containerRef} className="h-[min(70vh,520px)] w-full min-h-[280px]" />
      {mappable.length < restaurants.length ? (
        <p className="border-t border-slate-200 bg-white px-3 py-2 text-xs text-slate-500">
          Showing {mappable.length} of {restaurants.length} on map (others lack coordinates).
        </p>
      ) : null}
    </div>
  )
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}
