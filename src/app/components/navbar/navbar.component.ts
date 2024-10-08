import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  /**
   *
   */
  constructor(public authService: AuthService) {}

  // https://stackoverflow.com/questions/34323480/in-angular-how-do-you-determine-the-active-route
}
