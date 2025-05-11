import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { UserStateService } from './core/services/user-state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'good2give-client';

  constructor(
    private authService: AuthService,
    private userState: UserStateService
  ) {}

  ngOnInit(): void {
    try {
      console.log('AppComponent - Initializing application');

      // Make sure we try to load the current user when the app starts
      try {
        console.log('AppComponent - Loading current user');
        this.authService.loadCurrentUser();
      } catch (error) {
        console.error('AppComponent - Error loading current user:', error);
      }
    } catch (error) {
      console.error('AppComponent - Error during initialization:', error);
    }
  }
}
