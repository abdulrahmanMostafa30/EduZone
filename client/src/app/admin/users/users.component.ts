import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/auth/auth.service";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"],
})
export class UsersComponent {
  users: any[] = [];
  openDropdowns: { [userId: string]: boolean } = {};
  user: any;
  constructor(private userService: UserService, private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.getUserMe()
    this.getAllUsers();
    this.users.forEach((user) => {
      this.openDropdowns[user._id] = false;
    });
  }
  getUserMe() {
    this.userService.getUserMe().subscribe({
      next: (response) => {
        if ((response.status = "success")) {
          this.user = response.data.data;
        }
      },
      error: (error) => (error),
    });
  }
  getAllUsers() {
    this.userService.getAllUsers().subscribe(
      (response) => {
        if (response.status === "success") {
          this.users = response.data.data;
        }
      },
      (error) => {
        console.error("Error getting users:", error);
      }
    );
  }
  // Declare a property to keep track of the open state of each dropdown
  dropdownOpenStates: { [key: string]: boolean } = {};

  // Method to toggle the dropdown state

  toggleDropdown(userId: string) {
    // Close other dropdowns
    Object.keys(this.openDropdowns).forEach((key) => {
      if (key !== userId) {
        this.openDropdowns[key] = false;
      }
    });

    // Toggle the dropdown state for the selected user
    this.openDropdowns[userId] = !this.openDropdowns[userId];
  }

  // Method to check if the dropdown is open
  isDropdownOpen(userId: string) {
    return this.openDropdowns[userId];
  }

  changeRole(userId: string, newRole: string) {
    const confirmed = confirm(
      "Are you sure you want to change Role this User?"
    );
    if (!confirmed) {
      return; // User canceled the deletion
    }

    this.userService.updateUser(userId, { role: newRole }).subscribe(
      (response) => {
        if (response.status === "success") {
          if(userId == this.user._id){
            this.authService.setRole(newRole)
            this.router.navigate(["/"]);
          }
          // Update the role in the users list
          const userIndex = this.users.findIndex((user) => user._id === userId);
          if (userIndex !== -1) {
            this.users[userIndex].role = newRole;
          }
        }
      },
      (error) => {
        console.error("Error changing role:", error);
      }
    );
  }

  viewDetails(userId: string) {
    this.router.navigate(["/profile/admin/user-details", userId]);
  }

  removeUser(userId: string) {
    const confirmed = confirm("Are you sure you want to delete this user?");
    if (!confirmed) {
      return; // User canceled the deletion
    }

    this.userService.removeUser(userId).subscribe(
      (response) => {
        // Remove the user from the users list
        this.users = this.users.filter((user) => user._id !== userId);
      },
      (error) => {
        console.error("Error removing user:", error);
      }
    );
  }
}
