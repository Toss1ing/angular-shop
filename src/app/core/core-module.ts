import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { MaterialModule } from '../shared/material/material-module';

@NgModule({
  declarations: [Header, Footer],
  imports: [CommonModule, MaterialModule],
  exports: [Footer, Header, MaterialModule],
})
export class CoreModule {}
