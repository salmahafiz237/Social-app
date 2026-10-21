import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LeftSideComponent } from '../../layouts/auth-layout/components/left-side/left-side.component';

@Component({
  selector: 'app-login',
  imports: [RouterLink, LeftSideComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {}
