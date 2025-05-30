import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = environment.openWeatherMapApiKey;
  private apiUrl = 'https://api.openweathermap.org/data/2.5';

  constructor(private http: HttpClient) {}

  getWeatherForecast(lat: number, lon: number, date: Date): Observable<any> {
    const timestamp = Math.floor(date.getTime() / 1000);
    return this.http.get(`${this.apiUrl}/forecast`, {
      params: {
        lat: lat.toString(),
        lon: lon.toString(),
        appid: this.apiKey,
        units: 'metric'
      }
    });
  }

  getCoordinatesFromLocation(location: string): Observable<any> {
    return this.http.get(`https://api.openweathermap.org/geo/1.0/direct`, {
      params: {
        q: location,
        limit: '1',
        appid: this.apiKey
      }
    });
  }
} 