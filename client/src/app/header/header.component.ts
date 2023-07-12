import { Component, OnDestroy } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";
import { CartService } from "../services/cart.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnDestroy {
  userIsAuthenticated = false;
  role: string | null = "";
  private authListenerSubs: Subscription | any;
  private roleChangedSubscription: Subscription;
  cartItemCount = 0
  constructor(private authService: AuthService, private cartService: CartService) {
    this.roleChangedSubscription = this.authService.roleChanged.subscribe(
      (role: string) => {
        this.role = role;
      }
    );
  }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.role = this.authService.getRole();

    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.role = this.authService.getRole();
        this.userIsAuthenticated = isAuthenticated;
      });
    this.roleChangedSubscription = this.authService.roleChanged.subscribe(
      (role: string) => {
        this.role = role;
        // Handle the role change in your component
      }
    );
    this.cartService.cartItems.subscribe(items => {
      this.cartItemCount = items.length;
    });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
    this.roleChangedSubscription.unsubscribe();
  }
}
