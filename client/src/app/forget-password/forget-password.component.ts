import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "../auth/auth.service";
import { HostService } from "../services/host.service";

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
    private authService: AuthService,
    private hostService: HostService
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
    const host =this.hostService.getHost()
    const email = this.resetForm.value.email;

    this.authService.forgotPassword(host, email).subscribe(
      (response) => {
        this.isEmailSent = true
      },
      (error) => {
      }
    );
  }
}
