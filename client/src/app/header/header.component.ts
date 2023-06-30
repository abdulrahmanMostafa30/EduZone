import { Component } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent {
  userIsAuthenticated = false;
  role: string | null = "";
  private authListenerSubs: Subscription | any;

  constructor(private authService: AuthService) {}

  ngOnInit() {


    this.userIsAuthenticated = this.authService.getIsAuth();
    this.role = this.authService.getRole();

    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.role = this.authService.getRole();
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
