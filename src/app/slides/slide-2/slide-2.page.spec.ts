import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Slide2Page } from './slide-2.page';

describe('Slide2Page', () => {
  let component: Slide2Page;
  let fixture: ComponentFixture<Slide2Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Slide2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
