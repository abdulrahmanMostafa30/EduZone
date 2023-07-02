import { CourseService } from "../course/course.service";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { Component, ViewChild, ElementRef, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { UserService } from "../profile/user.service";

@Component({
  selector: "app-course-details",
  templateUrl: "./course-details.component.html",
  styleUrls: ["./course-details.component.scss"],
})
export class CourseDetailsComponent implements OnInit {
  comments: string[] = [];
  comment: string = "";

  user: any;
  course: any = null;
  id: string = "";
  currentVideoIndex: number = 0;
  errorMsg: any;
  errorMessage: any;
  constructor(
    private sanitizer: DomSanitizer,
    private courseService: CourseService,
    private route: ActivatedRoute
  ) {}

  displayVideo(videoIndex: number) {
    this.currentVideoIndex = videoIndex;
  }

  getSafeUrl(): SafeResourceUrl {
    if( this.course){
      const videoUrl = this.course.vid[this.currentVideoIndex].url;
      return this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl);
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl('');


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
