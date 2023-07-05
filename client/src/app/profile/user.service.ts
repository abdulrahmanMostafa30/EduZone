import { Injectable, EventEmitter } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { IUser, IUserResponse } from "./user";

@Injectable({
  providedIn: "root",
})
export class UserService {
  // private apiUrl = "http://localhost:5000/api/users/auth";
  private apiUrl = "https://eduzone-om33.onrender.com/api/users/auth";

  public childToParentEvent = new EventEmitter<any>();

  constructor(private http: HttpClient) {}

  getUserById(userId: string): Observable<any> {
    return this.http
      .get<any>(this.apiUrl + "/" + userId)
      .pipe(catchError(this.handleError));
  }
  removeUser(userId: string): Observable<any> {
    return this.http
      .delete<any>(this.apiUrl + "/" + userId)
      .pipe(catchError(this.handleError));
  }
  updateUser(userId: string, data: any): Observable<any> {
    return this.http
      .patch<any>(this.apiUrl + "/" + userId, data)
      .pipe(catchError(this.handleError));
  }
  getAllUsers(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(catchError(this.handleError));
  }

  changePassword(passwords: any): Observable<any> {
    return this.http
      .patch<any>(this.apiUrl + "/updateMyPassword", passwords)
      .pipe(catchError(this.handleError));
  }

  getUserMe(): Observable<any> {
    return this.http
      .get<any>(this.apiUrl + "/me")
      .pipe(catchError(this.handleError));
  }
  updateProfileMe(user: any): Observable<any> {
    let form_data = new FormData();

    for (var key in user) {
      form_data.append(key, user[key]);
    }
    console.log(form_data);
    return this.http
      .patch<any>(this.apiUrl + "/updateMe", form_data)
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
