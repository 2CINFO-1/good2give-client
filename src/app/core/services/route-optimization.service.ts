import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';

export interface Waypoint {
  lat: number;
  lng: number;
  id?: string;
}

export interface RouteOptimizationOptions {
  profile?: 'driving-car' | 'driving-hgv' | 'cycling-regular' | 'foot-walking';
  preference?: 'fastest' | 'shortest';
  avoid_features?: string[];
}

export interface OptimizedRoute {
  waypoints: Waypoint[];
  distance: number;
  duration: number;
  geometry?: string;
}

interface ORSResponse {
  features: {
    properties: {
      summary: {
        distance: number;
        duration: number;
      }
    };
    geometry: string;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class RouteOptimizationService {
  private baseUrl = 'https://api.openrouteservice.org/v2';

  constructor(private http: HttpClient) {}

  calculateOptimizedRoute(
    waypoints: Waypoint[],
    options: RouteOptimizationOptions = {}
  ): Observable<OptimizedRoute> {
    if (waypoints.length < 2) {
      throw new Error('At least 2 waypoints are required');
    }

    const coordinates = waypoints.map((wp) => [wp.lng, wp.lat]);
    const requestBody = {
      coordinates,
      profile: options.profile || 'driving-car',
      preference: options.preference || 'fastest',
      instructions: true,
      geometry: true,
      format: 'geojson',
      options: options.avoid_features ? { avoid_features: options.avoid_features } : {}
    };

    const headers = new HttpHeaders({
      'Authorization': environment.orsApiKey,
      'Content-Type': 'application/json; charset=utf-8',
      'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8'
    });

    return this.http.post<ORSResponse>(
      `${this.baseUrl}/directions/${requestBody.profile}/geojson`,
      requestBody,
      { headers }
    ).pipe(
      map(response => ({
        waypoints,
        distance: response.features[0].properties.summary.distance,
        duration: response.features[0].properties.summary.duration,
        geometry: response.features[0].geometry
      }))
    );
  }

  optimizeWaypointOrder(
    waypoints: Waypoint[],
    options: RouteOptimizationOptions = {}
  ): Observable<OptimizedRoute> {
    const coordinates = waypoints.map((wp) => [wp.lng, wp.lat]);
    const requestBody = {
      coordinates,
      profile: options.profile || 'driving-car'
    };

    const headers = new HttpHeaders({
      'Authorization': environment.orsApiKey,
      'Content-Type': 'application/json; charset=utf-8',
      'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8'
    });

    return this.http.post<OptimizedRoute>(`${this.baseUrl}/optimization`, requestBody, { headers });
  }
} 