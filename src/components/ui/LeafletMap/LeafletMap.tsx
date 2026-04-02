'use client';

import { useEffect, useRef } from 'react';

interface LeafletMapProps {
  lat: number;
  lng: number;
  label: string;
  height?: number;
}

/**
 * Leaflet map via CDN — no npm needed.
 * invalidateSize() fixes tile rendering in CSS Grid layouts.
 * Pattern from adriano-trencin project.
 */
export default function LeafletMap({ lat, lng, label, height = 450 }: LeafletMapProps) {
  const containerRef   = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMapInstance | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapInstanceRef.current) return;

    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.crossOrigin = '';
      document.head.appendChild(link);
    }

    const loadLeaflet = (): Promise<LeafletStatic> => {
      const win = window as unknown as Record<string, unknown>;
      if (win.L) return Promise.resolve(win.L as LeafletStatic);

      return new Promise((resolve) => {
        const existing = document.querySelector('script[src*="leaflet"]');
        if (existing) {
          existing.addEventListener('load', () =>
            resolve((window as unknown as Record<string, unknown>).L as LeafletStatic)
          );
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.crossOrigin = '';
        script.onload = () =>
          resolve((window as unknown as Record<string, unknown>).L as LeafletStatic);
        document.head.appendChild(script);
      });
    };

    loadLeaflet().then((L) => {
      if (!containerRef.current || mapInstanceRef.current) return;

      const map = L.map(containerRef.current, {
        center: [lat, lng],
        zoom: 16,
        zoomControl: true,
        scrollWheelZoom: false,
        dragging: true,
        attributionControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const markerIcon = L.divIcon({
        html: `<svg width="32" height="42" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C7.16 0 0 7.16 0 16c0 12 16 26 16 26s16-14 16-26C32 7.16 24.84 0 16 0z" fill="#8B5E3C"/>
          <circle cx="16" cy="15" r="7" fill="#FAFAF5"/>
        </svg>`,
        className: '',
        iconSize: [32, 42],
        iconAnchor: [16, 42],
        popupAnchor: [0, -38],
      });

      L.marker([lat, lng], { icon: markerIcon })
        .addTo(map)
        .bindPopup(`<strong>${label}</strong>`)
        .openPopup();

      mapInstanceRef.current = map;

      // Fix tile rendering + set aria-label on marker (Lighthouse a11y)
      setTimeout(() => {
        map.invalidateSize();
        containerRef.current?.querySelectorAll('.leaflet-marker-icon').forEach((el) => {
          el.setAttribute('aria-label', label);
          el.setAttribute('role', 'img');
        });
      }, 300);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng]);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height, borderRadius: 'var(--radius-lg)', zIndex: 0 }}
    />
  );
}

// ── Minimal type declarations ──────────────────────────────────────────────

interface LeafletMapInstance {
  remove(): void;
  invalidateSize(): void;
}

interface LeafletMarker {
  addTo(map: unknown): LeafletMarker;
  bindPopup(content: string): LeafletMarker;
  openPopup(): LeafletMarker;
}

interface LeafletTileLayer {
  addTo(map: unknown): LeafletTileLayer;
}

interface LeafletDivIcon {}

interface LeafletStatic {
  map(el: HTMLElement, options: Record<string, unknown>): LeafletMapInstance & Record<string, unknown>;
  tileLayer(url: string, options: Record<string, unknown>): LeafletTileLayer;
  marker(latlng: [number, number], options?: Record<string, unknown>): LeafletMarker;
  divIcon(options: Record<string, unknown>): LeafletDivIcon;
}
