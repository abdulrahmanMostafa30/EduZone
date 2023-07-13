import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaypalService {
  private apiUrl = environment.API_URL + '/api/payments/paypal';

  constructor(private http: HttpClient) { }

  createPayment(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create-payment`, {});
  }

  capturePayment(paymentId: string, payerId:any): Observable<any> {

    return this.http.get<any>(`${this.apiUrl}/capture-payment`, {
      params: {
        paymentId,
        payerId
      }
    });
  }
}
