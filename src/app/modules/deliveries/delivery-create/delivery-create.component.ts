import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DeliveryService } from '../../../core/services/delivery.service';
import { DeliveryRequest } from '../../../core/models/delivery.model';
import { AuthService } from '../../../core/services/auth.service';
import { RouteOptimizationService, Waypoint, OptimizedRoute } from '../../../core/services/route-optimization.service';
import { latLng, tileLayer, marker, Marker, Map, icon, polyline, LatLngTuple } from 'leaflet';
import * as L from 'leaflet';
import { User } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';

interface GeoJSONGeometry {
  type: string;
  coordinates: [number, number][];
}

@Component({
  selector: 'app-delivery-create',
  templateUrl: './delivery-create.component.html',
  styleUrls: ['./delivery-create.component.css'],
})
export class DeliveryCreateComponent implements OnInit, AfterViewInit {
  deliveryForm: FormGroup;
  loading = false;
  error = false;
  errorMessage = '';
  optimizedRoute: OptimizedRoute | null = null;
  routeLine: L.Polyline | null = null;
  transporters: User[] = [];

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
  private map: Map | null = null;

  constructor(
    private fb: FormBuilder,
    private deliveryService: DeliveryService,
    private authService: AuthService,
    private router: Router,
    private routeOptimizationService: RouteOptimizationService,
    private userService: UserService
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

    this.deliveryForm = this.fb.group({
      pickupDate: ['', [Validators.required]],
      expectedDeliveryDate: [''],
      beneficiaryId: ['', [Validators.required]],
      donatorId: ['', [Validators.required]],
      transporterId: ['', [Validators.required]],
      pickupLocation: this.fb.group({
        lat: ['', [Validators.required]],
        lng: ['', [Validators.required]]
      }),
      deliveryLocation: this.fb.group({
        lat: ['', [Validators.required]],
        lng: ['', [Validators.required]]
      })
    });
  }

  ngOnInit(): void {
    // Reset form when component initializes
    this.deliveryForm.reset();

    // Load available transporters
    this.userService.getTransporters().subscribe({
      next: (transporters) => {
        console.log('Loaded transporters:', transporters);
        this.transporters = transporters;
      },
      error: (err) => {
        console.error('Error loading transporters:', err);
        this.error = true;
        this.errorMessage = 'Failed to load transporters';
      }
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
    const pickupLocation = this.deliveryForm.get('pickupLocation');
    const deliveryLocation = this.deliveryForm.get('deliveryLocation');

    // If pickup location is not set, set it
    if (!pickupLocation?.get('lat')?.value) {
      pickupLocation?.patchValue({ lat, lng });
      this.addMarker(lat, lng, 'Pickup Location');
    }
    // If delivery location is not set, set it
    else if (!deliveryLocation?.get('lat')?.value) {
      deliveryLocation?.patchValue({ lat, lng });
      this.addMarker(lat, lng, 'Delivery Location');
      // Calculate route when both locations are set
      this.calculateRoute();
    }
  }

  private addMarker(lat: number, lng: number, title: string, color = '#3B82F6'): void {
    if (!this.map) return;

    // Create a custom marker with a colored circle
    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        background-color: ${color};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 0 10px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    const newMarker = marker([lat, lng], { icon: customIcon })
      .addTo(this.map)
      .bindPopup(`
        <div class="text-center p-2">
          <strong class="text-lg">${title}</strong><br>
          <span class="text-gray-600">Lat: ${lat.toFixed(6)}</span><br>
          <span class="text-gray-600">Lng: ${lng.toFixed(6)}</span>
        </div>
      `, {
        className: 'custom-popup'
      });
    this.markers.push(newMarker);
  }

  calculateRoute(): void {
    if (this.deliveryForm.get('pickupLocation')?.valid && this.deliveryForm.get('deliveryLocation')?.valid) {
      const pickupLocation = this.deliveryForm.get('pickupLocation')?.value;
      const deliveryLocation = this.deliveryForm.get('deliveryLocation')?.value;

      const waypoints: Waypoint[] = [
        { lat: pickupLocation.lat, lng: pickupLocation.lng },
        { lat: deliveryLocation.lat, lng: deliveryLocation.lng }
      ];

      this.routeOptimizationService.calculateOptimizedRoute(waypoints)
        .subscribe({
          next: (route) => {
            this.optimizedRoute = route;
            this.drawRoute(route);
          },
          error: (err) => {
            this.error = true;
            this.errorMessage = 'Failed to calculate route: ' + err.message;
          }
        });
    }
  }

  private drawRoute(route: OptimizedRoute): void {
    if (!this.map) return;

    // Remove existing route line if any
    if (this.routeLine) {
      this.map.removeLayer(this.routeLine);
    }

    try {
      // Parse the GeoJSON geometry
      const geometry: GeoJSONGeometry = typeof route.geometry === 'string' ? 
        JSON.parse(route.geometry) as GeoJSONGeometry : 
        (route.geometry as unknown as GeoJSONGeometry);
      
      if (!geometry?.coordinates?.length) {
        throw new Error('No valid route coordinates found');
      }

      // Convert GeoJSON coordinates to Leaflet format [lat, lng]
      const coordinates: LatLngTuple[] = geometry.coordinates.map(coord => [coord[1], coord[0]] as LatLngTuple);
      
      // Create a polyline with the route coordinates
      this.routeLine = polyline(coordinates, {
        color: '#3B82F6',
        weight: 5,
        opacity: 0.7,
        lineJoin: 'round',
        dashArray: '10, 10',
        dashOffset: '0'
      }).addTo(this.map);

      // Add animated dash effect
      let offset = 0;
      setInterval(() => {
        offset = (offset + 1) % 20;
        this.routeLine?.setStyle({ dashOffset: offset.toString() });
      }, 50);

      // Fit the map to show the entire route with padding
      const bounds = this.routeLine.getBounds();
      this.map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 15
      });

      // Add distance markers along the route
      const distance = route.distance / 1000; // Convert to kilometers
      const duration = route.duration / 60; // Convert to minutes
      
      // Add info popup at the midpoint of the route
      const midPoint = this.routeLine.getBounds().getCenter();
      marker(midPoint, {
        icon: L.divIcon({
          className: 'route-info-marker',
          html: `
            <div class="bg-white p-2 rounded-lg shadow-lg text-center">
              <div class="font-bold text-primary-600">${distance.toFixed(1)} km</div>
              <div class="text-sm text-gray-600">${duration.toFixed(0)} min</div>
            </div>
          `,
          iconSize: [100, 40],
          iconAnchor: [50, 20]
        })
      }).addTo(this.map);
    } catch (error) {
      console.error('Error drawing route:', error);
      this.error = true;
      this.errorMessage = 'Failed to draw route on map: ' + (error instanceof Error ? error.message : 'Unknown error');
    }
  }

  onSubmit(): void {
    if (this.deliveryForm.invalid) {
      this.markFormGroupTouched(this.deliveryForm);
      return;
    }

    this.loading = true;
    this.error = false;

    const deliveryRequest: DeliveryRequest = {
      donatorId: this.deliveryForm.value.donatorId,
      beneficiaryId: this.deliveryForm.value.beneficiaryId,
      pickupDate: new Date(this.deliveryForm.value.pickupDate),
      expectedDeliveryDate: this.deliveryForm.value.expectedDeliveryDate
        ? new Date(this.deliveryForm.value.expectedDeliveryDate)
        : undefined,
      transporterId: this.deliveryForm.value.transporterId,
      pickupLocation: this.deliveryForm.value.pickupLocation,
      deliveryLocation: this.deliveryForm.value.deliveryLocation,
      routeInfo: this.optimizedRoute ? {
        distance: this.optimizedRoute.distance,
        duration: this.optimizedRoute.duration,
        path: this.optimizedRoute.geometry ? 
          (typeof this.optimizedRoute.geometry === 'string' ? 
            (JSON.parse(this.optimizedRoute.geometry) as GeoJSONGeometry).coordinates.map(coord => ({ lat: coord[1], lng: coord[0] })) :
            ((this.optimizedRoute.geometry as unknown as GeoJSONGeometry).coordinates.map(coord => ({ lat: coord[1], lng: coord[0] })))) :
          undefined
      } : undefined
    };

    console.log('Creating delivery with request:', deliveryRequest);

    this.deliveryService.createDelivery(deliveryRequest).subscribe({
      next: (response) => {
        console.log('Delivery created successfully:', response);
        this.loading = false;
        // Navigate to the deliveries list and force a refresh
        this.router.navigate(['/dashboard/deliveries'], { 
          queryParams: { refresh: new Date().getTime() } 
        });
      },
      error: (err) => {
        console.error('Error creating delivery:', err);
        this.loading = false;
        this.error = true;
        this.errorMessage = err.error?.message || err.message || 'Failed to create delivery.';
      },
    });
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  get f() {
    return this.deliveryForm.controls;
  }

  cancel(): void {
    this.router.navigate(['/dashboard/deliveries']);
  }

  getCompletedFields(): number {
    let completed = 0;
    const requiredFields = [
      'pickupDate',
      'beneficiaryId',
      'pickupLocation.lat',
      'pickupLocation.lng',
      'deliveryLocation.lat',
      'deliveryLocation.lng'
    ];

    requiredFields.forEach(field => {
      const control = this.deliveryForm.get(field);
      if (control && control.valid) {
        completed++;
      }
    });

    return completed;
  }
}