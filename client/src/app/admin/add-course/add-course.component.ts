import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { CategoryService } from "src/app/services/category.service";
import { CourseService } from "src/app/services/course.service";

@Component({
  selector: "app-add-course",
  templateUrl: "./add-course.component.html",
  styleUrls: ["./add-course.component.scss"],
})
export class AddCourseComponent implements OnInit {
  subscriptions: Subscription[] = [];
  categories:any
  // courseForm: FormGroup;
  // videos: FormArray;
  courseForm: FormGroup | any;

  constructor(
    private courseService: CourseService,
    private router: Router,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService
  ) {}

  selectedFile: File | undefined;
  ngOnInit() {
    this.getCategories()
    this.courseForm = this.formBuilder.group({
      title: ["", Validators.required],
      description: ["", Validators.required],
      category: ["", Validators.required],
      price: [null, Validators.required],
      course_content_length: [null, Validators.required],
      image: [null, Validators.required],
      videos: this.formBuilder.array([]),
    });
  }
  errorMessage: any;
  courseAdded = false;

  getCategories() {
    this.categoryService.getCategories().subscribe(
      (categories) => {
        this.categories = categories;
      },
      (error) => {
        console.error("Error fetching categories:", error);
      }
    );
  }
  getCategoryIdByName(categoryName: string): string {
    const category = this.categories.find((cat: any) => cat.name === categoryName);
    return category ? category._id : '';
  }

  addCourse() {
    if (this.selectedFile) {


      this.courseService
        .addCourse(this.courseForm, this.selectedFile)
        .subscribe({
          next: (response) => {
            this.courseAdded = true;
            setTimeout(() => {
              this.router.navigate(["/profile/admin/dashboard"]);
            }, 500);
          },
          error: (error) => (this.errorMessage = error),
        });
    }
  }
  youtubeUrlValidator(control: AbstractControl): ValidationErrors | null {
    const url = control.value;

    const urlPattern = /^(?:https?:\/\/www\.youtube\.com\/(?:watch\?v=|embed\/))(.*)$/;

    if (url && !urlPattern.test(url)) {
      return { invalidYoutubeUrl: true };
    }

    const replacedUrl = url.replace("watch?v=", "embed/");

    if (url !== replacedUrl) {
      control.setValue(replacedUrl, { emitEvent: false });
    }

    return null;
  }
  addVideo() {
    const videos = this.courseForm.get("videos") as FormArray;
    const videoFormGroup = this.formBuilder.group({
      title: ["", Validators.required],
      url: ["", [Validators.required, this.youtubeUrlValidator.bind(this)]],
    });

    const urlControl = videoFormGroup.get("url");

    // Subscribe to valueChanges for real-time validation
    const urlSubscription = urlControl?.valueChanges.subscribe(() => {
      urlControl?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    });

    // Unsubscribe from valueChanges on component destruction
    if (urlSubscription) this.subscriptions.push(urlSubscription);

    videos.push(videoFormGroup);
  }

  removeVideo(index: number) {
    const videos = this.courseForm.get("videos") as FormArray;
    videos.removeAt(index);
  }
  handleImageUpload(event: any) {
    this.selectedFile = event.target.files[0];
  }
}
