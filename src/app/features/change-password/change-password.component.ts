import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/services/auth.service';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})

export class ChangePasswordComponent {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);

  errorMsg = signal<string>('');
  successMsg = signal<string>('');

  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character
  private readonly passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=])[A-Za-z\d@$!%*?&#^()_\-+=]{8,}$/;

  changePasswordForm = this.formBuilder.group(
    {
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: this.passwordMatchValidator }
  );

  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const newPass = group.get('newPassword')?.value;
    const confirmPass = group.get('confirmPassword')?.value;
    return newPass === confirmPass ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      return;
    }

    this.errorMsg.set('');
    this.successMsg.set('');

    const payload = {
      password: this.changePasswordForm.value.currentPassword!,
      newPassword: this.changePasswordForm.value.newPassword!,
    };

    this.authService.changePassword(payload).subscribe({
      next: (res) => {
        if (res.success) {
          localStorage.setItem('token', res.data.token);
          this.successMsg.set(res.message || 'Password changed successfully');
          this.changePasswordForm.reset();
        }
      },
      error: (err) => {
        this.errorMsg.set(err.error?.message || 'Failed to change password');
      },
    });
  }
}