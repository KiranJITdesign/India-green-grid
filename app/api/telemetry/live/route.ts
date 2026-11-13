import { NextRequest, NextResponse } from "next/server";

interface RegionalHubConfig {
  id: string;
  name: string;
  state: string;
  role: string;
  lat: number;
  lon: number;
  baseInstalledMw: number; // Regional RE capacity benchmark
}

const REGIONAL_HUBS: Record<string, RegionalHubConfig> = {
  delhi: {
    id: "delhi",
    name: "New Delhi (CPCB Apex)",
    state: "Delhi NCR",
    role: "National Load Dispatch & CPCB Air Quality Reference",
    lat: 28.6139,
    lon: 77.209,
    baseInstalledMw: 2500,
  },
  rajasthan: {
    id: "rajasthan",
    name: "Jaisalmer & Bhadla Hub",
    state: "Rajasthan",
    role: "Ultra-Mega Solar Parks & Desert Wind Corridors",
    lat: 26.9157,
    lon: 70.9083,
    baseInstalledMw: 22000,
  },
  gujarat: {
    id: "gujarat",
    name: "Khavda & Charanka Hybrid",
    state: "Gujarat",
    role: "World's Largest 30 GW RE Hybrid Energy Park",
    lat: 23.8343,
    lon: 71.2033,
    baseInstalledMw: 25000,
  },
  karnataka: {
    id: "karnataka",
    name: "Pavagada / Bengaluru",
    state: "Karnataka",
    role: "Pavagada Solar Park & Southern Grid Hub",
    lat: 12.9716,
    lon: 77.5946,
    baseInstalledMw: 16500,
  },
  tamilnadu: {
    id: "tamilnadu",
    name: "Muppandal Wind Basin",
    state: "Tamil Nadu",
    role: "India's Apex Wind Energy Evacuation Corridor",
    lat: 8.2588,
    lon: 77.5458,
    baseInstalledMw: 11000,
  },
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const hubKey = (searchParams.get("hub") || "delhi").toLowerCase();
    const hub = REGIONAL_HUBS[hubKey] || REGIONAL_HUBS.delhi;

    let temperature = 28.0;
    let windSpeedKmh = 14.5;
    let cloudCover = 20;
    let aqi = 125;
    let pm25 = 54.0;
    let pm10 = 92.0;
    let isLiveApi = false;

    // Fetch live weather from Open-Meteo (zero auth required, CORS safe)
    try {
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${hub.lat}&longitude=${hub.lon}&current=temperature_2m,wind_speed_10m,cloud_cover`;
      const wRes = await fetch(weatherUrl, { next: { revalidate: 300 } });
      if (wRes.ok) {
        const wData = await wRes.json();
        if (wData?.current) {
          temperature = wData.current.temperature_2m ?? temperature;
          windSpeedKmh = wData.current.wind_speed_10m ?? windSpeedKmh;
          cloudCover = wData.current.cloud_cover ?? cloudCover;
          isLiveApi = true;
        }
      }
    } catch (err) {
      console.warn("Live weather fetch fallback:", err);
    }

    // Fetch live CPCB / OpenAQ equivalent Air Quality
    try {
      const aqUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${hub.lat}&longitude=${hub.lon}&current=pm10,pm2_5,us_aqi`;
      const aqRes = await fetch(aqUrl, { next: { revalidate: 300 } });
      if (aqRes.ok) {
        const aqData = await aqRes.json();
        if (aqData?.current) {
          pm25 = aqData.current.pm2_5 ?? pm25;
          pm10 = aqData.current.pm10 ?? pm10;
          aqi = aqData.current.us_aqi ?? aqi;
        }
      }
    } catch (err) {
      console.warn("Live AQI fetch fallback:", err);
    }

    // 1. Weather-API-Driven Renewable Output Estimations
    // Solar output factor takes into account cloud cover and thermal derating (-0.4%/°C above 25°C)
    const thermalDerating = Math.max(0, temperature - 25) * 0.004;
    const cloudLoss = (cloudCover / 100) * 0.75;
    const solarOutputPercent = Math.max(
      12,
      Math.min(98, Math.round((1 - cloudLoss) * (1 - thermalDerating) * 100))
    );

    // Wind output factor follows cubic power curve (cut-in ~11 km/h, rated ~43 km/h)
    const normalizedWind = Math.min(1, Math.max(0, (windSpeedKmh - 9) / 34));
    const windOutputPercent = Math.max(
      10,
      Math.min(95, Math.round(Math.pow(normalizedWind, 2.5) * 100))
    );

    // Composite Clean Energy Generation Factor
    const compositeOutputFactor = Math.round(solarOutputPercent * 0.65 + windOutputPercent * 0.35);

    // 2. Battery Storage Sizing to Address Intermittency
    // High cloud variability & fluctuating wind require larger BESS buffering to maintain grid stability
    const intermittencyScore = Math.round((cloudCover * 0.6 + Math.abs(windSpeedKmh - 22) * 2));
    let intermittencyRisk: "Low" | "Moderate" | "Elevated" = "Low";
    let recommendedBufferHours = 2.0;
    let recommendedBessRatio = 0.25; // 250 kWh per MW

    if (intermittencyScore > 65) {
      intermittencyRisk = "Elevated";
      recommendedBufferHours = 4.0;
      recommendedBessRatio = 0.5; // 500 kWh per MW
    } else if (intermittencyScore > 35) {
      intermittencyRisk = "Moderate";
      recommendedBufferHours = 3.0;
      recommendedBessRatio = 0.35;
    }

    const regionalBessRequiredMwh = Math.round(hub.baseInstalledMw * recommendedBessRatio);

    // 3. Regional Emissions Avoided & Air Quality (CPCB / OpenAQ Standards)
    // Avoided CO2 benchmark: 0.82 kg CO2 per kWh (0.82 tCO2 / MWh) according to CEA Baseline Database
    const estimatedDailyGenMwh = (hub.baseInstalledMw * (compositeOutputFactor / 100) * 6.5);
    const co2AvoidedTonnesToday = Math.round(estimatedDailyGenMwh * 0.82);

    // Grid Carbon Intensity indicator
    const gridCarbonIntensityGPerKwh = Math.max(
      380,
      Math.round(710 - (compositeOutputFactor / 100) * 280)
    );

    // CPCB AQI Category Classification
    let aqiCategory = "Moderate";
    let aqiColor = "#f59e0b"; // amber-500
    if (aqi <= 50) {
      aqiCategory = "Good";
      aqiColor = "#10b981"; // emerald-500
    } else if (aqi <= 100) {
      aqiCategory = "Satisfactory";
      aqiColor = "#84cc16"; // lime-500
    } else if (aqi <= 200) {
      aqiCategory = "Moderate";
      aqiColor = "#f59e0b"; // amber-500
    } else if (aqi <= 300) {
      aqiCategory = "Poor";
      aqiColor = "#f97316"; // orange-500
    } else {
      aqiCategory = "Very Poor / Severe";
      aqiColor = "#ef4444"; // red-500
    }

    return NextResponse.json({
      success: true,
      isLiveApi,
      hub: {
        id: hub.id,
        name: hub.name,
        state: hub.state,
        role: hub.role,
        installedMw: hub.baseInstalledMw,
      },
      weather: {
        temperatureC: Math.round(temperature * 10) / 10,
        windSpeedKmh: Math.round(windSpeedKmh * 10) / 10,
        cloudCoverPercent: cloudCover,
        condition: cloudCover < 25 ? "Clear Sky / High Insolation" : cloudCover < 60 ? "Partly Cloudy" : "Overcast",
      },
      renewables: {
        solarOutputPercent,
        windOutputPercent,
        compositeOutputFactor,
        statusLabel: compositeOutputFactor > 70 ? "Optimal RE Evacuation" : compositeOutputFactor > 40 ? "Normal Generation" : "Intermittent / Buffering Needed",
      },
      batterySizing: {
        intermittencyRisk,
        recommendedBufferHours,
        recommendedBessRatioMwhPerMw: recommendedBessRatio,
        regionalBessRequiredMwh,
        mitigationStrategy: `BESS buffer of ${recommendedBufferHours}h (${regionalBessRequiredMwh.toLocaleString()} MWh) firms grid frequency against cloud/wind volatility.`,
      },
      airQuality: {
        aqi: Math.round(aqi),
        category: aqiCategory,
        colorHex: aqiColor,
        pm25: Math.round(pm25 * 10) / 10,
        pm10: Math.round(pm10 * 10) / 10,
        standard: "CPCB National Ambient Air Quality Standard (NAAQS)",
      },
      emissions: {
        co2AvoidedTonnesToday,
        gridCarbonIntensityGPerKwh,
        ceaFactorKgPerKwh: 0.82,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to fetch live telemetry" },
      { status: 500 }
    );
  }
}
