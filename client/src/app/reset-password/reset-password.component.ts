import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.scss"],
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  isPasswordReset: boolean = false;
  token: string = "";
  userIsAuthenticated = false
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.resetForm = this.formBuilder.group(
      {
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", Validators.required],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();

    // Check if password reset token is valid
    const token = this.route.snapshot.paramMap.get("token");
    if (!token) {
      this.router.navigate(["/forgot-password"]);
      return; // Add return statement here to exit the function
    }
    this.token = token;
    // Additional logic to validate token and handle invalid cases
  }

  onSubmit(): void {
    if (this.resetForm.invalid && !this.token) {
      return;
    }
    // Logic to submit the new password
    const password = this.resetForm.value.password;
    const confirmPassword = this.resetForm.value.confirmPassword;
    this.authService
      .restPassword(this.token, password, confirmPassword)
      .subscribe(
        (response) => {
          this.isPasswordReset = true;
        },
        (error) => {}
      );
    // Additional logic to send the password reset request
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get("password")?.value;
    const confirmPassword = formGroup.get("confirmPassword")?.value;
    return password === confirmPassword ? null : { passwordsNotMatched: true };
  }
}
