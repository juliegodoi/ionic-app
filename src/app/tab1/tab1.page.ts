import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page {

  constructor(private navCtrl: NavController) { }


  addNewProduct() {
    this.navCtrl.navigateForward('/new-product');
  }

  addNewClient() {
    this.navCtrl.navigateForward('/new-client');
  }

  addNewSale() {
    this.navCtrl.navigateForward('/new-sale');
  }

  // addNewPayment() {
  //   this.navCtrl.navigateForward('/new-payment');
  // }

}
