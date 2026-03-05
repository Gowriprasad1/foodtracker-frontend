import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getItems(): Observable<any> {
    return this.http.get(`${this.apiUrl}/items`);
  }

  addItem(itemData: { name: string, price?: number, type?: string | null, category?: string | null }): Observable<any> {
    return this.http.post(`${this.apiUrl}/items`, itemData);
  }

  updateItem(id: string, itemData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/items/${id}`, itemData);
  }

  deleteItem(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/items/${id}`);
  }

  addTransaction(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/transactions`, data);
  }

  getAnalytics(filters: any): Observable<any> {
    let params = new HttpParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== '') {
        params = params.set(key, filters[key]);
      }
    });

    return this.http.get(`${this.apiUrl}/analytics/sales`, { params });
  }

  getDataRange(): Observable<any> {
    return this.http.get(`${this.apiUrl}/analytics/data-range`);
  }

  getDailySales(days: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/analytics/daily-sales?days=${days}`);
  }
}
