import { Injectable, EventEmitter } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { IUser, IUserResponse } from "../profile/user";
import { ErrorHandlingService } from "./error-handling.service";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private apiUrl = environment.API_URL + "/api/users/auth";

  public childToParentEvent = new EventEmitter<any>();
  public userChanged = new EventEmitter<void>();

  constructor(
    private http: HttpClient,
    private errorHandlingService: ErrorHandlingService
  ) {}

  getUserById(userId: string): Observable<any> {
    return this.http
      .get<any>(this.apiUrl + "/" + userId)
      .pipe(
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }
  removeUser(userId: string): Observable<any> {
    return this.http
      .delete<any>(this.apiUrl + "/" + userId)
      .pipe(
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }
  updateUser(userId: string, data: any): Observable<any> {
    return this.http
      .patch<any>(this.apiUrl + "/" + userId, data)
      .pipe(
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }
  getAllUsers(): Observable<any> {
    return this.http
      .get<any>(this.apiUrl)
      .pipe(
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }

  changePassword(passwords: any): Observable<any> {
    return this.http
      .patch<any>(this.apiUrl + "/updateMyPassword", passwords)
      .pipe(
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }

  getUserMe(): Observable<any> {
    return this.http
      .get<any>(this.apiUrl + "/me")
      .pipe(
        tap((response) => {
          // this.userChanged.emit();
        }),
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }
  updateProfileMe(user: any): Observable<any> {
    let form_data;
    if (user.image) {
      form_data = new FormData();
      for (let key in user) {
        if (key == "courseProgress") {
          continue;
        }
        form_data.append(key, user[key]);
      }
    } else {
      form_data = user;
    }
    return this.http.patch<any>(this.apiUrl + "/updateMe", form_data).pipe(
      tap((response) => {
        this.userChanged.emit();
      }),
      catchError((error) => {
        return this.errorHandlingService.handleError(error);
      })
    );
  }
}
