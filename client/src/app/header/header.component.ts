import { Component, OnDestroy } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";
import { CartService } from "../services/cart.service";
import { UserService } from "../services/user.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnDestroy {
  userIsAuthenticated = false;
  role: string | null = "";
  user: any;
  private authListenerSubs: Subscription | any;
  private roleChangedSubscription: Subscription;
  cartItemCount = 0;
  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private userService: UserService
  ) {
    this.roleChangedSubscription = this.authService.roleChanged.subscribe(
      (role: string) => {
        this.role = role;
      }
    );
  }
  getUserMe() {
    this.userService.getUserMe().subscribe({
      next: (response) => {
        if ((response.status = "success")) {
          this.user = response.data.data;
        }
      },
      error: (error) => (this.user = null),
    });
  }
  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    if (this.userIsAuthenticated) {
      this.user = this.getUserMe();
    } else {
      this.user = null;
    }
    this.userService.userChanged.subscribe(() => {
      this.user = this.getUserMe();
    });
    this.role = this.authService.getRole();

    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.role = this.authService.getRole();
        this.userIsAuthenticated = isAuthenticated;
        if (isAuthenticated) {
          this.user = this.getUserMe();
        } else {
          this.user = null;
        }
      });
    this.roleChangedSubscription = this.authService.roleChanged.subscribe(
      (role: string) => {
        this.role = role;
        // Handle the role change in your component
      }
    );
    this.cartService.cartItems.subscribe((items) => {
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
