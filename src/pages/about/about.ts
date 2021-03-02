import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { TodosProvider } from '../../providers/todos/todos';
import {PuestoPage} from '../../pages/puesto/puesto';


@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

    data: any;
    myDate: String = new Date().toISOString();
    searchItems: string[];

    colorArray: any;
    stateArray: any;
    nameArray: any;
    surnameArray: any;

  constructor(public navCtrl: NavController, public todoService: TodosProvider, public alertCtrl: AlertController) {

    console.log('Constructor AboutPage');


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

    this.nameArray = [
      'Miguel', 'Ramón',
      'Fernando', 'Francisco',
      'Domingo', 'Rodrigo',
      'Julian', 'José',
      'Jesus', 'Antonio'
    ];

    this.surnameArray = [
      'Carmona', 'Cortés',
      'Jimenez', 'Hernandez',
      'Contreras', 'Flores',
      'Heredia', 'Vargas',
      'Amaya', 'Cruz'
    ];

  }


  initializeSearchItems() {
    console.log('initialize search items');

    this.searchItems = [];

    Object.keys(this.data).forEach(key=> {
      this.searchItems.push(this.data[key].name);
      console.log("adding search item "+this.data[key].name);
    });

  }

  ionViewDidLoad(){
      this.todoService.getDocs().then((data) => {
        this.data = data;
        this.initializeSearchItems();
      });
    }

    itemClick = function(todo){
      this.navCtrl.push(PuestoPage, {puesto:todo});
    }

  //import default array template to db
  importTemplate(){

    var puestosArray = new Array;
    puestosArray = [];


    for (var i = 0; i < 100; i++){

      console.log(i);

      var bufComment = "Falta pedirle el dni";
      var bufSector = Math.floor(Math.random() * 8)+1;

      // console.log("Owner: "+bufOccupant);

      var arrayEvents = new Array();


      //add historial events
      for (var j = 0; j < 10; j++){

        //trick to generate dates
        var d = new Date();
        d.setDate(d.getDate()-7*j);

        var event = {
          date: d.toISOString(),
          occupant: this.surnameArray[Math.floor(Math.random() * 4)]+", "+this.nameArray[Math.floor(Math.random() * 4)],
          comment: bufComment,
          state: Math.floor(Math.random() * 4),
          reserved: Math.random() >= 0.5
        }

        if(event.state == 0){
          event.occupant = "";
          event.comment = "";
          event.reserved = false;
        }

        arrayEvents.push(event);

      }

      this.todoService.createDoc({
        town: "La Nucia",
        sector: "Sector "+bufSector,
        street: "Calle de la Concordia nº 27",
        showorder: i,
        nameid: i,
        events: arrayEvents
      });

    }

  }



  //get search items
  getSearchItems(ev: any) {
      // Reset items back to all of the items
      this.initializeSearchItems();

      // set val to the value of the searchbar
      let val = ev.target.value;

      // if the value is an empty string don't filter the items
      if (val && val.trim() != '') {
        this.searchItems = this.searchItems.filter((item) => {
          return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
      }
    }


  //delete all entries in bulk
  deleteAll(){

    this.todoService.eraseAllDocs();

  }


  createTodo(){

    let prompt = this.alertCtrl.create({
      title: 'Add',
      message: 'What do you need to do?',
      inputs: [
        {
          name: 'title'
        }
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Save',
          handler: data => {
            this.todoService.createDoc({title: data.title});
          }
        }
      ]
    });

    prompt.present();

  }

  updateTodo(todo){

    let prompt = this.alertCtrl.create({
      title: 'Edit',
      message: 'Change your mind?',
      inputs: [
        {
          name: 'title'
        }
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Save',
          handler: data => {
            this.todoService.updateDoc({
              _id: todo._id,
              _rev: todo._rev,
              title: data.title
            });
          }
        }
      ]
    });

    prompt.present();
  }

  deleteTodo(todo){
    this.todoService.deleteDoc(todo);
  }

}
