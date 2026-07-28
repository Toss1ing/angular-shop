import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductEditPage } from './product-edit-page';

describe('ProductEditPage', () => {
  let component: ProductEditPage;
  let fixture: ComponentFixture<ProductEditPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductEditPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductEditPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
