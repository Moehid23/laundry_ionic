import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TarifPage } from './tarif.page';

describe('TarifPage', () => {
  let component: TarifPage;
  let fixture: ComponentFixture<TarifPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TarifPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
