export function getWeatherAdvice(temp: number, weatherCondition: string): string {
  const condition = weatherCondition.toLowerCase();
  
  if (condition.includes("rain") || condition.includes("drizzle")) {
    return "Don't forget an umbrella.";
  }
  
  if (temp < 10) {
    return "Bundle up!";
  }
  
  if (temp > 25) {
    return "Wear shorts.";
  }
  
  return "Enjoy your day!";
}
