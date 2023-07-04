import { Component, OnInit } from '@angular/core';
import { CartService } from './cart.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {
  errorMessage:any
  courses: any[] = []
  totalPrice:number = 0
  constructor(private cartService: CartService){
  }
  removeItem(itemID:string){

    this.cartService.remove(itemID).subscribe({
      next: (response) => {
        this.getCardItems()
      },
      error: (error) => {
        this.errorMessage = error.message;
      },
    });
  }
  ngOnInit(): void {
    this.getCardItems()
  }
  getCardItems(){
    this.cartService.getCartItems().subscribe({
      next: (response) => {
        this.courses = response.data
        this.totalPrice = this.courses.reduce((sum, course) => sum + course.price, 0);
      },
      error: (error) => {
        this.errorMessage = error.message;
      },
    });
  }
}
