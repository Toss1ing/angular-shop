import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlpPage } from './plp-page';

describe('PlpPage', () => {
  let component: PlpPage;
  let fixture: ComponentFixture<PlpPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlpPage],
    }).compileComponents();

    fixture = TestBed.createComponent(PlpPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
