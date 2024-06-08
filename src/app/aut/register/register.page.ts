import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  @ViewChild('passwordInput', { static: false }) passwordInput!: IonInput;
  @ViewChild('confirmPasswordInput', { static: false }) confirmPasswordInput!: IonInput;

  constructor() { }

  ngOnInit() {
  }

  togglePasswordVisibility(inputField: IonInput) {
    if (inputField.type === 'password') {
      inputField.type = 'text';
    } else {
      inputField.type = 'password';
    }
  }
}
