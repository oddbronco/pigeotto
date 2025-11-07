import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface MapProps {
  latitude: number
  longitude: number
  zoom?: number
}

export function Map({ latitude, longitude, zoom = 6 }: MapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current).setView([latitude, longitude], zoom)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current)

      const icon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })

      markerRef.current = L.marker([latitude, longitude], { icon })
        .addTo(mapRef.current)
        .bindPopup(`Predicted Location<br/>Lat: ${latitude.toFixed(4)}<br/>Lng: ${longitude.toFixed(4)}`)
        .openPopup()
    } else {
      mapRef.current.setView([latitude, longitude], zoom)

      if (markerRef.current) {
        markerRef.current.setLatLng([latitude, longitude])
        markerRef.current.setPopupContent(`Predicted Location<br/>Lat: ${latitude.toFixed(4)}<br/>Lng: ${longitude.toFixed(4)}`)
      }
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        markerRef.current = null
      }
    }
  }, [latitude, longitude, zoom])

  return <div ref={containerRef} className="map-container" />
}
