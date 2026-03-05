import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  items: any[] = [];
  isLoadingItems: boolean = true;

  // Search & Filter State
  searchQuery: string = '';
  activeTypeFilter: string = '';
  activeCategoryFilter: string = '';

  // Order Session State
  cart: { item: any, quantity: number }[] = [];
  manualAmount: number | null = null;
  paymentMode: string = 'Cash';
  orderType: string = 'Dine-in';

  isSubmitting: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  // Floating Toast State
  showToast: boolean = false;
  toastMessage: string = '';
  private toastTimeout: any;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.fetchItems();
  }

  fetchItems(): void {
    this.isLoadingItems = true;
    this.apiService.getItems().subscribe({
      next: (data) => {
        this.items = data;
        this.isLoadingItems = false;
      },
      error: (err) => {
        console.error('Error fetching items', err);
        this.isLoadingItems = false;
      }
    });
  }

  get categories(): string[] {
    const cats = this.items.map(i => i.category).filter(c => c);
    return [...new Set(cats)];
  }

  get filteredItems(): any[] {
    return this.items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesType = this.activeTypeFilter ? item.type === this.activeTypeFilter : true;
      const matchesCategory = this.activeCategoryFilter ? item.category === this.activeCategoryFilter : true;
      return matchesSearch && matchesType && matchesCategory;
    });
  }

  toggleTypeFilter(type: string): void {
    if (this.activeTypeFilter === type) {
      this.activeTypeFilter = '';
    } else {
      this.activeTypeFilter = type;
    }
  }

  toggleCategoryFilter(cat: string): void {
    if (this.activeCategoryFilter === cat) {
      this.activeCategoryFilter = '';
    } else {
      this.activeCategoryFilter = cat;
    }
  }

  // Cart Logic
  addToCart(item: any): void {
    const existing = this.cart.find(c => c.item.id === item.id);
    if (existing) {
      existing.quantity++;
    } else {
      this.cart.push({ item, quantity: 1 });
    }
    this.triggerToast(`Added ${item.name} to cart`);
  }

  removeFromCart(itemId: number): void {
    this.cart = this.cart.filter(c => c.item.id !== itemId);
  }

  increaseQuantity(itemId: number): void {
    const entry = this.cart.find(c => c.item.id === itemId);
    if (entry) {
      entry.quantity++;
      this.triggerToast(`Increased ${entry.item.name} quantity`);
    }
  }

  decreaseQuantity(itemId: number): void {
    const entry = this.cart.find(c => c.item.id === itemId);
    if (entry && entry.quantity > 1) {
      entry.quantity--;
      this.triggerToast(`Decreased ${entry.item.name} quantity`);
    } else if (entry && entry.quantity === 1) {
      const name = entry.item.name;
      this.removeFromCart(itemId);
      this.triggerToast(`Removed ${name} from cart`);
    }
  }

  private triggerToast(message: string): void {
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastMessage = message;
    this.showToast = true;
    this.toastTimeout = setTimeout(() => {
      this.showToast = false;
    }, 2000);
  }

  clearCart(): void {
    this.cart = [];
    this.manualAmount = null;
  }

  onSubmit(): void {
    if (this.cart.length === 0 || this.manualAmount === null || this.manualAmount <= 0) {
      this.errorMessage = 'Please add items to cart and enter a valid total amount.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const transactionData = {
      amount: this.manualAmount,
      payment_mode: this.paymentMode,
      order_type: this.orderType,
      items: this.cart.map(c => ({
        item_id: c.item.id,
        quantity: c.quantity
      }))
    };

    this.apiService.addTransaction(transactionData).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.successMessage = 'Order recorded successfully! 🛒';
        this.clearCart();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = 'Failed to record order. Please try again.';
        console.error(err);
      }
    });
  }

  scrollToCart(): void {
    setTimeout(() => {
      const el = document.getElementById('cartSection');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }
}
