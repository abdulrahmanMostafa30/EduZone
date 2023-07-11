import { CourseService } from "../services/course.service";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { Component, OnInit, DoCheck } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { UserService } from "../services/user.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-course-details",
  templateUrl: "./course-details.component.html",
  styleUrls: ["./course-details.component.scss"],
})
export class CourseDetailsComponent implements OnInit, DoCheck {
  comments: string[] = [];
  safeUrl: SafeResourceUrl | null = null;
  currentVideoIndex: number = 0;
  previousVideoIndex: number = -1;
  user: any;
  course: any = null;
  id: string = "";
  errorMsg: any;
  errorMessage: any;
  hovered: number = 0;
  commentForm: FormGroup;

  constructor(
    private sanitizer: DomSanitizer,
    private courseService: CourseService,
    private route: ActivatedRoute,
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {
    this.commentForm = this.formBuilder.group({
      comment: ['', Validators.required],
      rating: ['', Validators.required]
    });
  }
  setRating(rating: number) {
    // Set the selected rating
    if(rating != 5){
      rating = rating + .5
    }
    this.commentForm.patchValue({
      rating: rating
    });
  }

  setHovered(stars: number) {
    // Set the number of stars being hovered
    this.hovered = stars;
  }

  clearHovered() {
    // Clear the number of hovered stars
    this.hovered = 0;
  }
  displayVideo(videoIndex: number) {
    this.currentVideoIndex = videoIndex;
  }
  getUserMe() {
    this.userService.getUserMe().subscribe({
      next: (response) => {
        if ((response.status = "success")) {
          this.user = response.data.data;
          const course = this.user.courseProgress.find(
            (c: any) => c.courseId === this.course._id
          );

          // Access the currentVideoIndex property
          if (course) {
            this.currentVideoIndex = course.currentVideoIndex;
            // Do something with the currentVideoIndex value
          }
        }
      },
      error: (error) => (this.errorMessage = error),
    });
  }
  ngDoCheck(): void {
    if (this.currentVideoIndex !== this.previousVideoIndex) {
      this.previousVideoIndex = this.currentVideoIndex;
      this.getSafeUrl();
    }
  }
  setCurrentVideo(index: number) {
    this.currentVideoIndex = index;
    // this.user.currentVideoIndex = index;
    // Check if the course already exists in the courseProgress array
    const existingCourseIndex = this.user.courseProgress.findIndex(
      (course: any) => course.courseId === this.course._id
    );

    if (existingCourseIndex !== -1) {
      // Course already exists, update the currentVideoIndex
      this.user.courseProgress[
        existingCourseIndex
      ].currentVideoIndex = this.currentVideoIndex;
    } else {
      // Course doesn't exist, add it to the courseProgress array
      this.user.courseProgress.push({
        courseId: this.course._id,
        currentVideoIndex: this.currentVideoIndex,
      });
    }

    this.userService.updateProfileMe(this.user).subscribe({
      next: (data) => {},
      error: (error) => {},
    });
  }

  getSafeUrl(): void {
    if (
      this.course &&
      this.course.vid &&
      this.course.vid.length > this.currentVideoIndex
    ) {
      const videoUrl = this.course.vid[this.currentVideoIndex].url;
      this.safeUrl = this.sanitizeUrl(videoUrl);
    }
  }

  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  addComment(): void {
    if (this.course && this.commentForm.valid) {
      const { comment, rating } = this.commentForm.value;
      this.courseService.addComment({
        id: this.course._id,
        comment: comment,
        rating: rating,
      }).subscribe(
        response => {
          this.commentForm.reset();
          this.getCourse();
        },
        error => {
          this.errorMessage = error // Clear the error message
          this.commentForm.reset();
        }
      );
    }
  }
  getCourse() {
    this.courseService.getCourseById(this.id).subscribe({
      next: (data) => {
        this.course = data;
        this.getSafeUrl();
      },
      error: (error) => (this.errorMessage = error),
    });
  }
  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.id = params["id"];
      this.getCourse();
      this.getUserMe();
    });
  }
}
