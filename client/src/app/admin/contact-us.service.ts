import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ContactUsService {
  // private apiUrl = "http://localhost:5000/api/contact";
  private apiUrl = "https://eduzone-om33.onrender.com/api/contact";

  constructor(private http: HttpClient) {}
  add(email: string, message: string): Observable<any> {
    return this.http
      .post<any>(this.apiUrl, { email, message })
      .pipe(catchError(this.handleError));
  }

  allContacts(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(catchError(this.handleError));
  }
  delete(contactId: string): Observable<any> {
    return this.http
      .delete<any>(this.apiUrl + `/${contactId}`)
      .pipe(catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse) {
    let errorMessage = "An error occurred";
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    // console.error(errorMessage);
    return throwError(errorMessage);
  }
}
