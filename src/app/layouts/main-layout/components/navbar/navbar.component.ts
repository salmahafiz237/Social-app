import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { AuthService } from '../../../../core/auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit{
  
  private readonly authService= inject(AuthService);
  profileData = signal<any>(null);

  ngOnInit(): void {
    initFlowbite();
    const user = localStorage.getItem('user');
    if (user) {
      this.profileData.set(JSON.parse(user));
    }
  }
  logOut():void{
    this.authService.logOut();
  }
}
