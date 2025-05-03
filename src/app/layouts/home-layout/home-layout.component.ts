import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home-layout',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.css'],
})
export class HomeLayoutComponent implements OnInit {
  isAuthenticated = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.authService.currentUser$.subscribe(() => {
      this.isAuthenticated = this.authService.isAuthenticated();
    });
  }
}
