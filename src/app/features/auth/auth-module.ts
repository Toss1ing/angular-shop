import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginPage } from './pages/login-page/login-page';
import { AuthRoutingModule } from './auth-routing-module';
import { MaterialModule } from '../../shared/material/material-module';
import { SignupPage } from './pages/signup-page/signup-page';

@NgModule({
  declarations: [LoginPage, SignupPage],
  imports: [CommonModule, ReactiveFormsModule, MaterialModule, AuthRoutingModule],
})
export class AuthModule {}
