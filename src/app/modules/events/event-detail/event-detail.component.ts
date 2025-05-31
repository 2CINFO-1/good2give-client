import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { WeatherService } from '../../../core/services/weather.service';
import { Event } from '../../../core/models/event.model';
import { HttpClient } from '@angular/common/http';
import { latLng, tileLayer, marker, Marker, Map, icon, divIcon } from 'leaflet';
import * as L from 'leaflet';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css'],
})
export class EventDetailComponent implements OnInit, AfterViewInit {
  event: Event | null = null;
  loading = true;
  error = '';
  weatherData: any = null;
  weatherLoading = false;
  weatherError = '';
  foodSuggestionsLoading = false;
  foodSuggestionsError = '';
  Math = Math; // Make Math available in template

  // Leaflet map options
  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors'
      })
    ],
    zoom: 15,
    center: latLng(36.798041449120824, 10.163262774962625) // Default to the event location
  };
  
  markers: Marker[] = [];
  private map: Map | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private weatherService: WeatherService,
    private http: HttpClient
  ) {
    // Fix marker icon issue
    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
    const iconDefault = icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = iconDefault;
  }

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.loadEvent(eventId);
    }
  }

  ngAfterViewInit(): void {
    // Ensure map is properly initialized after view is ready
    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize();
      }
    }, 100);
  }

  onMapReady(map: Map): void {
    this.map = map;
    // Ensure map is properly sized
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }

  loadEvent(id: string): void {
    this.loading = true;
    this.eventService.getEventById(id).subscribe({
      next: (data: Event) => {
        this.event = data;
        console.log('Event data:', data); // Debug log
      
        // Use the coordinates directly from the event data
        if (data.latitude && data.longitude) {
          this.centerMapOnLocation(data.latitude, data.longitude);
          // Skip weather loading for now since API key is not configured
          // this.loadWeather();
        }
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load event details. Please try again later.';
        this.loading = false;
      },
    });
  }

  private centerMapOnLocation(lat: number, lng: number): void {
    if (!this.map) return;

    // Clear existing markers
    this.markers.forEach(m => m.remove());
    this.markers = [];

    // Create a custom marker with a red circle
    const customIcon = divIcon({
      className: 'custom-marker',
      html: `<div style="
        background-color: #ef4444;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 0 10px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    // Add marker at the location with popup
    const newMarker = marker([lat, lng], { icon: customIcon })
      .addTo(this.map)
      .bindPopup(`
        <div class="text-center p-2">
          <strong class="text-lg">${this.event?.title}</strong><br>
          <span class="text-gray-600">${this.event?.location}</span>
        </div>
      `, {
        className: 'custom-popup'
      })
      .openPopup();

    this.markers.push(newMarker);

    // Center map on the location with a closer zoom
    this.map.setView([lat, lng], 15);
  }

  loadWeather() {
    if (!this.event || typeof this.event.latitude !== 'number' || typeof this.event.longitude !== 'number') {
      this.weatherError = 'Location coordinates not available.';
      return;
    }
    
    this.weatherLoading = true;
    this.weatherError = '';
    this.weatherData = null;

    const eventDate = new Date(this.event.date);
    this.weatherService.getWeatherByLocation(
      this.event.latitude,
      this.event.longitude,
      eventDate.toISOString()
    ).subscribe({
      next: (weatherData: any) => {
        this.weatherData = weatherData;
        this.weatherLoading = false;
      },
      error: (err: any) => {
        console.error('Error loading weather:', err);
        this.weatherError = 'Failed to load weather data.';
        this.weatherLoading = false;
      }
    });
  }

  getFoodSuggestions(event: Event): void {
    if (!event._id) return;
    
    this.foodSuggestionsLoading = true;
    this.foodSuggestionsError = '';
    
    this.eventService.suggestFood(
      event._id
    ).pipe(
      finalize(() => {
        this.foodSuggestionsLoading = false;
      })
    ).subscribe({
      next: () => {},
      error: (err: any) => {
        console.error('Error getting food suggestions:', err);
        this.foodSuggestionsError = 'Failed to load food suggestions';
      }
    });
  }

  goToEditEvent(): void {
    if (this.event) {
      this.router.navigate(['/dashboard/events/edit', this.event._id]);
    }
  }

  goBackToList(): void {
    this.router.navigate(['/dashboard/events']);
  }

  deleteEvent(): void {
    if (this.event && confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(this.event._id).subscribe({
        next: () => {
          this.router.navigate(['/dashboard/events']);
        },
        error: (err: any) => {
          this.error = 'Failed to delete event. Please try again later.';
        },
      });
    }
  }

  formatDate(dateString: string | Date): string {
    const date = dateString instanceof Date ? dateString : new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
