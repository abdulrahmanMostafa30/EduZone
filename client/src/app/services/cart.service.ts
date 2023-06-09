import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, catchError, throwError } from "rxjs";
import { ErrorHandlingService } from "./error-handling.service";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: "root",
})
export class CartService {
  private apiUrl = environment.API_URL + '/api/cart';
  private cartItemsSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public cartItems: Observable<any[]> = this.cartItemsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private errorHandlingService: ErrorHandlingService
  ) {}
  getCartItems(): Observable<any> {
    const url = `${this.apiUrl}`;
    return this.http
      .get<any>(url)
      .pipe(
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }
  add(courseId: string): Observable<any> {
    const url = `${this.apiUrl}`;
    return this.http
      .post<any>(url, { courseId: courseId })
      .pipe(
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }
  remove(itemID: string): Observable<any> {
    const url = `${this.apiUrl}`;
    return this.http
      .delete<any>(url + "/" + itemID)
      .pipe(
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }
  updateCartItems(items: any[]) {
    this.cartItemsSubject.next(items);
  }
}
