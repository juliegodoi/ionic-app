import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewPaymentPage } from './new-payment.page';

describe('NewPaymentPage', () => {
  let component: NewPaymentPage;
  let fixture: ComponentFixture<NewPaymentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPaymentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
