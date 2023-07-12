import { Component, OnInit } from "@angular/core";
import { AuthService } from "./auth/auth.service";
import { SocialAuthService } from "@abacritt/angularx-social-login";
import { Router } from "@angular/router";
import { CartService } from "./services/cart.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "EduZone";
  signupWithGoogle(): void {}
  constructor(
    private authService: AuthService,
    private socialAuthService: SocialAuthService,
    private router: Router,
    private cartService: CartService
  ) {}
  ngOnInit() {
    this.authService.autoAuthUser();
    this.socialAuthService.authState.subscribe((user) => {
      if (!this.authService.getIsAuth()) {
        if (user) {
          this.authService.loginGoogle(user.idToken).subscribe({
            next: (response) => {
              this.cartService.getCartItems().subscribe((response) => {
                this.cartService.updateCartItems(response.data);
              });
              this.router.navigate(["/"]);
            },
            error: (error) => {
              if (error.includes("Email does not exist")) {
                this.router.navigate(["/signup"]);
              } else {
              }
            },
          });
        }
      }
    });
  }
}
