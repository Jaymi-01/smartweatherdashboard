"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { getWeatherData, type WeatherData } from "@/lib/weather";
import { getWeatherAdvice } from "@/lib/getAdvice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Cloud, 
  Droplets, 
  Thermometer, 
  Wind, 
  Sun, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  CloudDrizzle, 
  CloudFog,
} from "lucide-react";

const WeatherIcon = ({ condition, className }: { condition: string; className?: string }) => {
  switch (condition.toLowerCase()) {
    case "clear":
      return <Sun className={className} />;
    case "clouds":
      return <Cloud className={className} />;
    case "rain":
      return <CloudRain className={className} />;
    case "drizzle":
      return <CloudDrizzle className={className} />;
    case "thunderstorm":
      return <CloudLightning className={className} />;
    case "snow":
      return <CloudSnow className={className} />;
    case "mist":
    case "smoke":
    case "haze":
    case "dust":
    case "fog":
    case "sand":
    case "ash":
    case "squall":
      return <CloudFog className={className} />;
    case "tornado":
      return <Wind className={className} />;
    default:
      return <Cloud className={className} />;
  }
};

const getFormattedDate = () => {
  const date = new Date();
  const dayName = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date);
  const dayNumber = date.getDate();
  const monthName = new Intl.DateTimeFormat("en-US", { month: "long" }).format(date);

  const getOrdinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  };

  return `${dayName}, ${dayNumber}${getOrdinal(dayNumber)} ${monthName}`;
};

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
    <main className="min-h-screen p-4 md:p-8 flex items-center justify-center overflow-x-hidden">
      <div className="max-w-4xl w-full mx-auto space-y-6 bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-xl p-5 md:p-10">
        <header className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white drop-shadow-md">
            Smart Weather Dashboard
          </h1>
          <p className="text-zinc-100 font-medium drop-shadow-sm text-sm md:text-base">
            Real-time weather insights for any city.
          </p>
        </header>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row w-full max-w-md mx-auto items-center gap-2">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
            <Input
              type="text"
              placeholder="Enter city name..."
              className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-white/30 w-full"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={loading}
            />
          </div>
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full sm:w-auto bg-white/20 hover:bg-white/30 text-white border border-white/20 transition-all shadow-lg"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
          </Button>
        </form>

        {error && (
          <div className="max-w-md mx-auto p-4 bg-red-500/20 backdrop-blur-md border border-red-500/30 text-white rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        {weather && (
          <div className="space-y-6">
            <Card className="overflow-hidden border-none bg-transparent shadow-2xl">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="flex-1 p-6 md:p-8 bg-zinc-900/90 text-white flex flex-col justify-center items-center md:items-start space-y-2">
                    <div className="space-y-0.5 text-center md:text-left">
                      <p className="text-xs font-medium opacity-60 uppercase tracking-wider">{getFormattedDate()}</p>
                      <p className="text-xl md:text-2xl font-bold">{weather.name}, {weather.sys.country}</p>
                    </div>
                    <div className="flex items-center gap-4 py-4">
                      <WeatherIcon condition={weather.weather[0].main} className="h-12 w-12 md:h-16 md:w-16" />
                      <span className="text-5xl md:text-7xl font-bold">{Math.round(weather.main.temp)}°C</span>
                    </div>
                    <p className="text-lg md:text-xl capitalize font-medium">{weather.weather[0].description}</p>
                  </div>
                  <div className="flex-1 p-6 md:p-8 bg-blue-600/90 text-white flex flex-col justify-center items-center text-center space-y-4">
                    <div className="bg-white/20 p-3 rounded-full">
                      <WeatherIcon condition={weather.weather[0].main} className="h-10 w-10 md:h-12 md:w-12" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider opacity-80">Today&apos;s Advice</h3>
                      <p className="text-xl md:text-2xl font-semibold leading-tight">{advice}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="bg-white/10 border-white/20 text-white backdrop-blur-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white/70">Feels Like</CardTitle>
                  <Thermometer className="h-4 w-4 text-white/70" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.round(weather.main.feels_like)}°C</div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-white/20 text-white backdrop-blur-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white/70">Humidity</CardTitle>
                  <Droplets className="h-4 w-4 text-white/70" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{weather.main.humidity}%</div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-white/20 text-white backdrop-blur-md sm:col-span-2 lg:col-span-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white/70">Wind Speed</CardTitle>
                  <Wind className="h-4 w-4 text-white/70" />
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