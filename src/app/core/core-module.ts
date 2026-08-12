import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from './components/header/header';
import { MaterialModule } from '../shared/material/material-module';
import { RouterLink, RouterLinkActive } from '@angular/router';

@NgModule({
  declarations: [Header],
  imports: [CommonModule, MaterialModule, RouterLinkActive, RouterLink],
  exports: [Header, MaterialModule],
})
export class CoreModule {}
