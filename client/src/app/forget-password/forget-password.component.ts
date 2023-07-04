import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: "app-forget-password",
  templateUrl: "./forget-password.component.html",
  styleUrls: ["./forget-password.component.scss"],
})
export class ForgetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  isEmailSent: boolean = false;
  userIsAuthenticated= false
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.resetForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
  }

  onSubmit() {
    if (this.resetForm.invalid) {
      return;
    }
    const email = this.resetForm.value.email;
    console.log(email);

    this.authService.forgotPassword(email).subscribe(
      (response) => {
        console.log("Password reset email sent successfully.");
        this.isEmailSent = true
      },
      (error) => {
        console.log("Error sending password reset email:", error);
      }
    );
  }
}
