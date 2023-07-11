import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    const isAuth = this.authService.getIsAuth();
    const isTokenExpired = this.authService.isTokenExpired();
    const isEmailVerified = this.authService.getIsAuth();

    if (!isAuth) {
      this.router.navigate(["/login"]);
    } else {
      if (isTokenExpired) {
        this.authService.logout();
      } else {
        if (
          state.url === "/verification" ||
          state.url.startsWith("/verification?code=")
        ) {
          return true;
        }

        if (isEmailVerified) {
          return true;
        } else {
          console.log(isEmailVerified)
          this.router.navigate(["/verification"]);
          return false;
        }
      }
    }
    return isAuth;
  }
}
