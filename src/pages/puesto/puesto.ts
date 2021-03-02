import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TodosProvider } from '../../providers/todos/todos';
/**
 * Generated class for the PuestoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-puesto',
  templateUrl: 'puesto.html',
})
export class PuestoPage {

  puesto:any;
  colorArray: any;
  stateArray: any;
  isModified: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public todoService: TodosProvider) {
    this.puesto = navParams.get("puesto");

    this.isModified = false;
    
    this.colorArray = [
      // '#00A1F1', //blue
      '#D3D3D3', //grey
      '#FFBB00', //yellow
      '#F65314', //red
      '#7CBB00', // green
    ];

    this.stateArray = [
      'Libre',
      'Ocupado',
      'Pendiente',
      'Pagado'
    ];

  }

  ionViewDidLoad() {
    // console.log('Load View Puesto id: '+this.puesto._id);
  }

  ionViewWillLeave() {
    if (this.isModified){
      this.todoService.updateDoc(this.puesto);
      this.isModified = false;
      console.log("Puesto Updated");
    }
    // console.log('Closed View Puesto id: '+this.puesto._id);
  }

  UpdateChanges(){
    this.isModified = true;
    console.log("Puesto Modified");
  }

}
