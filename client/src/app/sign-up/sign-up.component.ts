import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: "app-sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.scss"],
})
export class SignUpComponent implements OnInit {
  Country: any = [
    "Egypt",
    "Kuwait",
    "Morocco",
    "Palestine",
    "Saudi Arabia",
    "Other",
  ];
  isLoading = false;
  registerationForm: FormGroup | any;
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, public authService: AuthService) {}
  ngOnInit() {
    // using form builder services
    this.registerationForm = this.fb.group({
      image: [null],
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
      department: [""],
      note: [""],
    });
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
    return this.registerationForm.get('image').value

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

  changeCountry(e: any) {
    this.country?.setValue(e.target.value, {
      onlySelf: true,
    });
  }
  onSignup(e:Event) {

    e.preventDefault();

    if (this.registerationForm.invalid ) {
      console.log(this.registerationForm.invalid);

      return;
    }
    if(!this.selectedFile){
      return;
    }
    console.log('onSignup');

    this.isLoading = true;

    const user = {
      fname: this.fname.value,
      lname: this.lname.value,
      fullName: this.fullName.value,
      birthDate: this.birthDate.value,
      email: this.email.value,
      password: this.password.value,
      confirmPassword: this.confirmPassword.value,
      image: this.selectedFile,
      country:this.country.value.toString(),
      address: this.address.value,
      university: this.university.value,
      faculty: this.faculty.value,
      department: this.department.value,
      note: this.note.value,
    };
    console.log(user);

    this.authService.createUser(user);

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
