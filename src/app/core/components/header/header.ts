import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../../features/auth/service/auth.service';
import { User } from '../../../features/auth/models/user';

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
export class Header implements OnInit {
  navItems: HeaderNavItems[] = [
    {
      label: 'Products',
      url: '/',
    },
    {
      label: 'Create new product',
      url: '/product/create',
    }
  ];

  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.refreshUser();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.refreshUser();
      }
    });
  }

  get userDisplayEmail(): string {
    if (!this.currentUser) {
      return '';
    }

    return this.currentUser.email
  }

  logout(): void {
    this.authService.logout();
    this.refreshUser();
    this.router.navigate(['/']);
  }

  public onNavItemClick(item: HeaderNavItems): void {
    this.router.navigate([item.url]);
  }

  private refreshUser(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.changeDetectorRef.detectChanges();
  }
}
