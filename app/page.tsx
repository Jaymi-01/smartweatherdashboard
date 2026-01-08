"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { getWeatherData, type WeatherData } from "@/lib/weather";
import { getWeatherAdvice } from "@/lib/getAdvice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, Droplets, Thermometer, Wind } from "lucide-react";

export default function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [advice, setAdvice] = useState<string>("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError(null);
    setAdvice("");
    try {
      const data = await getWeatherData(city);
      setWeather(data);
      setAdvice(getWeatherAdvice(data.main.temp, data.weather[0].main));
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
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="flex-1 p-8 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 flex flex-col justify-center items-center md:items-start space-y-2">
                    <p className="text-lg font-medium opacity-80">{weather.name}, {weather.sys.country}</p>
                    <div className="flex items-center gap-4">
                      <span className="text-7xl font-bold">{Math.round(weather.main.temp)}°C</span>
                    </div>
                    <p className="text-xl capitalize">{weather.weather[0].description}</p>
                  </div>
                  <div className="flex-1 p-8 bg-blue-600 text-white flex flex-col justify-center items-center text-center space-y-4">
                    <div className="bg-white/20 p-4 rounded-full">
                      <Cloud className="h-12 w-12" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider opacity-80">Today&apos;s Advice</h3>
                      <p className="text-2xl font-semibold leading-tight">{advice}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-zinc-500">Feels Like</CardTitle>
                  <Thermometer className="h-4 w-4 text-zinc-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.round(weather.main.feels_like)}°C</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-zinc-500">Humidity</CardTitle>
                  <Droplets className="h-4 w-4 text-zinc-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{weather.main.humidity}%</div>
                </CardContent>
              </Card>
              <Card className="sm:col-span-2 lg:col-span-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-zinc-500">Wind Speed</CardTitle>
                  <Wind className="h-4 w-4 text-zinc-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{weather.wind.speed} m/s</div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}