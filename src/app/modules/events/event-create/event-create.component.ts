import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { Event } from '../../../core/models/event.model';
import { latLng, tileLayer, marker, Marker, Map, icon } from 'leaflet';
import * as L from 'leaflet';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css'],
})
export class EventCreateComponent implements OnInit, AfterViewInit {
  eventForm: FormGroup;
  submitting = false;
  error = '';
  
  // Leaflet map options
  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors'
      })
    ],
    zoom: 13,
    center: latLng(36.8065, 10.1815) // Default to Tunis, Tunisia
  };
  
  markers: Marker[] = [];
  selectedLocation: { lat: number; lng: number; address: string } | null = null;
  private map: Map | null = null;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router
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

    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      objective: ['', [Validators.required, Validators.minLength(10)]],
      date: ['', Validators.required],
      numbre: [1, [Validators.required, Validators.min(1)]],
      location: ['', [Validators.required, Validators.minLength(3)]],
      latitude: [''],
      longitude: ['']
    });
  }

  ngOnInit(): void {
    // Initialize with tomorrow's date as default
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = tomorrow.toISOString().split('T')[0];
    this.eventForm.patchValue({
      date: formattedDate,
    });
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

  onMapClick(e: L.LeafletMouseEvent): void {
    if (!this.map) return;

    const { lat, lng } = e.latlng;
    
    // Clear existing markers
    this.markers.forEach(m => m.remove());
    this.markers = [];
    
    // Add new marker
    const newMarker = marker([lat, lng]).addTo(this.map);
    this.markers.push(newMarker);
    
    // Reverse geocode to get address
    this.reverseGeocode(lat, lng);
  }

  private reverseGeocode(lat: number, lng: number): void {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      .then(response => response.json())
      .then(data => {
        const address = data.display_name;
        this.selectedLocation = { lat, lng, address };
        this.eventForm.patchValue({
          location: address,
          latitude: lat,
          longitude: lng
        });
      })
      .catch(error => {
        console.error('Error reverse geocoding:', error);
        this.error = 'Failed to get address for selected location';
      });
  }

  onSubmit(): void {
    if (this.eventForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.eventForm.controls).forEach((key) => {
        const control = this.eventForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.submitting = true;
    this.error = '';

    const eventData = this.eventForm.value;

    this.eventService.createEvent(eventData).subscribe({
      next: (event: Event) => {
        this.submitting = false;
        this.router.navigate(['/dashboard/events']);
      },
      error: (err: any) => {
        this.error = 'Failed to create event. Please try again later.';
        console.error('Error creating event:', err);
        this.submitting = false;
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/dashboard/events']);
  }

  // Convenience getter for form fields
  get f() {
    return this.eventForm.controls;
  }
}
