import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent {
  @Input() comments: any[] = [];

  getFilledStars(rating: number): number[] {
    if(rating != 5){
      rating = rating - .5
    }
    return Array(Math.floor(rating)).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    if(rating != 5){
      rating = rating - .5
    }
    return Array(Math.floor(5 - rating)).fill(0);
  }
}
