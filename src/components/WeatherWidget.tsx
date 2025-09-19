// components/WeatherWidget.tsx
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, MapPin, Cloud, Sun, CloudRain } from "lucide-react";

interface WeatherData {
  temp: number;
  description: string;
}

const WeatherWidget: React.FC<{ city: string; lat: number; lon: number }> = ({
  city,
  lat,
  lon,
}) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  const API_KEY = "Y2NgDdkl3QXLr1dQVUe3iARwidd5eFH1"; // replace with your actual key

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.tomorrow.io/v4/weather/forecast?location=${lat},${lon}&apikey=${API_KEY}`
        );
        const data = await res.json();

        // Tomorrow.io returns nested timelines, we take the first value
        const values = data?.timelines?.hourly?.[0]?.values;
        setWeather({
          temp: values?.temperature ?? 0,
          description: values?.weatherCode ?? "N/A",
        });
      } catch (err) {
        console.error("Weather fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, [lat, lon]);

  return (
    <Card className="w-full max-w-sm shadow-lg rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg font-bold">
          <MapPin className="w-5 h-5 text-primary" />
          {city}, Jharkhand
        </CardTitle>
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Cloud className="w-8 h-8" />}
      </CardHeader>
      <CardContent className="text-center">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading weather...</p>
        ) : weather ? (
          <>
            <p className="text-4xl font-extrabold">{Math.round(weather.temp)}°C</p>
            <p className="capitalize text-gray-600">{weather.description}</p>
          </>
        ) : (
          <p className="text-sm text-red-500">Failed to fetch weather</p>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
