import { Component ,ViewChild ,ElementRef ,OnInit } from '@angular/core';

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
  videoUrls: string[] = [
    "https://www.youtube.com/embed/RHsuArdyZUI",
    "https://www.youtube.com/embed/ogUfVTA5AlA",
    "https://www.youtube.com/embed/Rj5MXsPslVo",
    "https://www.youtube.com/embed/ogUfVTA5AlA",
    "https://www.youtube.com/embed/RHsuArdyZUI",
    "https://www.youtube.com/embed/ogUfVTA5AlA",
    "https://www.youtube.com/embed/RHsuArdyZUI",
    "https://www.youtube.com/embed/ogUfVTA5AlA",
    "https://www.youtube.com/embed/RHsuArdyZUI",
    "https://www.youtube.com/embed/ogUfVTA5AlA",
    "https://www.youtube.com/embed/RHsuArdyZUI",
    "https://www.youtube.com/embed/ogUfVTA5AlA"

    // url of video
  ];
  currentVideoUrl: string = this.videoUrls[0]; //  Url of Default video

  displayVideo(videoIndex: number) {
    if (videoIndex >= 0 && videoIndex < this.videoUrls.length) {
      this.currentVideoUrl = this.videoUrls[videoIndex];
    }
  }
  ngOnInit() {
    // // in case page refresh saved comments
    // const storedComments = localStorage.getItem('comments');
    // if (storedComments) {
    //   this.comments = JSON.parse(storedComments);
    // }
  }
}
