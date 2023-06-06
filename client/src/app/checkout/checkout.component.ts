// import {bootstrap}    from '@angular/platform-browser-dynamic';
import { Component } from "@angular/core";

@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.scss"],
})
export class CheckoutComponent {
  gatewaySelected: string = "";
  selectedPaymentGateway(gateway: string) {
    this.gatewaySelected = gateway;
  }
}
