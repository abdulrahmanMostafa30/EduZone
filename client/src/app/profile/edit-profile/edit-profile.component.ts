import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { UserService } from "../../services/user.service";
// import { AdminService } from 'src/app/services/admin.service';
// import { UserService } from 'src/app/services/user.service';

@Component({
  selector: "app-edit-profile",
  templateUrl: "./edit-profile.component.html",
  styleUrls: ["./edit-profile.component.scss"],
})
export class EditProfileComponent {
  selectedFile: File | null = null;
  profileForm: FormGroup;

  user: any;
  errorMessage: any;
  Country: string[] = [
    "Egypt",
    "Kuwait",
    "Morocco",
    "Palestine",
    "Saudi Arabia",
    "Other",
  ];

  constructor(
    private userService: UserService,
    private router: Router,
    public fb: FormBuilder,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.profileForm = this.formBuilder.group({
      first_name: ["", Validators.required],
      last_name: ["", Validators.required],
      full_name: ["", Validators.required],
      birth_date: ["", Validators.required],
      email: [{ value: "", disabled: true }, Validators.required],
      country: ["", Validators.required],
      address: ["", Validators.required],
      university: ["", Validators.required],
      faculty: ["", Validators.required],
      department: ["", Validators.required],
    });
  }

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
    if (this.selectedFile) {
      this.user.image = this.selectedFile;
    }

    // Update user object with form values
    this.user.fname = this.profileForm.value.first_name;
    this.user.lname = this.profileForm.value.last_name;
    this.user.fullName = this.profileForm.value.full_name;
    this.user.birthDate = this.profileForm.value.birth_date;
    // this.user.email = this.profileForm.value.email;
    this.user.country = this.profileForm.value.country;
    this.user.address = this.profileForm.value.address;
    this.user.university = this.profileForm.value.university;
    this.user.faculty = this.profileForm.value.faculty;
    this.user.department = this.profileForm.value.department;

    this.userService.updateProfileMe(this.user).subscribe({
      next: (response) => {
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
          const countryIndex = this.user.country.indexOf(":");
          if (countryIndex !== -1) {
            const countryName = this.user.country
              .slice(countryIndex + 1)
              .trim();

            // Check if the country name is in the Country array
            if (this.Country.includes(countryName)) {
              this.profileForm.patchValue({
                country: countryName,
              });
            }
          }
          else {
            this.profileForm.patchValue({
              country: this.user.country,
            });
          }
          this.profileForm.patchValue({
            first_name: this.user.fname,
            last_name: this.user.lname,
            full_name: this.user.fullName,
            birth_date: this.user.birthDate,
            email: this.user.email,
            // country: this.user.country,
            address: this.user.address,
            university: this.user.university,
            faculty: this.user.faculty,
            department: this.user.department,
          });
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
