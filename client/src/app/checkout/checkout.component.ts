// import {bootstrap}    from '@angular/platform-browser-dynamic';
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CartService } from "../services/cart.service";
import { PaypalService } from "../services/paypal-service.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.scss"],
})
export class CheckoutComponent implements OnInit {
  public payPalConfig: any;
  public paymentStatus: boolean = false;
  public showPaypalButtons: boolean = false; // Added declaration
  courses: any[] = [];
  paymentId: string = "";
  totalPrice: number = 0;
  errorMessage: string = "";
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private paypalService: PaypalService
  ) {}
  extractECTokenFromUrl(url: string): string | null {
    const matches = url.match(/EC-\w+/);
    return matches ? matches[0] : null;
  }

  getPaymentIdFromUrl(): string {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentId = urlParams.get("paymentId");
    if (paymentId) return paymentId;
    else {
      return "";
    }
  }
  initPaypalConfig() {
    this.payPalConfig = {
      currency: "USD",
      clientId: environment.PAYPAL_CLIENT_ID,
      createOrderOnServer: () => {
        return new Promise((resolve, reject) => {
          this.paypalService.createPayment().subscribe(
            (response: any) => {
              if (response && response.approvalUrl) {
                this.paymentId = response.orderId;

                const ecToken = this.extractECTokenFromUrl(
                  response.approvalUrl
                );
                if (ecToken) {
                  resolve(ecToken);
                } else {
                  reject(
                    new Error("Failed to extract EC token from approval URL.")
                  );
                }
              } else {
                reject(new Error("Invalid response from createPayment."));
              }
            },
            (error: any) => {
              reject(error);
            }
          );
        });
      },
      onApprove: async (data: any, actions: any) => {
        const paymentId = data.paymentID; // Retrieve the paymentId from the response

        if (paymentId && data.payerID) {
          const executePaymentPayload = {
            payer_id: data.payerID,
          };

          this.paypalService.capturePayment(paymentId, data.payerID).subscribe(
            (response: any) => {
              // Handle the success response
              this.paymentStatus = true;
              // Redirect or show success message to the user
            },
            (error: any) => {
              // Handle the error case
              console.error("Failed to capture PayPal payment.", error);
            }
          );
        } else {
          console.error("Payment ID not found.");
        }
      },

      onError: (err: any) => {
        console.log(err);
      },
    };
  }

  gatewaySelected: string = "";
  selectedPaymentGateway(gateway: string) {
    this.gatewaySelected = gateway;
  }
  // Stripe
  paymentHandler: any = null;
  makePayment() {
    const paymentHandler = (<any>window).StripeCheckout.configure({
      key: environment.STRIPE_KEY,
      locale: "auto",
      token: function (stripeToken: any) {
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
          key: environment.STRIPE_KEY,
          locale: "auto",
          token: function (stripeToken: any) {
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
    this.initPaypalConfig();
  }
}
