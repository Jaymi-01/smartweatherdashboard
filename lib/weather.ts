export async function getWeatherData(city: string) {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;
  if (!apiKey) {
    throw new Error("OpenWeather API key is not configured");
  }

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${apiKey}&units=metric`
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("City not found. Please check the spelling and try again.");
    }
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch weather data");
  }

  return response.json();
}
