import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Slide1Page } from './slide-1.page';

describe('Slide1Page', () => {
  let component: Slide1Page;
  let fixture: ComponentFixture<Slide1Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Slide1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
