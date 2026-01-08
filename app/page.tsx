"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { getWeatherData, type WeatherData } from "@/lib/weather";

export default function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await getWeatherData(city);
      setWeather(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Smart Weather Dashboard
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Real-time weather insights for any city.
          </p>
        </header>

        <form onSubmit={handleSearch} className="flex w-full max-w-md mx-auto items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              type="text"
              placeholder="Enter city name..."
              className="pl-9"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={loading}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
          </Button>
        </form>

        {error && (
          <div className="max-w-md mx-auto p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        {weather && (
          <div className="max-w-md mx-auto p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm space-y-2">
            <h2 className="text-xl font-semibold">Verification Dump:</h2>
            <p><span className="font-bold">City:</span> {weather.name}</p>
            <p><span className="font-bold">Temperature:</span> {Math.round(weather.main.temp)}°C</p>
            <p><span className="font-bold">Description:</span> {weather.weather[0].description}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Weather data cards will go here */}
        </div>
      </div>
    </main>
  );
}