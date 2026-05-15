import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  OnDestroy,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ThemeService } from '../core/theme.service';
import { CUSTOMERS } from '../data/customers';
import { PRODUCT_KEYS, PRODUCTS } from '../data/products';
import { Customer, ProductFilter, RiskFilter, RiskLevel } from '../models/customer.model';
import { Product } from '../models/product.model';
import { LatLng, LeafletMap, LeafletMarker, LeafletTileLayer } from './leaflet.types';

@Component({
  selector: 'app-mapa-clientes',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './mapa-clientes.html',
  styleUrl: './mapa-clientes.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapaClientesComponent implements AfterViewInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  private readonly themeService = inject(ThemeService);
  private readonly mapContainer = viewChild.required<ElementRef<HTMLDivElement>>('mapContainer');
  private readonly activeMarkers: LeafletMarker[] = [];
  private tileLayer: LeafletTileLayer | null = null;

  protected readonly products = PRODUCTS;
  protected readonly productKeys = PRODUCT_KEYS;
  protected readonly customers = CUSTOMERS;
  protected readonly productControl = new FormControl<ProductFilter>('todos', { nonNullable: true });
  protected readonly riskControl = new FormControl<RiskFilter>('todos', { nonNullable: true });
  protected readonly selectedProduct = signal<ProductFilter>('todos');
  protected readonly selectedRisk = signal<RiskFilter>('todos');
  protected readonly selectedCustomer = signal<Customer | null>(null);
  protected readonly mapReady = signal(false);
  protected readonly mapMessage = signal('Carregando mapa...');

  private readonly map = signal<LeafletMap | null>(null);

  protected readonly filteredCustomers = computed(() => {
    const product = this.selectedProduct();
    const risk = this.selectedRisk();

    return this.customers.filter((customer) => {
      const matchesProduct = product === 'todos' || customer.products.includes(product);
      const matchesRisk = risk === 'todos' || customer.risk === risk;
      return matchesProduct && matchesRisk;
    });
  });

  protected readonly totals = computed(() => {
    const customers = this.filteredCustomers();
    const totalLoads = customers.reduce((sum, customer) => sum + customer.loadsMonth, 0);
    const averageEngagement = customers.length
      ? customers.reduce((sum, customer) => sum + customer.engagement, 0) / customers.length
      : 0;

    return {
      averageEngagement,
      customers: customers.length,
      highRisk: customers.filter((customer) => customer.risk === 'alto').length,
      loads: totalLoads,
    };
  });

  public constructor() {
    this.productControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.selectedProduct.set(value));

    this.riskControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.selectedRisk.set(value));

    effect(() => {
      const map = this.map();
      const customers = this.filteredCustomers();

      if (map && this.mapReady()) {
        this.renderMarkers(map, customers);
      }
    });

    effect(() => {
      const map = this.map();
      const isDark = this.themeService.isDark();

      if (map && this.mapReady()) {
        this.setMapTiles(map, isDark);
      }
    });
  }

  protected toggleTheme(): void {
    this.themeService.toggle();
  }

  protected themeToggleIcon(): string {
    return this.themeService.toggleIcon();
  }

  protected themeToggleLabel(): string {
    return this.themeService.toggleLabel();
  }

  public ngAfterViewInit(): void {
    this.createMap();
  }

  public ngOnDestroy(): void {
    this.clearMarkers();
    this.map()?.remove();
  }

  protected selectCustomer(customer: Customer): void {
    this.map()?.setView(this.customerCoordinates(customer), 6, { animate: true });
    this.selectedCustomer.set(customer);
  }

  protected closeCustomerModal(): void {
    this.selectedCustomer.set(null);
  }

  protected productList(customer: Customer): Product[] {
    return customer.products.map((product) => this.products[product]);
  }

  protected formatNumber(value: number): string {
    return new Intl.NumberFormat('pt-BR').format(value);
  }

  protected formatPercent(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      maximumFractionDigits: 0,
      style: 'percent',
    }).format(value);
  }

  protected riskLabel(risk: RiskLevel): string {
    return {
      alto: 'Alto risco',
      baixo: 'Baixo risco',
      medio: 'Atencao',
    }[risk];
  }

  protected markerLabel(customer: Customer): string {
    return `${customer.name}, ${customer.city} - ${customer.state}`;
  }

  private createMap(): void {
    if (!globalThis.L) {
      this.mapMessage.set('Nao foi possivel carregar o Leaflet.');
      return;
    }

    this.clearMarkers();
    this.map()?.remove();
    this.mapReady.set(false);
    this.mapMessage.set('Carregando mapa Leaflet...');

    const map = globalThis.L.map(this.mapContainer().nativeElement, {
      scrollWheelZoom: true,
    }).setView([-14.5, -52.5], 4);

    this.map.set(map);
    this.setMapTiles(map, this.themeService.isDark());
    this.mapReady.set(true);
    this.mapMessage.set('');
    this.renderMarkers(map, this.filteredCustomers());
  }

  private renderMarkers(map: LeafletMap, customers: Customer[]): void {
    this.clearMarkers();

    for (const customer of customers) {
      const icon = globalThis.L!.divIcon({
        className: `customer-marker ${customer.risk}`,
        html: '<span></span>',
        iconAnchor: [11, 11],
        iconSize: [22, 22],
        popupAnchor: [0, -14],
      });

      const marker = globalThis.L!.marker(this.customerCoordinates(customer), {
        icon,
        keyboard: true,
        title: customer.name,
      })
        .bindTooltip(customer.name, {
          direction: 'top',
          offset: [0, -14],
          opacity: 0.96,
        })
        .on('click', () => this.selectCustomer(customer))
        .addTo(map);

      this.activeMarkers.push(marker);
    }
  }

  private clearMarkers(): void {
    for (const marker of this.activeMarkers) {
      marker.remove();
    }

    this.activeMarkers.length = 0;
  }

  private customerCoordinates(customer: Customer): LatLng {
    return [customer.coordinates.lat, customer.coordinates.lng];
  }

  private setMapTiles(map: LeafletMap, isDark: boolean): void {
    if (!globalThis.L) {
      return;
    }

    if (this.tileLayer) {
      map.removeLayer(this.tileLayer);
      this.tileLayer = null;
    }

    const url = isDark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    this.tileLayer = globalThis.L.tileLayer(url, {
      attribution: isDark
        ? '&copy; CARTO &copy; OpenStreetMap contributors'
        : '&copy; OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);
  }
}
