import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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
  private readonly formBuilder = inject(FormBuilder);
  mgText = signal("");
  isLoading = signal(false);

  registerForm = this.formBuilder.group({
    name: ['',  [Validators.required, Validators.minLength(3)]],
    username: [''],
    email: ['', [Validators.required, Validators.email]],
    dateOfBirth: ['', Validators.required],
    gender: ['', Validators.required],
    password: ['',[Validators.required,Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-]).{8,}$/)]],
    rePassword: ['', Validators.required]
  }, { validators:this.confirmPassword})

  // registerForm = new FormGroup({
  //   name: new FormControl("", [Validators.required, Validators.minLength(3)]),
  //   username: new FormControl(""),
  //   email: new FormControl("",[Validators.required, Validators.email]),
  //   dateOfBirth: new FormControl("", Validators.required),
  //   gender: new FormControl("", Validators.required),
  //   password: new FormControl("", [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/)]),
  //   rePassword: new FormControl("", Validators.required)
  // });

  confirmPassword(group:AbstractControl){
    let password = group.get('password')?.value;
    let rePassword = group.get('rePassword')?.value;
    if(password !== rePassword){
      return {missMatch:true};
    }else{
      return null;
    }
  }

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
