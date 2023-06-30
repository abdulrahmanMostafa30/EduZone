import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable, Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { AuthData } from "./auth-data.model";
import { Router } from "@angular/router";

@Injectable()
export class AuthService {
  private isAuthenticated = false;
  private role: string | null = "";
  private token: string | null = "";
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();
  private apiUrl = "http://localhost:5000/api/users/auth"; // Replace with your actual API URL
  // private apiUrl = "https://eduzone-om33.onrender.com/api/users/auth"; // Replace with your actual API URL

  constructor(
    public jwtHelper: JwtHelperService,
    private http: HttpClient,
    private router: Router
  ) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
  getRole() {
    return this.role;
  }
  createUser(user: any) {
    const postData = new FormData();

    postData.append("fname", user.fname);
    postData.append("lname", user.lname);
    postData.append("fullName", user.fullName);
    postData.append("birthDate", user.birthDate);
    postData.append("email", user.email);
    postData.append("password", user.password);
    postData.append("confirmPassword", user.confirmPassword);
    postData.append("image", user.image);
    postData.append("country", user.country);
    postData.append("address", user.address);
    postData.append("university", user.university);
    postData.append("faculty", user.faculty);
    postData.append("department", user.department);
    postData.append("note", user.note);
    console.log(postData);

    this.http.post(`${this.apiUrl}/signup`, postData).subscribe((response) => {
      console.log(response);
    });
  }
  checkToken(token: string) {
    console.log(this.jwtHelper.decodeToken(token));

    return !this.jwtHelper.isTokenExpired(token);
  }
  login(credentials: AuthData) {
    this.http
      .post<{ token: string; data: any }>(`${this.apiUrl}/login`, credentials)
      .subscribe((response) => {
        const token = response.token;
        if (token) {
          if (this.checkToken(token)) this.token = token;
          if (token) {
            const role = response.data.user.role;
            this.role = role
            console.log(role);

            const expiresInDuration = this.jwtHelper.decodeToken(token).exp;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            console.log(expirationDate);
            this.saveAuthData(token, expirationDate, role);
            this.router.navigate(["/"]);
          }
        }
      });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    console.log(authInformation);

    if (!authInformation) {
      return;
    }

    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.role = authInformation.role;

      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
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
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("role", role);

  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("role");

  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const role = localStorage.getItem("role");

    if (!token || !expirationDate || !role) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      role: role
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
