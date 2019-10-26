import { Component } from "@angular/core";
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"]
})
export class Tab1Page {
  slideOpt = {
    allowSlidePrev: false,
    allowSlideNext: false
  };

  constructor(private barcodeScanner: BarcodeScanner) {}

  ionViewDidEnter() {
    console.log("viewDidEnter");
  }

  ionViewDidLeave() {
    console.log("viewDidLeave");
  }

  ionViewWillEnter() {
    this.scan();
  }

  ionViewWillLeave() {
    console.log("willleave");
  }

  scan() {
    this.barcodeScanner
      .scan()
      .then(barcodeData => {
        console.log("Barcode data", barcodeData);
      })
      .catch(err => {
        console.log("Error", err);
      });
  }
}
