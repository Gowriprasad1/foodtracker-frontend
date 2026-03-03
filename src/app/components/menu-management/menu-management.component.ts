import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
    selector: 'app-menu-management',
    templateUrl: './menu-management.component.html',
    styleUrls: ['./menu-management.component.css']
})
export class MenuManagementComponent implements OnInit {
    items: any[] = [];
    isLoading = false;
    isProcessing = false;
    newItemName = '';
    editingItemId: string | null = null;
    successMessage = '';
    errorMessage = '';

    // Modal State
    showDeleteModal = false;
    itemToDelete: any = null;

    constructor(private apiService: ApiService) { }

    ngOnInit(): void {
        this.fetchItems();
    }

    fetchItems(): void {
        this.isLoading = true;
        this.apiService.getItems().subscribe({
            next: (data) => {
                this.items = data;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error fetching items:', err);
                this.isLoading = false;
            }
        });
    }

    onSubmitItem(): void {
        if (!this.newItemName || this.isProcessing) return;

        this.isProcessing = true;
        this.errorMessage = '';

        if (this.editingItemId) {
            this.apiService.updateItem(this.editingItemId, { name: this.newItemName }).subscribe({
                next: () => {
                    this.successMessage = 'Item updated successfully!';
                    this.resetForm();
                    this.fetchItems();
                    this.isProcessing = false;
                },
                error: () => {
                    this.errorMessage = 'Failed to update item';
                    this.isProcessing = false;
                }
            });
        } else {
            this.apiService.addItem({ name: this.newItemName }).subscribe({
                next: () => {
                    this.successMessage = 'Item added successfully!';
                    this.resetForm();
                    this.fetchItems();
                    this.isProcessing = false;
                },
                error: () => {
                    this.errorMessage = 'Failed to add item';
                    this.isProcessing = false;
                }
            });
        }
    }

    editItem(item: any): void {
        this.editingItemId = item.id;
        this.newItemName = item.name;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    deleteItemId: string | null = null;

    openDeleteModal(item: any): void {
        this.itemToDelete = item;
        this.showDeleteModal = true;
    }

    closeDeleteModal(): void {
        this.showDeleteModal = false;
        this.itemToDelete = null;
    }

    confirmDelete(): void {
        if (!this.itemToDelete) return;

        const id = this.itemToDelete.id;
        this.deleteItemId = id;
        this.apiService.deleteItem(id).subscribe({
            next: () => {
                this.successMessage = 'Item deleted successfully!';
                this.fetchItems();
                this.deleteItemId = null;
                this.closeDeleteModal();
            },
            error: () => {
                this.errorMessage = 'Failed to delete item';
                this.deleteItemId = null;
                this.closeDeleteModal();
            }
        });
    }

    deleteItem(id: string): void {
        // This is now handled by openDeleteModal -> confirmDelete
    }

    resetForm(): void {
        this.newItemName = '';
        this.editingItemId = null;
        setTimeout(() => {
            this.successMessage = '';
            this.errorMessage = '';
        }, 3000);
    }
}
