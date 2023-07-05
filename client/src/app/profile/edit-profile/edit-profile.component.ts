import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { UserService } from "../user.service";
// import { AdminService } from 'src/app/services/admin.service';
// import { UserService } from 'src/app/services/user.service';

@Component({
  selector: "app-edit-profile",
  templateUrl: "./edit-profile.component.html",
  styleUrls: ["./edit-profile.component.scss"],
})
export class EditProfileComponent {
  selectedFile: File | null = null;

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
  }
  displaySelectedImage(event: any) {

    if (event.target.files && event.target.files[0]) {
      this.selectedFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imgElement = document.getElementById("photo") as HTMLImageElement;
        imgElement.src = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }
  updateProfileMe() {

    if (this.selectedFile){
      this.user.image = this.selectedFile
    }
    this.userService.updateProfileMe(this.user).subscribe({
      next: (response) => {
        console.log(response);
        this.getUserMe();
        this.userService.childToParentEvent.emit(true);
      },
      error: (error) => (this.errorMessage = error),
    });

  }
  getUserMe() {
    this.userService.getUserMe().subscribe({
      next: (response) => {
        if ((response.status = "success")) {
          this.user = response.data.data;
          console.log(this.user);
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
  onSubmit(): void {
    console.log(this.registrationForm);
    this.isSubmitted = true;
    if (!this.registrationForm.valid) {
      false;
    } else {
      console.log(JSON.stringify(this.registrationForm.value));
    }
  }
  // updateProfile(): void {
  //   this.userService.updateProfile(this.user).subscribe(
  //     (response) => {
  //       console.log('Profile updated successfully');
  //     },
  //     (error) => {
  //       console.error('Failed to update profile', error);
  //     }
  //   );
  // }

  onLogout() {
    this.authService.logout();
  }
}
