import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ICourse } from "./course";

@Injectable({
  providedIn: "root",
})
export class CourseService {
  // private apiUrl = "http://localhost:5000/api/course";
  private apiUrl = "https://eduzone-om33.onrender.com/api/course";
//
  constructor(private http: HttpClient) {}

  getCourses(): Observable<ICourse[]> {
    return this.http
      .get<ICourse[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }
  getCourseById(courseId: string): Observable<ICourse> {
    const url = `${this.apiUrl}/${courseId}`;
    return this.http.get<ICourse>(url).pipe(catchError(this.handleError));
  }
  addCourse(course: any): Observable<any> {
    const url = `${this.apiUrl}`;
    return this.http.post<any>(url, course).pipe(catchError(this.handleError));
  }
  deleteCourseById(courseId: string): Observable<ICourse> {
    const url = `${this.apiUrl}/${courseId}`;
    return this.http.delete<ICourse>(url).pipe(catchError(this.handleError));
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
