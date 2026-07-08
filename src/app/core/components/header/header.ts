import { Component } from '@angular/core';

interface HeaderNavItems {
  label: string;
  url: string;
}

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

  navItems: HeaderNavItems[] = [
    {
      label: 'Home',
      url: '/',
    },
    {
      label: 'Products',
      url: '/',
    },
    {
      label: 'Categories',
      url: '/',
    },
    {
      label: 'About',
      url: '/',
    },
    {
      label: 'Contact',
      url: '/',
    },
  ]
}
