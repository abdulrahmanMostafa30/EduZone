import { Component, OnDestroy } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";

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

  constructor(private authService: AuthService) {
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
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
    this.roleChangedSubscription.unsubscribe();
  }
}
