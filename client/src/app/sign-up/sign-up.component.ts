import { Subscription } from "rxjs";
import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { AuthService } from "../auth/auth.service";
import { Router } from "@angular/router";
import { GoogleAuthService } from "../services/google-auth.service";
import {
  SocialAuthService,
  GoogleLoginProvider,
  SocialUser,
} from "@abacritt/angularx-social-login";

@Component({
  selector: "app-sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.scss"],
})
export class SignUpComponent implements OnInit, OnDestroy {
  errorMessage: any;
  user: any;

  Country: any = [
    "Egypt",
    "Kuwait",
    "Morocco",
    "Palestine",
    "Saudi Arabia",
    "Other",
  ];
  isLoading = false;
  isSignedup = false;
  registerationForm: FormGroup | any;
  selectedFile: File | null = null;
  private authSubscription: Subscription | null = null;
  private subscriptions: Subscription[] = [];
  imageGoogle: string | null = null;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private router: Router,
    private socialAuthService: SocialAuthService,

    private googleAuthService: GoogleAuthService
  ) {}
  isAlertImage(): boolean {
    const controls = this.registerationForm.controls;

    if (
      Object.keys(controls).every(
        (key) => key === "image" || !controls[key].errors
      )
    ) {
      if (!controls["image"].value) {
        return true;
      }
    } else {
      return false;
    }
    return false;
  }
  signupWithGoogle(): void {
    this.subscriptions.push(
      this.socialAuthService.authState.subscribe((user) => {
        if (this.router.url === "/signup") {
          if (user) {
            this.user = user;

            const { email, firstName, lastName, photoUrl } = this.user;
            // Set the user data to the form controls
            this.registerationForm.patchValue({
              email: email,
              fname: firstName,
              lname: lastName,
            });
            const imgElement = document.getElementById(
              "photo"
            ) as HTMLImageElement;
            imgElement.src = photoUrl;
            this.imageGoogle = photoUrl;
            this.registerationForm.get("image").setValue(photoUrl);

            // if (imgElement.files && imgElement.files[0]) {
            //   this.selectedFile = imgElement.files[0];
            //   this.registerationForm.controls["image"].setValue(event.target.files[0]);}
            // this.authService
            //   .getFileFromUrl(photoUrl, "profile_photo.jpg")
            //   .subscribe(
            //     (file: File) => {
            //       console.log("Loaded file:", file);
            //       this.selectedFile = file;
            //       this.registerationForm.get("image").setValue(file);
            //     },
            //     (error: any) => {
            //       console.error("Error loading image:", error);
            //     }
            //   );
            //   getFileFromUrl()
            //     .then((file) => {
            //       this.selectedFile = file;
            //       this.registerationForm.get("image").setValue(file);
            //     })
            //     .catch((error) => {});
          }
        }
      })
    );
  }
  ngOnDestroy(): void {
    this.socialAuthService
      .signOut()
      .then(() => {})
      .catch((error: any) => {});
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
  ngOnInit() {
    if (this.authService.getIsAuth()) {
      this.router.navigate(["/"]);
    }
    this.signupWithGoogle();
    // using form builder services
    this.registerationForm = this.fb.group({
      image: ["", Validators.required],
      fname: ["", [Validators.required, Validators.minLength(3)]],
      lname: ["", [Validators.required, Validators.minLength(3)]],
      fullName: [
        "",
        [
          Validators.required,
          Validators.pattern(/^[A-Za-z]+\s[A-Za-z]+\s[A-Za-z]+\s[A-Za-z]+$/),
        ],
      ],
      birthDate: ["", [Validators.required]],
      email: [
        "",
        [
          Validators.required,
          Validators.pattern(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/),
        ],
      ],
      password: ["", [Validators.required, Validators.minLength(8)]],
      confirmPassword: ["", [Validators.required, Validators.minLength(8)]],
      country: ["", [Validators.required]],
      address: ["", [Validators.required]],
      university: ["", [Validators.required]],
      faculty: ["", [Validators.required]],
      department: ["", Validators.required],
      note: [""],
    });
    this.subscriptions.push(
      this.registerationForm.get("password").valueChanges.subscribe(() => {
        this.registerationForm.get("confirmPassword").updateValueAndValidity();
      })
    );

    // Set custom validator for confirm password field
    this.registerationForm
      .get("confirmPassword")
      .setValidators([
        Validators.required,
        Validators.minLength(8),
        this.matchConfirmPassword.bind(this),
      ]);
  }
  get fname() {
    return this.registerationForm.get("fname");
  }
  get lname() {
    return this.registerationForm.get("lname");
  }
  get fullName() {
    return this.registerationForm.get("fullName");
  }
  get birthDate() {
    return this.registerationForm.get("birthDate");
  }
  get email() {
    return this.registerationForm.get("email");
  }
  get password() {
    return this.registerationForm.get("password");
  }
  get confirmPassword() {
    return this.registerationForm.get("confirmPassword");
  }
  get country() {
    return this.registerationForm.get("country");
  }
  get address() {
    return this.registerationForm.get("address");
  }
  get university() {
    return this.registerationForm.get("university");
  }
  get faculty() {
    return this.registerationForm.get("faculty");
  }
  get department() {
    return this.registerationForm.get("department");
  }
  get note() {
    return this.registerationForm.get("note");
  }
  get image() {
    return this.registerationForm.get("image").value;
  }
  matchConfirmPassword(control: AbstractControl): ValidationErrors | null {
    const password = this.registerationForm.get("password").value;
    const confirmPassword = control.value;

    // Check if the passwords match
    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }

    return null;
  }
  displaySelectedImage(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.selectedFile = event.target.files[0];
      this.imageGoogle = null;
      this.registerationForm.controls["image"].setValue(event.target.files[0]);
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imgElement = document.getElementById("photo") as HTMLImageElement;
        imgElement.src = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  changeCountry(e: any) {
    this.country?.setValue(e.target.value, {
      onlySelf: true,
    });
  }
  onSignup(e: Event) {
    e.preventDefault();

    if (this.registerationForm.invalid) {
      return;
    }

    this.isLoading = true;

    const user: User = {
      fname: this.fname.value,
      lname: this.lname.value,
      fullName: this.fullName.value,
      birthDate: this.birthDate.value,
      email: this.email.value,
      password: this.password.value,
      confirmPassword: this.confirmPassword.value,
      country: this.country.value.toString(),
      address: this.address.value,
      university: this.university.value,
      faculty: this.faculty.value,
      department: this.department.value,
      note: this.note.value,
    };

    if (this.selectedFile) {
      user.image = this.selectedFile;
    } else {
      user.imageGoogle = this.imageGoogle;
    }
    this.subscriptions.push(
      this.authService.createUser(user).subscribe({
        next: (response) => {
          if (response.token) {
            this.isSignedup = true;
            this.errorMessage = "";
            setTimeout(() => {
              this.router.navigate(["/login"]);
            }, 2000);
          }
        },
        error: (error) => {
          if (error.status === 500) {
            this.errorMessage =
              "Internal Server Error. Please try again later.";
          } else {
            this.errorMessage = error.message;
          }
          // Access other properties from the error response
          // For example, if the error response has a 'errorData' property
        },
      })
    );

    // this.postsService.addPost(
    //   this.fname,
    //   this.lname,
    //   this.fullName,
    //   this.birthDate,
    //   this.email,
    //   this.password,
    //   this.confirmPassword,
    //   this.image,
    //   this.Country,
    //   this.address,
    //   this.university,
    //   this.faculty,
    //   this.department,
    //   this.note
    // );

    // this.registerationForm.reset();
  }

  // ngOnInit(): void {}
  // getData() {
  //   this.registerationForm.patchValue({
  //   fname: 'Lamia',
  //   lname: 'Selim',
  //   fullName: 'Lamiaa Abdelmonem MahmoudSelim',
  //   birthDate: '1996-11-23',
  //   email: 'lamiaaselim1896@gmail.com',
  //   password: '2311',
  //   confirmPassword: '2311',
  //   country: '1',
  //   address: 'Menofia',
  //   university: 'Menofia',
  //   faculty: 'Education',
  //   department: 'Technology',
  //   note: 'no'
  //   })
  // }
}

interface User {
  fname: any;
  lname: any;
  fullName: any;
  birthDate: any;
  email: any;
  password: any;
  confirmPassword: any;
  country: any;
  address: any;
  university: any;
  faculty: any;
  department: any;
  note: any;
  image?: any; // Optional property
  imageGoogle?: any; // Optional property
}
