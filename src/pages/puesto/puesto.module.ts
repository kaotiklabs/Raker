import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PuestoPage } from './puesto';

@NgModule({
  declarations: [
    PuestoPage,
  ],
  imports: [
    IonicPageModule.forChild(PuestoPage),
  ],
  exports: [
    PuestoPage
  ]
})
export class PuestoPageModule {}
