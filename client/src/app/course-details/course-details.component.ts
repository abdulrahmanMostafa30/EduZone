import { CourseService } from "../course/course.service";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { Component, OnInit, DoCheck } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { UserService } from "../profile/user.service";

@Component({
  selector: "app-course-details",
  templateUrl: "./course-details.component.html",
  styleUrls: ["./course-details.component.scss"],
})
export class CourseDetailsComponent implements OnInit, DoCheck {
  comments: string[] = [];
  comment: string = "";
  safeUrl: SafeResourceUrl | null = null;
  currentVideoIndex: number = 0;
  previousVideoIndex: number = -1;
  user: any;
  course: any = null;
  id: string = "";
  errorMsg: any;
  errorMessage: any;
  constructor(
    private sanitizer: DomSanitizer,
    private courseService: CourseService,
    private route: ActivatedRoute
  ) {}

  displayVideo(videoIndex: number) {
    console.log(videoIndex);

    this.currentVideoIndex = videoIndex;
  }

  ngDoCheck(): void {
    if (this.currentVideoIndex !== this.previousVideoIndex) {
      this.previousVideoIndex = this.currentVideoIndex;
      this.getSafeUrl();
    }
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

  addComment() {
    if (this.course) {
      if (this.comment != "") {
        this.courseService
          .addComment({ id: this.course._id, comment: this.comment })
          .subscribe({
            next: (response) => {
              this.comment = "";
              this.getCourse();
            },
            error: (error) => {
              this.errorMessage = error;
              this.comment = "";
            },
          });
      }
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
    });
  }
}
