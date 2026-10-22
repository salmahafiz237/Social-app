import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LeftSideComponent } from '../../layouts/auth-layout/components/left-side/left-side.component';
import { AuthService } from '../../core/auth/services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
// import { NgClass } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, LeftSideComponent, ɵInternalFormsSharedModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  mgText = signal("");
  

  loginForm = new FormGroup({
    email: new FormControl("",[Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/)]),
  });

  sendLoginData():void{
    if(this.loginForm.valid){      
      console.log(this.loginForm.value);

      this.authService.signIn(this.loginForm.value).subscribe({
        next:(res) =>{console.log(res);
          if(res.success){
            this.router.navigate(['/timeline']);
          }
        },
        error:(err) =>{
          console.log(err.error.message);
          this.mgText.set(err.error.message);
        },
      });
    }
    else{
      this.loginForm.markAllAsTouched();
    }
  }
}
