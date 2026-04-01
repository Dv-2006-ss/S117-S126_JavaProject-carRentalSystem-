import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Customer {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phone: string;
  age?: number;
  owner?: string;
}

export interface CustomerResponse {
  success: boolean;
  count?: number;
  data: Customer[];
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  // 🔥 IMPORTANT: backend port 5000
  private baseUrl = `${environment.api}/api/customers`;

  constructor(private http: HttpClient) { }

  getCustomers(token: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<CustomerResponse>(this.baseUrl, { headers });
  }

  addCustomer(data: Customer, token: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post<{success: boolean, data: Customer}>(this.baseUrl, data, { headers });
  }

  updateCustomer(id: string, data: Partial<Customer>, token: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.put<{success: boolean, data: Customer}>(`${this.baseUrl}/${id}`, data, { headers });
  }

  deleteCustomer(id: string, token: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.delete<{success: boolean, data: {}}>(`${this.baseUrl}/${id}`, { headers });
  }

}
