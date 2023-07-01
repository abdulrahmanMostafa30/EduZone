import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoursesService } from '../courses.service';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss']
})
export class CourseDetailsComponent implements OnInit {

  @ViewChild('mycomment', { static: false }) myCommentInput!: ElementRef;
  comments: string[] = [];
  onclick() {
    const comment = this.myCommentInput.nativeElement.value;
    this.comments.push(comment);
    // // Store the comments in localStorage
    // localStorage.setItem('comments', JSON.stringify(this.comments));
    // Clear the input after adding the comment
    this.myCommentInput.nativeElement.value = '';
  }

  course: any = null;
  id: any;
  currentVideoIndex: number = 0;
  errorMsg: any;

  constructor(private sanitizer: DomSanitizer, private coursesService: CoursesService, private route: ActivatedRoute) { }

  displayVideo(videoIndex: number) {
    this.currentVideoIndex = videoIndex;
  }

  getSafeUrl(): SafeResourceUrl {
    const videoUrl = this.course.vid[this.currentVideoIndex].url;
    console.log(this.currentVideoIndex);
    return this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl);
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.coursesService.getCourseById(this.id).subscribe((data) => {
      this.course = data;
    });
  }
}
