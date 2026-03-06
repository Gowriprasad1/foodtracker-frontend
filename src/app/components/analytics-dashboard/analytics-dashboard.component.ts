import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-analytics-dashboard',
  templateUrl: './analytics-dashboard.component.html',
  styleUrls: ['./analytics-dashboard.component.css']
})
export class AnalyticsDashboardComponent implements OnInit {
  items: any[] = [];
  transactionData: any[] = [];
  itemBreakdown: any = {};
  summary: any = { totalItemsSold: 0, totalRevenue: 0, totalTransactions: 0, cashRevenue: 0, upiRevenue: 0 };
  isLoadingAnalytics: boolean = true;
  activePreset: string = 'today';
  isFilterOpen: boolean = false;

  // Filters
  filters: any = {
    startDate: '',
    endDate: '',
    daysOfWeek: '',
    itemId: '',
    paymentMode: '',
    orderType: '',
    minAmount: null,
    maxAmount: null,
    minQuantity: null,
    timeSlot: '',
    sortBy: 'created_at',
    sortOrder: 'DESC'
  };

  days = [
    { value: 1, name: 'Monday' },
    { value: 2, name: 'Tuesday' },
    { value: 3, name: 'Wednesday' },
    { value: 4, name: 'Thursday' },
    { value: 5, name: 'Friday' },
    { value: 6, name: 'Saturday' },
    { value: 0, name: 'Sunday' }
  ];
  selectedDays: number[] = [];

  chart: any;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.setPreset('today');
    this.fetchItems();
  }

  fetchItems(): void {
    this.apiService.getItems().subscribe(data => this.items = data);
  }

  setPreset(preset: string): void {
    const today = new Date();
    this.activePreset = preset;

    // Helper to get local date as YYYY-MM-DD
    const toLocalISO = (date: Date) => {
      const offset = date.getTimezoneOffset();
      const localDate = new Date(date.getTime() - (offset * 60 * 1000));
      return localDate.toISOString().split('T')[0];
    };

    const todayStr = toLocalISO(today);

    switch (preset) {
      case 'today':
        this.filters.startDate = todayStr;
        this.filters.endDate = todayStr;
        break;
      case 'yesterday':
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        this.filters.startDate = toLocalISO(yesterday);
        this.filters.endDate = toLocalISO(yesterday);
        break;
      case 'thisWeek':
        const dayOfWeek = today.getDay(); // 0 is Sunday
        const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
        const firstDay = new Date(today);
        firstDay.setDate(today.getDate() + diffToMonday);
        this.filters.startDate = toLocalISO(firstDay);
        this.filters.endDate = todayStr;
        break;
      case 'thisMonth':
        const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        this.filters.startDate = toLocalISO(firstOfMonth);
        this.filters.endDate = todayStr;
        break;
    }
    this.fetchAnalytics();
  }

  toggleDay(dayValue: number): void {
    const index = this.selectedDays.indexOf(dayValue);
    if (index > -1) {
      this.selectedDays.splice(index, 1);
    } else {
      this.selectedDays.push(dayValue);
    }
    this.filters.daysOfWeek = this.selectedDays.join(',');
    this.fetchAnalytics();
  }

  fetchAnalytics(): void {
    this.isLoadingAnalytics = true;
    this.apiService.getAnalytics(this.filters).subscribe({
      next: (res) => {
        this.transactionData = res.data;
        this.itemBreakdown = res.itemBreakdown || {};
        this.summary = res.summary;
        this.isLoadingAnalytics = false;
        setTimeout(() => this.updateChart(), 0);
      },
      error: (err) => {
        console.error('Error fetching analytics', err);
        this.isLoadingAnalytics = false;
      }
    });
  }

  resetFilters(): void {
    this.filters = {
      startDate: '',
      endDate: '',
      daysOfWeek: '',
      itemId: '',
      paymentMode: '',
      orderType: '',
      minAmount: null,
      maxAmount: null,
      minQuantity: null,
      timeSlot: '',
      sortBy: 'created_at',
      sortOrder: 'DESC'
    };
    this.selectedDays = [];
    this.setPreset('today');
  }

  updateChart(): void {
    const labels = Object.keys(this.itemBreakdown);
    const data = Object.values(this.itemBreakdown);

    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = document.getElementById('salesChart') as HTMLCanvasElement;
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Units Sold',
          data: data,
          backgroundColor: '#FC8019',
          borderColor: '#FC8019',
          borderWidth: 0,
          borderRadius: 4,
          barPercentage: 0.6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#3D4152',
            titleColor: '#FFFFFF',
            bodyColor: '#FFFFFF',
            padding: 10,
            cornerRadius: 8,
            displayColors: false
          }
        },
        scales: {
          x: {
            ticks: { color: '#7E808C', font: { family: 'Inter', weight: 'normal', size: 12 } },
            grid: { color: 'transparent' },
            border: { display: false }
          },
          y: {
            beginAtZero: true,
            ticks: { color: '#7E808C', font: { family: 'Inter', weight: 'normal', size: 12 }, precision: 0 },
            grid: { color: '#E8E8E8', drawTicks: false },
            border: { display: false, dash: [4, 4] }
          }
        }
      }
    });
  }
} window.onresize = () => {
  // Handle layout shifts if needed
};
