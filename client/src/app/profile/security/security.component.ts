import { Component, OnInit } from "@angular/core";
import { UserService } from "../user.service";
import { Router } from "@angular/router";
import { AuthService } from "src/app/auth/auth.service";
import { FormBuilder } from "@angular/forms";

@Component({
  selector: "app-security",
  templateUrl: "./security.component.html",
  styleUrls: ["./security.component.scss"],
})
export class SecurityComponent implements OnInit {
  user: any;
  errorMessage: any;
  constructor(
    private userService: UserService,
    private router: Router,
    public fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit() {}

  passwords = {
    passwordCurrent: "",
    password: "",
    confirmPassword: "",
  };
  changePassword() {
    if(this.passwords.passwordCurrent == '' || this.passwords.password == '' || this.passwords.confirmPassword == ''){
      return
    }
    this.userService.changePassword(this.passwords).subscribe({
      next: (response) => {
        console.log(response);
        this.authService.logout()
      },
      error: (error) => (this.errorMessage = error),
    });
  }
}
