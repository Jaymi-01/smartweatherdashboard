"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { getWeatherData, getForecastData, type WeatherData, type ForecastData } from "@/lib/weather";
import { getWeatherAdvice } from "@/lib/getAdvice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
  CalendarDays
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

const getFormattedDate = (dateObj?: Date) => {
  const date = dateObj || new Date();
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
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [advice, setAdvice] = useState<string>("");
  const [isImperial, setIsImperial] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const addToRecentSearches = (city: string) => {
    setRecentSearches((prev) => {
      const newSearches = [city, ...prev.filter((c) => c.toLowerCase() !== city.toLowerCase())].slice(0, 5);
      localStorage.setItem("recentSearches", JSON.stringify(newSearches));
      return newSearches;
    });
  };

  const handleSearch = async (e: React.FormEvent | string) => {
    const cityName = typeof e === "string" ? e : city;
    if (typeof e !== "string") e.preventDefault();
    if (!cityName.trim()) return;
    
    // If triggered by click, update input
    if (typeof e === "string") setCity(cityName);

    setLoading(true);
    setError(null);
    setAdvice("");
    setForecast(null);
    try {
      const [weatherData, forecastData] = await Promise.all([
        getWeatherData(cityName),
        getForecastData(cityName)
      ]);
      setWeather(weatherData);
      setForecast(forecastData);
      setAdvice(getWeatherAdvice(weatherData.main.temp, weatherData.weather[0].main));
      addToRecentSearches(weatherData.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  const convertTemp = (temp: number) => {
    if (isImperial) {
      return Math.round((temp * 9) / 5 + 32);
    }
    return Math.round(temp);
  };

  const convertSpeed = (speed: number) => {
    if (isImperial) {
      return (speed * 2.237).toFixed(1);
    }
    return speed.toFixed(1);
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

        <div className="flex flex-col gap-4">
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

          <div className="flex items-center justify-center gap-2 text-white">
            <Label htmlFor="unit-toggle" className="text-sm font-medium cursor-pointer">°C</Label>
            <Switch 
              id="unit-toggle" 
              checked={isImperial}
              onCheckedChange={setIsImperial}
              className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-zinc-600"
            />
            <Label htmlFor="unit-toggle" className="text-sm font-medium cursor-pointer">°F</Label>
          </div>

          {recentSearches.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              <span className="text-sm text-white/60 font-medium py-1">Recent:</span>
              {recentSearches.map((search) => (
                <button
                  key={search}
                  onClick={() => handleSearch(search)}
                  className="px-3 py-1 text-xs font-medium text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="max-w-md mx-auto p-4 bg-red-500/20 backdrop-blur-md border border-red-500/30 text-white rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        {loading && !weather && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-white/80" />
            <p className="text-white/60 font-medium animate-pulse">Fetching weather data...</p>
          </div>
        )}

        {weather && (
          <div className={`space-y-6 ${loading ? "opacity-50 pointer-events-none transition-opacity" : ""}`}>
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
                      <span className="text-5xl md:text-7xl font-bold">
                        {convertTemp(weather.main.temp)}°{isImperial ? "F" : "C"}
                      </span>
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
                  <div className="text-2xl font-bold">
                    {convertTemp(weather.main.feels_like)}°{isImperial ? "F" : "C"}
                  </div>
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
                  <div className="text-2xl font-bold">
                    {convertSpeed(weather.wind.speed)} {isImperial ? "mph" : "m/s"}
                  </div>
                </CardContent>
              </Card>
            </div>

            {forecast && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <CalendarDays className="h-6 w-6" />
                  5-Day Forecast
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {forecast.list
                    .filter((_, index) => index % 8 === 0)
                    .slice(0, 5)
                    .map((day) => (
                      <Card key={day.dt} className="bg-white/10 border-white/20 text-white backdrop-blur-md">
                        <CardContent className="flex flex-col items-center justify-center p-4 gap-2 text-center">
                          <p className="text-sm font-medium opacity-80">
                            {new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(new Date(day.dt * 1000))}
                          </p>
                          <WeatherIcon condition={day.weather[0].main} className="h-8 w-8" />
                          <p className="text-xl font-bold">
                            {convertTemp(day.main.temp)}°{isImperial ? "F" : "C"}
                          </p>
                          <p className="text-xs opacity-60 capitalize">{day.weather[0].description}</p>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}