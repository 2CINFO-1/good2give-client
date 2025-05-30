import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { WeatherService } from '../../../core/services/weather.service';
import { Event } from '../../../core/models/event.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css'],
})
export class EventDetailComponent implements OnInit {
  event: Event | null = null;
  loading = true;
  error = '';
  weatherData: any = null;
  weatherLoading = false;
  weatherError = '';
  Math = Math; // Make Math available in template

  lat: string | null = null;
  lon: string | null = null;
  mapUrl: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private weatherService: WeatherService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.loadEvent(id);
      } else {
        this.error = 'Event ID not found';
        this.loading = false;
      }
    });
  }

  loadEvent(id: string): void {
    this.loading = true;
    this.eventService.getEventById(id).subscribe({
      next: (data: Event) => {
        this.event = data;
        console.log('Event location:', data.location); // Debug log
        if (!data.foodSuggestions || data.foodSuggestions.length === 0) {
          this.getFoodSuggestions(data);
        }
        this.geocodeLocation(data.location);
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load event details. Please try again later.';
        this.loading = false;
      },
    });
  }

  geocodeLocation(location: string) {
    this.http.get<any[]>(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`)
      .subscribe(result => {
        console.log('Geocoding result:', result); // Debug log
        if (result.length > 0) {
          this.lat = result[0].lat;
          this.lon = result[0].lon;
          this.mapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${this.lat},${this.lon}&zoom=13&size=600x300&markers=${this.lat},${this.lon},red-pushpin`;
          console.log('Lat:', this.lat, 'Lon:', this.lon); // Debug log
          console.log('Map URL:', this.mapUrl); // Debug log
          this.loadWeather();
        } else {
          this.weatherError = 'Location not found';
        }
      }, err => {
        this.weatherError = 'Failed to get location coordinates';
      });
  }

  loadWeather() {
    if (!this.lat || !this.lon || !this.event) return;
    this.weatherLoading = true;
    this.weatherService.getWeatherForecast(Number(this.lat), Number(this.lon), new Date(this.event.date)).subscribe({
      next: (weatherData: any) => {
        this.weatherData = this.findClosestForecast(weatherData, new Date(this.event!.date));
        this.weatherLoading = false;
      },
      error: (err: any) => {
        this.weatherError = 'Failed to load weather data';
        this.weatherLoading = false;
      }
    });
  }

  findClosestForecast(weatherData: any, targetDate: Date): any {
    const targetTime = targetDate.getTime();
    let closestForecast = weatherData.list[0];
    let minTimeDiff = Math.abs(new Date(weatherData.list[0].dt * 1000).getTime() - targetTime);

    weatherData.list.forEach((forecast: any) => {
      const forecastTime = new Date(forecast.dt * 1000).getTime();
      const timeDiff = Math.abs(forecastTime - targetTime);
      if (timeDiff < minTimeDiff) {
        minTimeDiff = timeDiff;
        closestForecast = forecast;
      }
    });

    return closestForecast;
  }

  getFoodSuggestions(event: Event): void {
    this.eventService.suggestFood(
      event._id,
      event.numbre,
      event.title,
      event.objective
    ).subscribe({
      next: (suggestions: string[]) => {
        if (this.event) {
          this.event.foodSuggestions = suggestions;
        }
      },
      error: (err: any) => {
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
    return date.toLocaleDateString();
  }
}
