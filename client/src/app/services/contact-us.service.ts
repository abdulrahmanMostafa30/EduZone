import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { ErrorHandlingService } from "./error-handling.service";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: "root",
})
export class ContactUsService {
  private apiUrl = environment.API_URL + '/api/contact';

  constructor(
    private http: HttpClient,
    private errorHandlingService: ErrorHandlingService
  ) {}
  add(email: string, message: string): Observable<any> {
    return this.http
      .post<any>(this.apiUrl, { email, message })
      .pipe(
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }

  allContacts(): Observable<any> {
    return this.http
      .get<any>(this.apiUrl)
      .pipe(
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }
  delete(contactId: string): Observable<any> {
    return this.http
      .delete<any>(this.apiUrl + `/${contactId}`)
      .pipe(
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }
}
