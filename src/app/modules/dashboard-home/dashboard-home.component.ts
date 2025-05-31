import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth.service';
import { UserStateService } from '../../core/services/user-state.service';
import { NavigationService } from '../../core/services/navigation.service';
import { ProductService } from '../../core/services/product.service';
import { StockService } from '../../core/services/stock.service';
import { DeliveryService } from '../../core/services/delivery.service';
import { CollecteService } from '../../core/services/collecte.service';
import { Product } from '../../core/models/product.model';
import { Delivery, DeliveryStatus } from '../../core/models/delivery.model';
import { Collecte, CollecteStatus } from '../../core/models/collecte.model';
import { Chart, registerables } from 'chart.js';
import { UserRole } from '../../core/models/user.model';
import { Subject, takeUntil } from 'rxjs';

// Enregistrer tous les composants de Chart.js
Chart.register(...registerables);

interface ProductStats {
  totalProducts: number;
  availableProducts: number;
  categoriesCount: number;
  lowStockProducts: number;
  categoryDistribution: {
    name: string;
    count: number;
  }[];
}

interface DeliveryStats {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  averageTime: number;
  onTimeDelivery: number;
  lateDeliveries: number;
  topLocations: { location: string; count: number }[];
  recentDeliveries: {
    id: string;
    status: DeliveryStatus;
    date: string;
    location: string;
  }[];
}

interface CollectionStats {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  averageItems: number;
  topCategories: { category: string; count: number }[];
  recentCollections: {
    id: string;
    status: CollecteStatus;
    date: string;
    title: string;
    location: string;
  }[];
}

type RoleSpecificStats = Record<string, {
  title: string;
  stats: Record<string, number>;
  features: string[];
}>;

interface Feature {
  name: string;
  route: string;
  icon: string;
}

type RoleSpecificFeatures = Record<UserRole, Feature[]>;

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss'],
})
export class DashboardHomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('categoryChart') categoryChartRef!: ElementRef;
  @ViewChild('productBarChart') productBarChartRef!: ElementRef;
  @ViewChild('deliveryChart') deliveryChartRef!: ElementRef;
  @ViewChild('collectionChart') collectionChartRef!: ElementRef;

  private categoryChart: Chart | null = null;
  private productBarChart: Chart | null = null;
  private deliveryChart: Chart | null = null;
  private collectionChart: Chart | null = null;

  stats = {
    deliveries: 0,
    collections: 0,
    products: 0,
    events: 0,
  };

  deliveryStats: DeliveryStats = {
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    averageTime: 0,
    onTimeDelivery: 0,
    lateDeliveries: 0,
    topLocations: [],
    recentDeliveries: []
  };

  collectionStats: CollectionStats = {
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    averageItems: 0,
    topCategories: [],
    recentCollections: []
  };

  isLoading = true;
  currentUserRole: UserRole | null = null;
  roleSpecificStats: RoleSpecificStats = {
    [UserRole.ADMIN]: {
      title: 'Admin Dashboard',
      stats: {
        totalUsers: 0,
        activeDonations: 0,
        pendingApprovals: 0,
        systemHealth: 0
      },
      features: [
        'User Management',
        'System Configuration',
        'Analytics Overview',
        'Approval Management'
      ]
    },
    [UserRole.DONATOR]: {
      title: 'Donator Dashboard',
      stats: {
        totalDonations: 0,
        activeDonations: 0,
        impactScore: 0,
        upcomingEvents: 0
      },
      features: [
        'Donation History',
        'Impact Tracking',
        'Event Calendar',
        'Tax Documents'
      ]
    },
    [UserRole.BENEFICIARY]: {
      title: 'Beneficiary Dashboard',
      stats: {
        receivedDonations: 0,
        pendingRequests: 0,
        availableItems: 0,
        upcomingDeliveries: 0
      },
      features: [
        'Request Management',
        'Inventory Overview',
        'Delivery Tracking',
        'Impact Reports'
      ]
    },
    [UserRole.TRANSPORTER]: {
      title: 'Transporter Dashboard',
      stats: {
        activeDeliveries: 0,
        completedDeliveries: 0,
        pendingPickups: 0,
        routeEfficiency: 0
      },
      features: [
        'Delivery Management',
        'Route Planning',
        'Pickup Scheduling',
        'Performance Metrics'
      ]
    },
    [UserRole.INSPECTOR]: {
      title: 'Inspector Dashboard',
      stats: {
        pendingInspections: 0,
        completedInspections: 0,
        qualityScore: 0,
        complianceRate: 0
      },
      features: [
        'Inspection Queue',
        'Quality Reports',
        'Compliance Tracking',
        'Documentation'
      ]
    }
  };

  productStats: ProductStats = {
    totalProducts: 0,
    availableProducts: 0,
    categoriesCount: 0,
    lowStockProducts: 0,
    categoryDistribution: []
  };

  roleFeatures: RoleSpecificFeatures = {
    [UserRole.ADMIN]: [
      { name: 'User Management', route: '/dashboard/settings', icon: 'users' },
      { name: 'System Configuration', route: '/dashboard/settings', icon: 'settings' },
      { name: 'Analytics Overview', route: '/dashboard/home', icon: 'chart' },
      { name: 'Approval Management', route: '/dashboard/products', icon: 'check' }
    ],
    [UserRole.DONATOR]: [
      { name: 'Donation History', route: '/dashboard/collectes', icon: 'history' },
      { name: 'Impact Tracking', route: '/dashboard/home', icon: 'chart' },
      { name: 'Event Calendar', route: '/dashboard/events', icon: 'calendar' },
      { name: 'Tax Documents', route: '/dashboard/settings', icon: 'document' }
    ],
    [UserRole.BENEFICIARY]: [
      { name: 'Request Management', route: '/dashboard/reclamations', icon: 'request' },
      { name: 'Inventory Overview', route: '/dashboard/products', icon: 'box' },
      { name: 'Delivery Tracking', route: '/dashboard/deliveries', icon: 'truck' },
      { name: 'Impact Reports', route: '/dashboard/home', icon: 'report' }
    ],
    [UserRole.TRANSPORTER]: [
      { name: 'Delivery Management', route: '/dashboard/deliveries', icon: 'truck' },
      { name: 'Route Planning', route: '/dashboard/deliveries', icon: 'map' },
      { name: 'Pickup Scheduling', route: '/dashboard/collectes', icon: 'calendar' },
      { name: 'Performance Metrics', route: '/dashboard/home', icon: 'chart' }
    ],
    [UserRole.INSPECTOR]: [
      { name: 'Inspection Queue', route: '/dashboard/inspection', icon: 'list' },
      { name: 'Quality Reports', route: '/dashboard/products', icon: 'report' },
      { name: 'Compliance Tracking', route: '/dashboard/inspection', icon: 'check' },
      { name: 'Documentation', route: '/dashboard/settings', icon: 'document' }
    ]
  };

  // Make UserRole accessible in template
  UserRole = UserRole;
  DeliveryStatus = DeliveryStatus;
  CollecteStatus = CollecteStatus;

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService,
    private userState: UserStateService,
    private navigationService: NavigationService,
    private productService: ProductService,
    private stockService: StockService,
    private deliveryService: DeliveryService,
    private collecteService: CollecteService
  ) {}

  ngOnInit(): void {
    try {
      // Check email verification first
      if (
        !this.navigationService.checkEmailVerificationForRoute(
          '/dashboard/home'
        )
      ) {
        return; // Stop initialization if email verification failed
      }

      // Get current user role
      const user = this.userState.getCurrentUser();
      if (!user) {
        this.handleAccessError('No user found. Please log in to access the dashboard.');
        return;
      }

      this.currentUserRole = user.role;

      // Check if user has access to dashboard
      if (!this.hasDashboardAccess()) {
        this.handleAccessError(`Access denied. Your role (${user.role}) does not have permission to access the dashboard.`);
        return;
      }

      // Load role-specific data
      this.loadRoleSpecificData();

      // Load common dashboard data
      this.loadCommonDashboardData();

      // Load delivery and collection data
      this.loadDeliveryAndCollectionData();
    } catch (error) {
      console.error('DashboardHomeComponent - Error in ngOnInit:', error);
      this.isLoading = false;
      this.toastr.error('An unexpected error occurred while loading the dashboard');
    }
  }

  private handleAccessError(message: string): void {
    this.toastr.error(message);
    this.router.navigate(['/']);
  }

  private hasDashboardAccess(): boolean {
    const user = this.userState.getCurrentUser();
    if (!user) return false;

    // All roles now have access to the dashboard, but with different views
    return true;
  }

  private loadRoleSpecificData(): void {
    if (!this.currentUserRole) return;

    // Simulate loading role-specific data
    setTimeout(() => {
      const roleStats = this.roleSpecificStats[this.currentUserRole!];
      if (roleStats) {
        // Update stats based on role
        Object.keys(roleStats.stats).forEach(key => {
          roleStats.stats[key] = Math.floor(Math.random() * 100); // Simulated data
        });
      }
    }, 1000);
  }

  private loadCommonDashboardData(): void {
    // Simulate loading common dashboard statistics
    setTimeout(() => {
      this.stats = {
        deliveries: 24,
        collections: 18,
        products: 156,
        events: 12,
      };
      this.isLoading = false;
    }, 1000);

    this.loadProductStats();
  }

  private loadDeliveryAndCollectionData(): void {
    // Load deliveries
    this.deliveryService.getAllDeliveries()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (deliveries: Delivery[]) => {
          this.processDeliveryData(deliveries);
          this.initializeDeliveryChart();
        },
        error: (error: Error) => {
          console.error('Error loading deliveries:', error);
          this.toastr.error('Failed to load delivery data');
        }
      });

    // Load collections
    this.collecteService.getAllCollectes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (collections: Collecte[]) => {
          this.processCollectionData(collections);
          this.initializeCollectionChart();
        },
        error: (error: Error) => {
          console.error('Error loading collections:', error);
          this.toastr.error('Failed to load collection data');
        }
      });
  }

  private processDeliveryData(deliveries: Delivery[]): void {
    // Calculate delivery statistics
    const total = deliveries.length;
    const completed = deliveries.filter(d => d.status === DeliveryStatus.DELIVERED).length;
    const inProgress = deliveries.filter(d => d.status === DeliveryStatus.IN_PROGRESS).length;
    const pending = deliveries.filter(d => d.status === DeliveryStatus.PENDING).length;

    // Calculate average delivery time
    const completedDeliveries = deliveries.filter(d => d.status === DeliveryStatus.DELIVERED);
    const totalTime = completedDeliveries.reduce((acc, delivery) => {
      const pickupDate = delivery.pickupDate ? new Date(delivery.pickupDate) : null;
      const expectedDate = delivery.expectedDeliveryDate ? new Date(delivery.expectedDeliveryDate) : null;
      if (pickupDate && expectedDate) {
        return acc + (expectedDate.getTime() - pickupDate.getTime());
      }
      return acc;
    }, 0);
    const averageTime = completedDeliveries.length > 0 ? totalTime / completedDeliveries.length / (1000 * 60 * 60) : 0;

    // Calculate on-time and late deliveries
    const onTimeDeliveries = completedDeliveries.filter(d => {
      const pickupDate = d.pickupDate ? new Date(d.pickupDate) : null;
      const expectedDate = d.expectedDeliveryDate ? new Date(d.expectedDeliveryDate) : null;
      if (pickupDate && expectedDate) {
        return expectedDate >= pickupDate;
      }
      return false;
    }).length;

    // Get location distribution
    const locationCount = deliveries.reduce((acc, delivery) => {
      const location = typeof delivery.beneficiary === 'string' ? delivery.beneficiary : 'Unknown';
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topLocations = Object.entries(locationCount)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // Get recent deliveries
    const recentDeliveries = deliveries
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 5)
      .map(delivery => ({
        id: delivery._id,
        status: delivery.status,
        date: delivery.createdAt ? new Date(delivery.createdAt).toLocaleDateString() : 'N/A',
        location: typeof delivery.beneficiary === 'string' ? delivery.beneficiary : 
                 delivery.beneficiary?.name || 'Unknown Beneficiary'
      }));

    this.deliveryStats = {
      total,
      completed,
      inProgress,
      pending,
      averageTime,
      onTimeDelivery: onTimeDeliveries,
      lateDeliveries: completed - onTimeDeliveries,
      topLocations,
      recentDeliveries
    };
  }

  private processCollectionData(collections: Collecte[]): void {
    // Calculate collection statistics
    const total = collections.length;
    const completed = collections.filter(c => c.status === CollecteStatus.COMPLETED).length;
    const inProgress = collections.filter(c => c.status === CollecteStatus.IN_PROGRESS).length;
    const pending = collections.filter(c => c.status === CollecteStatus.PENDING).length;

    // Get category distribution based on location
    const categoryCount = collections.reduce((acc, collection) => {
      const category = collection.location || 'Uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topCategories = Object.entries(categoryCount)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // Get recent collections
    const recentCollections = collections
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 5)
      .map(collection => ({
        id: collection._id,
        status: collection.status,
        date: collection.createdAt ? new Date(collection.createdAt).toLocaleDateString() : 'N/A',
        title: collection.title || 'Untitled Collection',
        location: collection.location || 'No Location'
      }));

    this.collectionStats = {
      total,
      completed,
      inProgress,
      pending,
      averageItems: 0, // Not available in the model
      topCategories,
      recentCollections
    };
  }

  private initializeDeliveryChart(): void {
    if (this.deliveryChartRef) {
      const ctx = this.deliveryChartRef.nativeElement.getContext('2d');

      if (this.deliveryChart) {
        this.deliveryChart.destroy();
      }

      // Get category distribution from deliveries
      const categoryData = this.deliveryStats.topLocations.map(loc => ({
        name: loc.location,
        count: loc.count
      }));

      this.deliveryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: categoryData.map(cat => cat.name),
          datasets: [{
            label: 'Deliveries by Category',
            data: categoryData.map(cat => cat.count),
            backgroundColor: [
              '#3B82F6', // blue-500
              '#10B981', // green-500
              '#8B5CF6', // purple-500
              '#F59E0B', // yellow-500
              '#EF4444', // red-500
              '#EC4899', // pink-500
            ],
            borderWidth: 1,
            borderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                padding: 20,
                font: {
                  size: 12
                }
              }
            },
            title: {
              display: true,
              text: 'Delivery Categories Distribution',
              font: {
                size: 16,
                weight: 'bold'
              },
              padding: {
                top: 10,
                bottom: 20
              }
            }
          }
        }
      });
    }
  }

  private initializeCollectionChart(): void {
    if (this.collectionChartRef) {
      const ctx = this.collectionChartRef.nativeElement.getContext('2d');

      if (this.collectionChart) {
        this.collectionChart.destroy();
      }

      // Get category distribution from collections
      const categoryData = this.collectionStats.topCategories.map(cat => ({
        name: cat.category,
        count: cat.count
      }));

      this.collectionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: categoryData.map(cat => cat.name),
          datasets: [{
            label: 'Collections by Category',
            data: categoryData.map(cat => cat.count),
            backgroundColor: [
              '#3B82F6', // blue-500
              '#10B981', // green-500
              '#8B5CF6', // purple-500
              '#F59E0B', // yellow-500
              '#EF4444', // red-500
              '#EC4899', // pink-500
            ],
            borderWidth: 1,
            borderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                padding: 20,
                font: {
                  size: 12
                }
              }
            },
            title: {
              display: true,
              text: 'Collection Categories Distribution',
              font: {
                size: 16,
                weight: 'bold'
              },
              padding: {
                top: 10,
                bottom: 20
              }
            }
          }
        }
      });
    }
  }

  ngAfterViewInit() {
    this.initializeCharts();
  }

  private initializeCharts() {
    this.initializeCategoryChart();
    this.initializeProductBarChart();
  }

  private initializeCategoryChart() {
    if (this.categoryChartRef && this.productStats.categoryDistribution.length > 0) {
      const ctx = this.categoryChartRef.nativeElement.getContext('2d');

      if (this.categoryChart) {
        this.categoryChart.destroy();
      }

      this.categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: this.productStats.categoryDistribution.map(cat => cat.name),
          datasets: [{
            data: this.productStats.categoryDistribution.map(cat => cat.count),
            backgroundColor: [
              '#3B82F6', // blue-500
              '#10B981', // green-500
              '#8B5CF6', // purple-500
              '#F59E0B', // yellow-500
              '#EF4444', // red-500
              '#EC4899', // pink-500
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                padding: 20,
                font: {
                  size: 12
                }
              }
            },
            title: {
              display: true,
              text: 'Product Categories Distribution',
              font: {
                size: 16,
                weight: 'bold'
              },
              padding: {
                top: 10,
                bottom: 20
              }
            }
          }
        }
      });
    }
  }

  private initializeProductBarChart() {
    if (this.productBarChartRef && this.productStats.categoryDistribution.length > 0) {
      const ctx = this.productBarChartRef.nativeElement.getContext('2d');

      if (this.productBarChart) {
        this.productBarChart.destroy();
      }

      this.productBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.productStats.categoryDistribution.map(cat => cat.name),
          datasets: [{
            label: 'Nombre de Produits',
            data: this.productStats.categoryDistribution.map(cat => cat.count),
            backgroundColor: '#3B82F6',
            borderColor: '#2563EB',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Produits par Catégorie',
              font: {
                size: 16,
                weight: 'bold'
              },
              padding: {
                top: 10,
                bottom: 20
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      });
    }
  }

  private loadProductStats() {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (products: Product[]) => {
        this.productStats = {
          totalProducts: products.length,
          availableProducts: products.filter((p: Product) => p.status === 'available').length,
          categoriesCount: new Set(products.map((p: Product) => p.category)).size,
          lowStockProducts: 0,
          categoryDistribution: this.getCategoryDistribution(products)
        };

        // Load stock information for each product
        const stockPromises = products.map(product =>
          this.stockService.getStocksByProduct(product._id).toPromise()
        );

        Promise.all(stockPromises)
          .then(stockArrays => {
            const lowStockProducts = products.filter((product, index) => {
              const stocks = stockArrays[index] || [];
              const availableStocks = stocks.filter(stock => !stock.releasedAt).length;
              return availableStocks < 10;
            }).length;

            this.productStats = {
              ...this.productStats,
              lowStockProducts
            };
            this.isLoading = false;
            this.initializeCharts();
          })
          .catch((error: Error) => {
            console.error('Error loading stock information:', error);
            this.isLoading = false;
          });
      },
      error: (error: Error) => {
        console.error('Error loading product stats:', error);
        this.isLoading = false;
      }
    });
  }

  private getCategoryDistribution(products: Product[]): { name: string; count: number }[] {
    const categoryCount = products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryCount).map(([name, count]) => ({
      name,
      count
    })).sort((a, b) => b.count - a.count);
  }

  navigateToFeature(route: string): void {
    this.router.navigate([route]);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
