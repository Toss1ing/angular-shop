import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { Exception } from '../../../products/models/exception';

@Component({
  selector: 'app-login-page',
  standalone: false,
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  loginForm: FormGroup;
  errorMessage = '';
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;

    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      error: (error:Error) => {
        console.log(error.message);

        this.isLoading = false;

        if(error.message === Exception.INVALID_CREDENTIALS) {
          this.errorMessage = 'Invalid email or password';
        }

        this.changeDetectorRef.detectChanges();
      },
    });
  }

  openSingUpPage(): void {
    this.router.navigate(['/singup'])
  }
}
