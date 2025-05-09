import { Component } from '@angular/core';
import { Router } from '@angular/router'; // <-- ✅ Add this line

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(private router: Router) {}

  onLoginClick(): void {
    this.router.navigate(['/login']);
  }
  onRegisterClick() {
    this.router.navigate(['/register']);
  }
}
