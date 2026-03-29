import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/auth";

export interface WeatherData {
  condition: "sunny" | "partly-cloudy" | "cloudy" | "rainy" | "stormy" | "snowy" | "foggy" | "unknown";
  temperatureC: number;
  temperatureF: number;
  description: string;
}

interface ApiResponse {
  success: boolean;
  data?: WeatherData;
  error?: string;
}

// WMO weather interpretation codes → our condition enum
function interpretWMO(code: number): { condition: WeatherData["condition"]; description: string } {
  if (code === 0) return { condition: "sunny", description: "Clear sky" };
  if (code <= 2) return { condition: "partly-cloudy", description: "Partly cloudy" };
  if (code === 3) return { condition: "cloudy", description: "Overcast" };
  if (code <= 49) return { condition: "foggy", description: "Fog" };
  if (code <= 57) return { condition: "rainy", description: "Drizzle" };
  if (code <= 67) return { condition: "rainy", description: "Rain" };
  if (code <= 77) return { condition: "snowy", description: "Snow" };
  if (code <= 82) return { condition: "rainy", description: "Rain showers" };
  if (code <= 86) return { condition: "snowy", description: "Snow showers" };
  if (code <= 99) return { condition: "stormy", description: "Thunderstorm" };
  return { condition: "unknown", description: "Unknown" };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  const { lat, lon, date, location } = req.query;

  if (!date || typeof date !== "string") {
    return res.status(400).json({ success: false, error: "date is required" });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ success: false, error: "date must be YYYY-MM-DD" });
  }

  let latNum: number;
  let lonNum: number;

  if (lat && lon && typeof lat === "string" && typeof lon === "string") {
    latNum = parseFloat(lat);
    lonNum = parseFloat(lon);
    if (isNaN(latNum) || isNaN(lonNum) || latNum < -90 || latNum > 90 || lonNum < -180 || lonNum > 180) {
      return res.status(400).json({ success: false, error: "Invalid coordinates" });
    }
  } else if (location && typeof location === "string") {
    // Geocode via Open-Meteo geocoding API
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`;
    const geoRes = await fetch(geoUrl);
    if (!geoRes.ok) {
      return res.status(502).json({ success: false, error: "Geocoding service unavailable" });
    }
    const geoJson = await geoRes.json();
    if (!geoJson?.results?.length) {
      return res.status(404).json({ success: false, error: "Location not found" });
    }
    latNum = geoJson.results[0].latitude as number;
    lonNum = geoJson.results[0].longitude as number;
  } else {
    return res.status(400).json({ success: false, error: "Provide lat+lon or location" });
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latNum}&longitude=${lonNum}&daily=weathercode,temperature_2m_max,temperature_2m_min&start_date=${date}&end_date=${date}&timezone=auto`;
    const response = await fetch(url);

    if (!response.ok) {
      return res.status(502).json({ success: false, error: "Weather service unavailable" });
    }

    const json = await response.json();
    const daily = json?.daily;

    if (!daily || !daily.weathercode?.length) {
      return res.status(404).json({ success: false, error: "No forecast available for this date" });
    }

    const code: number = daily.weathercode[0];
    const maxC: number = daily.temperature_2m_max[0];
    const minC: number = daily.temperature_2m_min[0];
    const avgC = Math.round((maxC + minC) / 2);
    const avgF = Math.round(avgC * 9 / 5 + 32);
    const { condition, description } = interpretWMO(code);

    return res.status(200).json({
      success: true,
      data: {
        condition,
        temperatureC: avgC,
        temperatureF: avgF,
        description,
      },
    });
  } catch {
    return res.status(500).json({ success: false, error: "Failed to fetch weather" });
  }
}
