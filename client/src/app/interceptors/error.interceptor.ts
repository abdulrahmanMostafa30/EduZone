import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
} from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (
          error.status === 500 &&
          error.error &&
          error.error.name === "TokenExpiredError"
        ) {
          // Token expiration error
          this.authService.logout(); // Perform logout action or update authentication state
          // You can also redirect to the login page or perform any other necessary actions
        }
        return throwError(error);
      })
    );
  }
}
