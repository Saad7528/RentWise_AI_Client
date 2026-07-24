'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { PropertyData } from './PropertyCard';

// Fix Leaflet marker icons in Next.js
const fixMarkerIcon = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
};

// Custom Red icon for search pin point
const redMarkerIcon = typeof window !== 'undefined' ? L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
}) : null;

interface PropertiesMapProps {
  properties: PropertyData[];
  center?: [number, number];
  zoom?: number;
  pinnedLat?: number | null;
  pinnedLng?: number | null;
  onPinLocation?: (lat: number, lng: number) => void;
  onClearPin?: () => void;
}

// Sub-component to fly map view center
function ChangeMapView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function PropertiesMap({
  properties,
  center = [23.7808875, 90.4228516], // Default Dhaka center
  zoom = 12,
  pinnedLat = null,
  pinnedLng = null,
  onPinLocation,
  onClearPin,
}: PropertiesMapProps) {
  
  useEffect(() => {
    fixMarkerIcon();
  }, []);

  // Compute map center dynamic fallback if properties list is populated
  const dynamicCenter: [number, number] = pinnedLat && pinnedLng
    ? [pinnedLat, pinnedLng]
    : properties.length > 0 
      ? [
          properties[0].location.coordinates[1], // Latitude
          properties[0].location.coordinates[0], // Longitude
        ]
      : center;

  // Custom click capture component
  function MapClickHandler() {
    useMapEvents({
      click(e) {
        if (onPinLocation) {
          const { lat, lng } = e.latlng;
          onPinLocation(lat, lng);
        }
      },
    });
    return null;
  }

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-border shadow-sm relative">
      <MapContainer
        center={dynamicCenter}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full min-h-[350px] lg:min-h-full z-10"
      >
        <ChangeMapView center={dynamicCenter} />
        <MapClickHandler />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Render Pinned Coordinates Search Pin */}
        {pinnedLat && pinnedLng && redMarkerIcon && (
          <Marker position={[pinnedLat, pinnedLng]} icon={redMarkerIcon}>
            <Popup>
              <div className="text-center p-1 space-y-2">
                <p className="text-xs font-bold text-foreground">এখানে পিন করা হয়েছে</p>
                {onClearPin && (
                  <button
                    onClick={onClearPin}
                    className="text-[10px] bg-red-500 hover:bg-red-600 text-white font-bold px-2 py-1 rounded cursor-pointer transition-colors"
                  >
                    পিন মুছুন
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        )}

        {properties.map((property) => {
          const lat = property.location.coordinates[1];
          const lng = property.location.coordinates[0];

          // Skip rendering if coordinates are corrupted
          if (!lat || !lng) return null;

          const displayImage = property.images && property.images.length > 0 
            ? property.images[0] 
            : 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=300';

          return (
            <Marker key={property._id} position={[lat, lng]}>
              <Popup>
                <div className="w-48 text-left space-y-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={displayImage}
                    alt={property.title}
                    className="w-full h-24 object-cover rounded-md border border-border"
                  />
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs text-foreground line-clamp-1 leading-snug">
                      {property.title}
                    </h4>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-muted px-2 py-0.5 rounded font-semibold">
                      {property.category}
                    </span>
                    <div className="flex justify-between items-center pt-1.5 border-t border-border">
                      <span className="font-bold text-xs text-foreground">
                        ৳{property.rentAmount.toLocaleString()}
                      </span>
                      <Link
                        href={`/rentals/${property._id}`}
                        className="text-[10px] font-bold text-primary hover:underline"
                      >
                        Details &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      <div className="absolute bottom-2 left-2 z-20 bg-card/90 backdrop-blur px-2.5 py-1.5 rounded-lg border border-border text-[9px] font-semibold text-muted max-w-[200px]">
        ম্যাপে ক্লিক করে যেকোনো জায়গায় পিন ড্রপ করে ওই এলাকার বাসা খুঁজুন
      </div>
    </div>
  );
}
