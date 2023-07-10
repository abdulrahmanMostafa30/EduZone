import { SocialAuthService } from "@abacritt/angularx-social-login";
import { Injectable, EventEmitter } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable, Subject, throwError, Observer } from "rxjs";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { AuthData } from "./auth-data.model";
import { Router } from "@angular/router";
import { catchError, map } from "rxjs/operators";
import { ErrorHandlingService } from "../services/error-handling.service";
import { environment } from "../../environments/environment";

@Injectable()
export class AuthService {
  private isAuthenticated = false;
  private role: string | null = "";
  private token: string | null = "";
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();
  roleChanged = new EventEmitter<string>();

  private apiUrl = environment.API_URL + "/api/users/auth";

  constructor(
    public jwtHelper: JwtHelperService,
    private http: HttpClient,
    private router: Router,
    private errorHandlingService: ErrorHandlingService,
    private socialAuthService: SocialAuthService
  ) {}
  setRole(role: string) {
    this.role = role;
    localStorage.setItem("role", role);

    this.roleChanged.emit(role);
  }
  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }
  isTokenExpired(): boolean {
    const token = localStorage.getItem("token");
    return token !== null && this.jwtHelper.isTokenExpired(token);
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
  getRole() {
    return this.role;
  }
  forgotPassword(host: string, email: string): Observable<any> {
    return this.http
      .post<any>(this.apiUrl + "/forgotPassword", { host, email })
      .pipe(
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }

  restPassword(
    token: string,
    password: string,
    confirmPassword: string
  ): Observable<any> {
    return this.http
      .patch<any>(this.apiUrl + "/resetPassword/" + token, {
        password,
        confirmPassword,
      })
      .pipe(
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }

  createUser(user: any): Observable<any> {
    let postData;
    if (user.imageGoogle) {
      postData= user
    } else {
      postData = new FormData();

      postData.append("image", user.image);
      postData.append("fname", user.fname);
      postData.append("lname", user.lname);
      postData.append("fullName", user.fullName);
      postData.append("birthDate", user.birthDate);
      postData.append("email", user.email);
      postData.append("password", user.password);
      postData.append("confirmPassword", user.confirmPassword);
      postData.append("country", user.country);
      postData.append("address", user.address);
      postData.append("university", user.university);
      postData.append("faculty", user.faculty);
      postData.append("department", user.department);
      postData.append("note", user.note);
    }

    return this.http
      .post(`${this.apiUrl}/signup`, postData)
      .pipe(
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }
  checkToken(token: string) {
    return !this.jwtHelper.isTokenExpired(token);
  }

  authToken(response: any) {
    const token = response.token;
    if (token) {
      if (this.checkToken(token)) {
        this.token = token;
        const role = response.data.user.role;
        this.role = role;
        const expirationDate = this.jwtHelper.getTokenExpirationDate(token);
        if (expirationDate) {
          const expirationTimestamp = expirationDate.getTime() / 1000;
          const currentTimestamp = Math.floor(Date.now() / 1000);
          const expiresInDuration = expirationTimestamp - currentTimestamp;

          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);

          const now = new Date();
          const newExpirationDate = new Date(
            now.getTime() + expiresInDuration * 1000
          );

          this.saveAuthData(token, newExpirationDate, role);
          return true;
        } else {
          this.isAuthenticated = false;
          return false;
        }
      } else {
        this.isAuthenticated = false;
        return false;
      }
    } else {
      this.isAuthenticated = false;
    }
    return false;
  }
  login(credentials: AuthData): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      this.http
        .post<{ token: string; data: any }>(`${this.apiUrl}/login`, credentials)
        .subscribe(
          (response) => {
            if (this.authToken(response)) {
              observer.next({ success: true }); // Emit success status or any other desired data
            } else {
              observer.error(new Error("Token not found in the response")); // Emit an error if token is not available
            }
          },
          (error) => {
            observer.error(error); // Emit error if login fails
          }
        );
    });
  }
  loginGoogle(token: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/login`, { token })
      .pipe(
        map((response) => {
          if (this.authToken(response)) {
            return { success: true }; // Emit success status or any other desired data
          } else {
            throw new Error("Token not found in the response"); // Emit an error if token is not available
          }
        }),
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    console.log(authInformation);

    if (!authInformation) {
      return;
    }

    const isTokenExpired = this.jwtHelper.isTokenExpired(authInformation.token);
    if (isTokenExpired) {
      this.isAuthenticated = false;
      return;
    }

    const expirationDate = this.jwtHelper.getTokenExpirationDate(
      authInformation.token
    );
    if (expirationDate) {
      // Check if expirationDate is not null
      const now = new Date();
      const expiresIn = expirationDate.getTime() - now.getTime();

      if (expiresIn > 0) {
        this.token = authInformation.token;
        this.isAuthenticated = true;
        this.role = authInformation.role;

        this.setAuthTimer(expiresIn / 1000);
        this.authStatusListener.next(true);
      } else {
        this.isAuthenticated = false;
      }
    } else {
      this.isAuthenticated = false;
    }
  }

  getFileFromUrl(
    url: string,
    name: string,
    defaultType = "image/jpeg"
  ): Observable<File> {
    const headers = new HttpHeaders().set("Access-Control-Allow-Origin", "**");

    return this.http
      .get(url, {
        headers: headers,
        responseType: "blob",
      })
      .pipe(
        map((response: Blob) => {
          const blobData = new Blob([response]);
          return new File([blobData], name, {
            type: blobData.type || defaultType,
          });
        }),
        catchError((error: any) => {
          console.error("Error fetching image:", error);
          throw error;
        })
      );
  }

  logout() {
    this.socialAuthService
      .signOut()
      .then(() => {})
      .catch((error: any) => {});
    this.token = null;
    this.isAuthenticated = false;
    this.role = null;

    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/"]);
  }

  private setAuthTimer(duration: number) {
    console.log("Setting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, role: string) {
    localStorage.setItem("token", token);
    // localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("role", role);
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("role");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    // const expirationDate = localStorage.getItem("expiration");
    const role = localStorage.getItem("role");

    if (!token || !role) {
      return;
    }
    return {
      token: token,
      // expirationDate: new Date(expirationDate),
      role: role,
    };
  }

  // private apiUrl = 'http://localhost:5000/api/users/auth'; // Replace with your actual API URL

  // constructor(public jwtHelper: JwtHelperService, private http: HttpClient) {}

  // // ...
  // public isAuthenticated(): boolean {
  //   const token = localStorage.getItem('token');
  //   return !this.jwtHelper.isTokenExpired(token);
  // }
  // signup(user: any): Observable<any> {
  //   const url = `${this.apiUrl}/signup`;
  //   return this.http.post(url, user);
  // }

  // login(credentials: any): Observable<any> {
  //   const url = `${this.apiUrl}/login`;
  //   return this.http.post(url, credentials);
  // }
  // setToken(token: string) {
  //   if (!this.jwtHelper.isTokenExpired(token)){
  //     localStorage.setItem('token', token);
  //     return true
  //   }
  //   else{
  //     return false
  //   }
  // }

  // getToken(): string | null {
  //   return localStorage.getItem('token');
  // }

  // removeToken() {
  //   localStorage.removeItem('token');
  // }
}
