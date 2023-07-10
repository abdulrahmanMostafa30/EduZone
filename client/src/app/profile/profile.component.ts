import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../auth/auth.service";
import { Router } from "@angular/router";
import { UserService } from "../services/user.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ProfileComponent implements OnInit {
  user: any;
  errorMessage: any;
  constructor(
    private userService: UserService,
    private router: Router,
    public fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.getUserMe();
    this.userService.childToParentEvent.subscribe((data) => {
      this.getUserMe();
    });
  }

  getUserMe() {
    this.userService.getUserMe().subscribe({
      next: (response) => {
        if ((response.status = "success")) {
          this.user = response.data.data;
        }
      },
      error: (error) => (this.errorMessage = error),
    });
  }

  isSubmitted = false;
  Gender: any = ["male", "Female"];

  registrationForm = this.fb.group({
    genderType: ["", [Validators.required]],
  });

  onLogout() {
    this.authService.logout();
  }
}
