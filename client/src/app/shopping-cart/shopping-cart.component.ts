import { Component, OnInit } from '@angular/core';
import { CartService } from './cart.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {
  errorMessage:any
  courses: any[] = []
  constructor(private cartService: CartService){

  }
  removeFromCartList(){

  }
  ngOnInit(): void {
    this.getCardItems()
  }
  getCardItems(){
    this.cartService.getCartItems().subscribe({
      next: (response) => {
        this.courses = response.data
      },
      error: (error) => {
        this.errorMessage = error.message;
      },
    });
  }
}
