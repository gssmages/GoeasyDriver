import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-areamodal',
  templateUrl: './areamodal.component.html',
  styleUrls: ['./areamodal.component.scss'],
})
export class AreamodalComponent implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  async closeModal()
  {
    await this.modalController.dismiss();
  }

}