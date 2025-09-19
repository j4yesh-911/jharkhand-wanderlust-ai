// src/components/PlaceModal.tsx
import React from "react";
import { Place } from "@/data/districts";

interface PlaceModalProps {
  place: Place | null;
  onClose: () => void;
}

export const PlaceModal: React.FC<PlaceModalProps> = ({ place, onClose }) => {
  if (!place) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-lg">
        <div className="relative">
          <img
            src={place.image || "https://via.placeholder.com/800x500.png?text=No+Image"}
            alt={place.name}
            className="w-full h-64 object-cover"
            onError={(e) => {
              e.currentTarget.src =
                "https://via.placeholder.com/800x500.png?text=Image+Not+Available";
            }}
          />
          <button
            className="absolute top-3 right-3 bg-white px-3 py-1 rounded-lg shadow"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-3">{place.name}</h2>
          <p className="text-gray-700 mb-4">{place.description}</p>

          {place.mapUrl && (
            <a
              href={place.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              View on Map
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
