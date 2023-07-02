import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CartService {
  private apiUrl = "http://localhost:5000/api/cart";
  // private apiUrl = "https://eduzone-om33.onrender.com/api/course";
  //
  constructor(private http: HttpClient) {}
  getCartItems(): Observable<any> {
    const url = `${this.apiUrl}`;
    return this.http.get<any>(url).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = "An error occurred";
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
