import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page {
  greetingText: string = '';
  greetingIcon: string = '';

  constructor(private navCtrl: NavController) {
    this.setGreeting();
  }

  setGreeting() {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      this.greetingText = 'Bom dia!';
      this.greetingIcon = 'sunny';
    } else if (hour >= 12 && hour < 18) {
      this.greetingText = 'Boa tarde!';
      this.greetingIcon = 'partly-sunny';
    } else {
      this.greetingText = 'Boa noite!';
      this.greetingIcon = 'moon';
    }
  }

  addNewProduct() {
    this.navCtrl.navigateForward('/new-product');
  }

  addNewClient() {
    this.navCtrl.navigateForward('/new-client');
  }

  addNewSale() {
    this.navCtrl.navigateForward('/new-sale');
  }

  addNewPayment() {
    this.navCtrl.navigateForward('/new-payment');
  }

}
