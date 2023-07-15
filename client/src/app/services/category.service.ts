import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ErrorHandlingService } from "./error-handling.service";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class CategoryService {
  private apiUrl = environment.API_URL + "/api/category";

  constructor(
    private http: HttpClient,
    private errorHandlingService: ErrorHandlingService
  ) {}

  // Fetch all categories from the backend API
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError((error) => this.errorHandlingService.handleError(error))
    );
  }

  // Create a new category
  createCategory(category: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, category).pipe(
      catchError((error) => this.errorHandlingService.handleError(error))
    );
  }

  // Delete a category by ID
  deleteCategory(categoryId: string): Observable<any> {
    const url = `${this.apiUrl}/${categoryId}`;
    return this.http.delete<any>(url).pipe(
      catchError((error) => this.errorHandlingService.handleError(error))
    );
  }
}
