import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { UserService } from "../services/user.service";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: "app-verification",
  templateUrl: "./verification.component.html",
  styleUrls: ["./verification.component.scss"],
})
export class VerificationComponent implements OnInit {
  isLoading: boolean = true;
  isVerified: boolean = false;
  verificationCode: string = "";
  isSendEmail=false
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private userService: UserService

  ) {}

  ngOnInit(): void {
    if (this.authService.getIsEmailVerified()) {
      this.router.navigate(["/"]); // or any other appropriate route for email verification
    }
    this.route.queryParams.subscribe((params) => {
      this.verificationCode = params["code"]; // Get the verification code from the query parameter

      if (this.verificationCode) {
        this.verifyEmail(this.verificationCode);
      } else {
      }
    });
  }
  verifyEmail(verificationCode: string): void {
    this.authService.verifyEmail(verificationCode).subscribe(
      () => {
        // Handle success scenarios
        this.isVerified = true;
        this.authService.setEmailVerified(true);
        this.userService.userChanged.emit();
      },
      (error) => {
        console.error(error);
        // Handle error scenarios
      }
    );
  }
  sendEmailButtonClicked(): void {
    this.authService.resendVerificationEmail().subscribe(
      () => {
        this.isSendEmail =true
        // Handle success scenarios
        // console.log("Verification email sent");
      },
      (error) => {
        console.error(error);
        // Handle error scenarios
      }
    );
  }
}
