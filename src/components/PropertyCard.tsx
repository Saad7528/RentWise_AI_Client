import React from 'react';
import Link from 'next/link';
import { Home, MapPin, Bed, Trash2, CheckCircle, Clock } from 'lucide-react';

export interface PropertyData {
  _id: string;
  title: string;
  description: string;
  rentAmount: number;
  deposit: number;
  category: string;
  bedrooms: number;
  bathrooms: number;
  isBachelorAllowed: boolean;
  address: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  images: string[];
  status: 'PENDING' | 'APPROVED' | 'RENTED' | 'REJECTED';
  contactPhone: string;
  createdAt: string;
}

interface PropertyCardProps {
  property: PropertyData;
  onDelete?: (id: string) => void;
  showAdminControls?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onDelete,
  showAdminControls = false,
}) => {
  const fallbackImage = 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=600&auto=format&fit=crop';
  const displayImage = property.images && property.images.length > 0 ? property.images[0] : fallbackImage;

  // Format price in Bangladeshi Taka
  const formattedPrice = new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 0,
  }).format(property.rentAmount);

  // Shorten description for card previews
  const shortDescription =
    property.description.length > 90
      ? property.description.substring(0, 90).replace(/[#*`_-]/g, '') + '...'
      : property.description.replace(/[#*`_-]/g, '');

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-[435px]">
      {/* Property Image */}
      <div className="relative h-48 w-full bg-slate-100 overflow-hidden group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={displayImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-primary text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
          {property.category}
        </div>
        {property.isBachelorAllowed && (
          <div className="absolute top-3 right-3 bg-secondary text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            Bachelor Ok
          </div>
        )}
      </div>

      {/* Property Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 className="font-semibold text-lg text-foreground line-clamp-1 mb-1 group-hover:text-primary">
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center text-muted text-xs mb-3 gap-1">
            <MapPin className="h-3.5 w-3.5 text-accent shrink-0" />
            <span className="truncate">{property.address}</span>
          </div>

          {/* Short Description */}
          <p className="text-muted text-sm line-clamp-2 mb-4 leading-relaxed">
            {shortDescription}
          </p>

          {/* Amenities details */}
          <div className="flex items-center gap-4 text-xs text-muted font-medium mb-3">
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
              <Bed className="h-3.5 w-3.5 text-primary" />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
              <Home className="h-3.5 w-3.5 text-primary" />
              <span>{property.bathrooms} Baths</span>
            </div>
          </div>
        </div>

        {/* Footer (Price & Action Button) */}
        <div>
          <hr className="border-border mb-3" />
          <div className="flex justify-between items-center">
            <div>
              <span className="text-xs text-muted block leading-none mb-1">Rent / month</span>
              <span className="text-base font-bold text-foreground">{formattedPrice}</span>
            </div>
            
            {showAdminControls && onDelete ? (
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-md font-semibold flex items-center gap-1 ${
                  property.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                  property.status === 'RENTED' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {property.status === 'APPROVED' ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                  {property.status}
                </span>
                <button
                  onClick={() => onDelete(property._id)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors border border-transparent hover:border-red-200"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link
                href={`/rentals/${property._id}`}
                className="bg-primary hover:bg-primary-hover text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm"
              >
                View Details
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
