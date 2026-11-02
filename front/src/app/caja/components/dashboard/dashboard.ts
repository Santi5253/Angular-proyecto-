import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

Chart.register(...registerables);

interface DashboardResumen {
  kpis: { total_productos: number; total_stock: number; valor_inventario: number };
  categorias: { categoria: string; cantidad_productos: number; stock_total: number; valor_total: number }[];
  criticos: { codigo: string; nombre: string; categoria: string; stock: number; precio: number }[];
  ventas_semanales: { semana: string; total: number; cantidad: number }[];
  ventas_mensuales: { mes: string; total: number; cantidad: number }[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private readonly url = 'http://localhost:3000/api/v1/dashboard/resumen';

  kpis = { total_productos: 0, total_stock: 0, valor_inventario: 0 };
  criticos: DashboardResumen['criticos'] = [];

  barChartData: ChartData<'bar'> = { labels: [], datasets: [{ data: [], label: 'Stock' }] };
  barChartOptions: ChartConfiguration<'bar'>['options'] = { responsive: true, plugins: { legend: { display: true } } };
  barChartType: 'bar' = 'bar';

  doughnutChartData: ChartData<'doughnut'> = { labels: [], datasets: [{ data: [] }] };
  doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = { responsive: true };
  doughnutChartType: 'doughnut' = 'doughnut';

  // Ventas semanales
  ventasSemanalesData: ChartData<'bar'> = { labels: [], datasets: [{ data: [], label: 'Total ventas' }] };
  ventasSemanalesOptions: ChartConfiguration<'bar'>['options'] = { responsive: true };
  ventasSemanalesType: 'bar' = 'bar';

  // Ventas mensuales
  ventasMensualesData: ChartData<'line'> = { labels: [], datasets: [{ data: [], label: 'Total ventas' }] };
  ventasMensualesOptions: ChartConfiguration<'line'>['options'] = { responsive: true };
  ventasMensualesType: 'line' = 'line';

  ngOnInit(): void {
    this.http.get<DashboardResumen>(this.url).subscribe({
      next: (data) => {
        this.kpis = data.kpis;
        this.criticos = data.criticos;

        const labels = data.categorias.map((c) => c.categoria);
        this.barChartData = {
          labels,
          datasets: [{ data: data.categorias.map((c) => c.stock_total), label: 'Stock' }],
        };
        this.doughnutChartData = {
          labels,
          datasets: [{ data: data.categorias.map((c) => c.valor_total) }],
        };
        this.ventasSemanalesData = {
          labels: data.ventas_semanales.map((v) => v.semana),
          datasets: [{ data: data.ventas_semanales.map((v) => v.total), label: 'Total ventas' }],
        };
        this.ventasMensualesData = {
          labels: data.ventas_mensuales.map((v) => v.mes),
          datasets: [{ data: data.ventas_mensuales.map((v) => v.total), label: 'Total ventas' }],
        };
        this.cdr.detectChanges();
      },
      error: () => {
        this.kpis = { total_productos: 0, total_stock: 0, valor_inventario: 0 };
        this.criticos = [];
      },
    });
  }
}
