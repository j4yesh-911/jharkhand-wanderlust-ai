// src/components/DistrictList.tsx
import React, { useState, ChangeEvent } from "react";
import { motion } from "framer-motion";
import districtsData from "@/data/districts";

// Types
interface Place {
  name: string;
  description?: string;
  note?: string;
  image?: string;
  mapUrl?: string;
}

interface District {
  id: string;
  name: string;
  overview: string;
  topPlaces: Place[];
}

export const DistrictList: React.FC = () => {
  const [query, setQuery] = useState<string>("");

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  // Filter districts & places
  const filteredDistricts: District[] = districtsData
    .map((district) => {
      const filteredPlaces = district.topPlaces.filter((place) =>
        place.name.toLowerCase().includes(query.toLowerCase()) ||
        (place.description && place.description.toLowerCase().includes(query.toLowerCase()))
      );

      if (district.name.toLowerCase().includes(query.toLowerCase()) || filteredPlaces.length > 0) {
        return { ...district, topPlaces: filteredPlaces };
      }

      return null;
    })
    .filter((d): d is District => d !== null);

  return (
    <div className="space-y-16">
      {/* Search Bar */}
      <div className="max-w-3xl mx-auto mb-12">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search for districts or destinations..."
          className="w-full px-5 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Districts */}
      {filteredDistricts.length ? (
        filteredDistricts.map((district) => (
          <section key={district.id}>
            <motion.h2
              className="text-3xl font-bold text-gray-900 mb-8 border-l-4 border-emerald-500 pl-3"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {district.name}
            </motion.h2>

            {/* Grid of destinations */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {district.topPlaces.map((place, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition"
                >
                  <img
                    src={place.image || "/images/placeholder.jpg"}
                    alt={place.name}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {place.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">{place.description || place.note}</p>

                    {place.mapUrl && (
                      <a
                        href={place.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-4 py-2 bg-emerald-500 text-white text-sm rounded-lg hover:bg-emerald-600 transition"
                      >
                        View on Map
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        ))
      ) : (
        <p className="text-center text-gray-500 mt-12">
          No districts or destinations match your search.
        </p>
      )}
    </div>
  );
};
