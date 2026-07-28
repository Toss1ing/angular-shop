import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CoreModule } from './core/core-module';
import { ProductsModule } from './features/products/products-module';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CoreModule, ProductsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
