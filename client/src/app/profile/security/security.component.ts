import { Component, OnInit } from "@angular/core";
import { UserService } from "../../services/user.service";
import { Router } from "@angular/router";
import { AuthService } from "src/app/auth/auth.service";
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";

@Component({
  selector: "app-security",
  templateUrl: "./security.component.html",
  styleUrls: ["./security.component.scss"],
})
export class SecurityComponent implements OnInit {
  user: any;
  errorMessage: any;
  passwordForm: FormGroup;

  constructor(
    private userService: UserService,
    public fb: FormBuilder,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.passwordForm = this.formBuilder.group({
      passwordCurrent: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    })
    this.passwordForm.get('password')?.valueChanges.subscribe(() => {
      this.passwordForm.get('confirmPassword')?.updateValueAndValidity();
    });

    // Set custom validator for confirm password field
    this.passwordForm.get('confirmPassword')?.setValidators([Validators.required, Validators.minLength(8), this.matchConfirmPassword.bind(this)]);
  }

  ngOnInit() {

  }


  changePassword() {
    if (
      this.passwordForm.get('current_password')?.value === '' ||
      this.passwordForm.get('password')?.value === '' ||
      this.passwordForm.get('confirmPassword')?.value === ''
    ) {
      return;
    }
    const passwords = {
      passwordCurrent: this.passwordForm.get('passwordCurrent')?.value,
      password: this.passwordForm.get('password')?.value,
      confirmPassword: this.passwordForm.get('confirmPassword')?.value,
    };
    this.userService.changePassword(passwords).subscribe({
      next: (response) => {
        this.authService.logout()
      },
      error: (error) => (this.errorMessage = error),
    });
  }
  matchConfirmPassword(control: AbstractControl): ValidationErrors | null {
    const password = this.passwordForm.get('password')?.value;
    const confirmPassword = control.value;

    // Check if the passwords match
    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }

    return null;
  }
}
