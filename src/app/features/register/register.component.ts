import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LeftSideComponent } from '../../layouts/auth-layout/components/left-side/left-side.component';
import { AuthService } from '../../core/auth/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, LeftSideComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  mgText = signal("");
  isLoading = signal(false);

  registerForm = new FormGroup({
    name: new FormControl("", [Validators.required, Validators.minLength(3)]),
    username: new FormControl(""),
    email: new FormControl("",[Validators.required, Validators.email]),
    dateOfBirth: new FormControl("", Validators.required),
    gender: new FormControl("", Validators.required),
    password: new FormControl("", [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/)]),
    rePassword: new FormControl("", Validators.required)
  });

  sendRegisterData():void{
    if(this.registerForm.valid){      
      this.isLoading.set(true);
      console.log(this.registerForm.value);

      this.authService.signUp(this.registerForm.value).subscribe({
        next:(res) =>{console.log(res);
          if(res.success){
            this.router.navigate(['/login']);
          }
        },
        error:(err) =>{
          console.log(err.error.message);
          this.mgText.set(err.error.message);
          this.isLoading.set(false);
        },
        complete:()=>{
          this.isLoading.set(false);
        }
      });
    }
    else{
      this.registerForm.markAllAsTouched();
    }
  }
}
