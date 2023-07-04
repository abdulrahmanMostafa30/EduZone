// import {bootstrap}    from '@angular/platform-browser-dynamic';
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ICreateOrderRequest } from "ngx-paypal";
import { CoursesService } from "../courses.service";
import { CartService } from "../shopping-cart/cart.service";
import { UserService } from "../profile/user.service";

@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.scss"],
})
export class CheckoutComponent implements OnInit {
  public payPalConfig: any;
  public showPaypalButtons: boolean = false; // Added declaration
  courses: any[] = [];
  totalPrice: number = 0;
  errorMessage: string = "";
  constructor(
    private route: ActivatedRoute,
    private coursesService: CoursesService,
    private router: Router,
    private cartService: CartService,
    private userService: UserService
  ) {}

  gatewaySelected: string = "";
  selectedPaymentGateway(gateway: string) {
    this.gatewaySelected = gateway;
  }
  // Stripe
  paymentHandler: any = null;
  makePayment() {
    const paymentHandler = (<any>window).StripeCheckout.configure({
      key:
        "pk_test_51NMeY2Ha08wV5yekM9osQdLpYjYKU64TaXOY6mgBhrIu60UXmRum3cFxCVjnyzWhdw8gsRjAuqRbagyflaMn30PP00w8LPbIJp",
      locale: "auto",
      token: function (stripeToken: any) {
        console.log(stripeToken);
        alert("Stripe token generated!");
      },
    });
    paymentHandler.open({
      name: "Positronx",
      description: "3 widgets",
      amount: this.totalPrice * 100,
    });
  }
  invokeStripe() {
    if (!window.document.getElementById("stripe-script")) {
      const script = window.document.createElement("script");
      script.id = "stripe-script";
      script.type = "text/javascript";
      script.src = "https://checkout.stripe.com/checkout.js";
      script.onload = () => {
        this.paymentHandler = (<any>window).StripeCheckout.configure({
          key:
            "pk_test_51NMeY2Ha08wV5yekM9osQdLpYjYKU64TaXOY6mgBhrIu60UXmRum3cFxCVjnyzWhdw8gsRjAuqRbagyflaMn30PP00w8LPbIJp",
          locale: "auto",
          token: function (stripeToken: any) {
            console.log(stripeToken);
            alert("Payment has been successfull!");
          },
        });
      };
      window.document.body.appendChild(script);
    }
  }

  getCardItems() {
    this.cartService.getCartItems().subscribe({
      next: (response) => {
        this.courses = response.data;
        this.totalPrice = this.courses.reduce(
          (sum, course) => sum + course.price,
          0
        );
      },
      error: (error) => {
        this.errorMessage = error.message;
      },
    });
  }
  ngOnInit() {
    this.getCardItems();
    this.invokeStripe();
    // paypal
    this.payPalConfig = {
      currency: "EUR",
      clientId:
        "AfMFe_fPS2ino2nBE72wzbMU2-PGKkT0t_uc_yVZyLE3xHQDtANe3zcZc50wiFFJT8FDBPoMHDaMz6Vf",
      createOrder: (data: any, actions: any) =>
        <ICreateOrderRequest>{
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: "EUR",
                value: "9.99",
                breakdown: {
                  item_total: {
                    currency_code: "EUR",
                    value: "9.99",
                  },
                },
              },
              items: [
                {
                  name: "Enterprise Subscription",
                  quantity: "1",
                  category: "DIGITAL_GOODS",
                  unit_amount: {
                    currency_code: "EUR",
                    value: "9.99",
                  },
                },
              ],
            },
          ],
        },
      advanced: {
        commit: "true",
      },
      style: {
        label: "paypal",
        layout: "vertical",
      },
      onApprove: (data: any, actions: any) => {
        console.log(
          "onApprove - transaction was approved, but not authorized",
          data,
          actions
        );
        actions.order.get().then((details: any) => {
          console.log(
            "onApprove - you can get full order details inside onApprove: ",
            details
          );
        });
      },
      onClientAuthorization: (data: any) => {
        console.log(
          "onClientAuthorization - you should probably inform your server about the completed transaction at this point",
          data
        );
      },
      onCancel: (data: any, actions: any) => {
        console.log("OnCancel", data, actions);
      },
      onError: (err: any) => {
        console.log("OnError", err);
      },
      onClick: (data: any, actions: any) => {
        console.log("onClick", data, actions);
      },
    };
  }

  pay() {
    this.showPaypalButtons = true;
  }

  back() {
    this.showPaypalButtons = false;
  }
}
