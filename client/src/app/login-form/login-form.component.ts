import { Component, OnInit } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "app-login-form",
  templateUrl: "./login-form.component.html",
  styleUrls: ["./login-form.component.scss"],
})
export class LoginFormComponent {
  email: string = "";
  password: string = "";
  rememberme: string = "";
  isLoading = false;
  errorMessage: any;
  constructor(private authService: AuthService, private router: Router) {}
  onLogin() {
    const credentials = {
      email: this.email,
      password: this.password,
    };
    console.log(credentials);
    this.isLoading = true;

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.router.navigate(["/"]);
      },
      error: (error) => {
        this.errorMessage = error.message;
        console.log(this.errorMessage);
      },
    });
  }
}
