import { Component, OnDestroy, OnInit } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import {
  SocialAuthService,
  GoogleLoginProvider,
  SocialUser,
} from "@abacritt/angularx-social-login";
import { GoogleAuthService } from "../services/google-auth.service";
import { Subscription } from "rxjs";
import { ReCaptchaV3Service } from "ng-recaptcha";
import { CartService } from "../services/cart.service";

@Component({
  selector: "app-login-form",
  templateUrl: "./login-form.component.html",
  styleUrls: ["./login-form.component.scss"],
})
export class LoginFormComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  isLoading = false;
  isLogged = false;
  errorMessageDefult = "Failed logging in";
  errorMessage: string = "";
  haveError = false;
  loginForm: FormGroup;
  user!: SocialUser;

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private socialAuthService: SocialAuthService,
    private googleAuthService: GoogleAuthService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private cartService: CartService,

  ) {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      rememberme: [false],
      recaptchaToken: [""], // Add the recaptchaToken control
    });
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());

  }
  ngOnInit(): void {
    if (this.authService.getIsAuth()) {
      this.router.navigate(["/"]);
    }
    // this.signupWithGoogle();
  }


  onLogin() {
    this.isLoading = true;

    this.subscriptions.push(
      this.recaptchaV3Service
        .execute("loginAction")
        .subscribe((token: string) => {
          // Set the reCAPTCHA token in the form control
          this.loginForm.get("recaptchaToken")?.setValue(token);

          // Proceed with login action
          if (this.loginForm.valid) {

            const email = this.loginForm.get("email")?.value;
            const password = this.loginForm.get("password")?.value;
            const recaptchaToken = this.loginForm.get("recaptchaToken")?.value;

            const credentials = {
              email: email,
              password: password,
              recaptchaToken: recaptchaToken,
            };
            this.subscriptions.push(this.authService.login(credentials).subscribe({
              next: (response) => {
                this.isLogged = true;
                this.haveError = false;
                this.errorMessage = "";
                this.cartService.getCartItems().subscribe((response) => {
                  this.cartService.updateCartItems(response.data);
                });
                setTimeout(() => {
                  this.router.navigate(["/"]);
                }, 500);
              },
              error: (error) => {
                this.haveError = true;
                this.errorMessage = this.errorMessageDefult;
                this.isLogged = false;
              },
            }));
          } else {
          }
        })
    );

    this.isLoading = false;
  }
}
