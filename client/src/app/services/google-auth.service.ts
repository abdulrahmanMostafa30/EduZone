import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { ErrorHandlingService } from "./error-handling.service";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class GoogleAuthService {
  private apiUrl = environment.API_URL + '/api/users/auth/login/google';

  constructor(
    private http: HttpClient,
    private errorHandlingService: ErrorHandlingService
  ) {}

  login(token: string): Observable<any> {
    const url = `${this.apiUrl}`;
    return this.http
      .post<any>(url, { token })
      .pipe(
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }
}
