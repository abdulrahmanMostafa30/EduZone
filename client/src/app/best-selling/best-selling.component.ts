import { Component } from '@angular/core';

@Component({
  selector: 'app-best-selling',
  templateUrl: './best-selling.component.html',
  styleUrls: ['./best-selling.component.scss']
})

export class BestSellingComponent {
  products: { coursetName: string, category: string, price: string, image: string }[] = [
    {
      coursetName: 'HTML',
      category: 'Web Development',
      price: '100$',
      image: '/'
    },
    {
      coursetName: 'HTML',
      category: 'Web Development',
      price: '100$',
      image: '/'
    },
    {
      coursetName: 'HTML',
      category: 'Web Development',
      price: '100$',
      image: '/'
    }
  ];
}
