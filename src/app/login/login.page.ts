import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private router: Router,
    public menu: MenuController,
  ) { }

  ngOnInit() {
  }
  ionViewWillEnter(){this.menu.enable(false);}
   ionViewDidLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }
  login()
  {
    this.router.navigate(['/home']);
  }
}
