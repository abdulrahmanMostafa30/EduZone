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
    private recaptchaV3Service: ReCaptchaV3Service
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
    this.signupWithGoogle();
  }

  signupWithGoogle(): void {
    this.subscriptions.push(
      this.socialAuthService.authState.subscribe((user) => {
        if (user) {
          this.subscriptions.push(this.authService.loginGoogle(user.idToken).subscribe({
            next: (response) => {
              this.isLogged = true;
              this.haveError = false;
              this.errorMessage = "";
              setTimeout(() => {
                this.router.navigate(["/"]);
              }, 500);
            },
            error: (error) => {
              this.haveError = true;
              if (error.includes("Email does not exist")) {
                this.errorMessage = "Plese Signup First!";
              } else {
                this.errorMessage = this.errorMessageDefult;
              }
              this.isLogged = false;
            },
          }));
        }
      })
    );
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
            // Send the form data (including the reCAPTCHA token) to the server for authentication
            console.log("Form data:", this.loginForm.value);

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
            // Handle form validation errors
          }
        })
    );

    this.isLoading = false;
  }
}
