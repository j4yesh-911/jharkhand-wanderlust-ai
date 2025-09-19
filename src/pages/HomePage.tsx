import WeatherWidget from "@/components/WeatherWidget";

export default function HomePage() {
  return (
    <div className="grid gap-6 md:grid-cols-3 p-6">
      <WeatherWidget city="Ranchi" lat={23.3441} lon={85.3096} />
      <WeatherWidget city="Jamshedpur" lat={22.8046} lon={86.2029} />
      <WeatherWidget city="Dhanbad" lat={23.7957} lon={86.4304} />
    </div>
  );
}

