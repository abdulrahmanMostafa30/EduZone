import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private baseUrl = 'http://localhost:5000/api/payments/stripe'; // Replace with your server's URL

  constructor(private http: HttpClient) {}

  createPayment(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/create-payment`, {});
  }

  completePayment(paymentIntentId: any, paymentMethodId:any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/complete-payment`, { paymentIntentId, paymentMethodId });
  }
}
