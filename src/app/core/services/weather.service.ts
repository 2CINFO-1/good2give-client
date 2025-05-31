import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiUrl = 'https://api.open-meteo.com/v1';

  constructor(private http: HttpClient) { }

  getWeatherByLocation(lat: number, lon: number, date: string): Observable<any> {
    const targetDate = new Date(date);
    const formattedDate = targetDate.toISOString().split('T')[0];

    return this.http.get(`${this.apiUrl}/forecast`, {
      params: {
        latitude: lat.toString(),
        longitude: lon.toString(),
        daily: 'temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode',
        timezone: 'auto',
        start_date: formattedDate,
        end_date: formattedDate
      }
    }).pipe(
      map((data: any) => {
        // Transform the data to match our UI expectations
        return {
          current: {
            temp: Math.round((data.daily.temperature_2m_max[0] + data.daily.temperature_2m_min[0]) / 2),
            weather: [{
              description: this.getWeatherDescription(data.daily.weathercode[0]),
              icon: this.getWeatherIcon(data.daily.weathercode[0])
            }],
            humidity: data.daily.precipitation_probability_max[0] || 0,
            wind_speed: 0 // Open-Meteo doesn't provide wind speed in the free tier
          }
        };
      })
    );
  }

  private getWeatherDescription(code: number): string {
    const weatherCodes: { [key: number]: string } = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail'
    };
    return weatherCodes[code] || 'Unknown';
  }

  private getWeatherIcon(code: number): string {
    const iconMap: { [key: number]: string } = {
      0: '01d', // Clear sky
      1: '01d', // Mainly clear
      2: '02d', // Partly cloudy
      3: '04d', // Overcast
      45: '50d', // Foggy
      48: '50d', // Depositing rime fog
      51: '09d', // Light drizzle
      53: '09d', // Moderate drizzle
      55: '09d', // Dense drizzle
      61: '10d', // Slight rain
      63: '10d', // Moderate rain
      65: '10d', // Heavy rain
      71: '13d', // Slight snow
      73: '13d', // Moderate snow
      75: '13d', // Heavy snow
      77: '13d', // Snow grains
      80: '09d', // Slight rain showers
      81: '09d', // Moderate rain showers
      82: '09d', // Violent rain showers
      85: '13d', // Slight snow showers
      86: '13d', // Heavy snow showers
      95: '11d', // Thunderstorm
      96: '11d', // Thunderstorm with slight hail
      99: '11d'  // Thunderstorm with heavy hail
    };
    return iconMap[code] || '01d';
  }
} 