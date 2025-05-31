import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth.service';
import { UserStateService } from '../../core/services/user-state.service';
import { NavigationService } from '../../core/services/navigation.service';
import { ProductService } from '../../core/services/product.service';
import { StockService } from '../../core/services/stock.service';
import { Product } from '../../core/models/product.model';
import { Chart, registerables } from 'chart.js';

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

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss'],
})
export class DashboardHomeComponent implements OnInit, AfterViewInit {
  @ViewChild('categoryChart') categoryChartRef!: ElementRef;
  @ViewChild('productBarChart') productBarChartRef!: ElementRef;

  private categoryChart: Chart | null = null;
  private productBarChart: Chart | null = null;

  stats = {
    deliveries: 0,
    collections: 0,
    products: 0,
    events: 0,
  };

  isLoading = true;

  productStats: ProductStats = {
    totalProducts: 0,
    availableProducts: 0,
    categoriesCount: 0,
    lowStockProducts: 0,
    categoryDistribution: []
  };

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService,
    private userState: UserStateService,
    private navigationService: NavigationService,
    private productService: ProductService,
    private stockService: StockService
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

      // Simulate loading dashboard statistics
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
    } catch (error) {
      console.error('DashboardHomeComponent - Error in ngOnInit:', error);
      this.isLoading = false;
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
}
