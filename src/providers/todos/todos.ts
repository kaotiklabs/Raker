import { Injectable, NgZone} from '@angular/core';
import 'rxjs/add/operator/map';

import PouchDB from 'pouchdb';
import pouchdbUpsert from 'pouchdb-upsert';
import Erase from 'pouchdb-erase';

/*
  Generated class for the TodosProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/


@Injectable()
export class TodosProvider {

  data: any;
  localdb: any;
  remotedb: any;

  constructor(private zone: NgZone) {

    console.log('Constructor TodosProvider');

    //add plugin pouchdb upsert for avoiding 409 errors
    PouchDB.plugin(pouchdbUpsert);
    PouchDB.plugin(Erase);

    console.log('Creating local db');
    // if websql available, use it (faster than indexedDB)
    this.localdb = new PouchDB('raker', {adapter: 'websql'});
    if (!this.localdb.adapter) { // websql not supported by this browser
      this.localdb = new PouchDB('raker');
    }


    console.log('Creating remote db');
    this.remotedb = 'https://couchdb-05477d.smileupps.com/raker';

    //no pot crearla sino es admin
    // https://admin:63bd0aad6b63@couchdb-05477d.smileupps.com/sources

    let options = {
      live: true,
      retry: true,
      continuous: true
    };

    //2 way replication, continuous
    console.log('Starting 2way live local/remote db sync');
    this.localdb.sync(this.remotedb, options);
  }



  getDocs() {

    if (this.data) {
      return Promise.resolve(this.data);
    }

    return new Promise(resolve => {

      this.localdb.allDocs({

        include_docs: true

      }).then((result) => {

        this.data = [];

        let docs = null;
        docs = result.rows.map((row) => {
          this.data.push(row.doc);
        });

        resolve(this.data);

        this.localdb.changes({live: true, since: 'now', include_docs: true}).on('change', (change) => {
          this.handleChange(change);
        });

      }).catch((error) => {

        console.log(error);

      });

    });

  }

  //bulk erase all docs
  eraseAllDocs(){
    console.log("Erasing all docs...");
    this.localdb.erase();
  }

  createDoc(doc){
    this.localdb.post(doc);
  }


  updateDoc(doc){

    this.localdb.put(doc).catch((err) => {
        console.log(err);
      });


    // this.localdb.upsert(doc._id, function (doc) {
    //   if (!doc.count) {
    //     doc.count = 0;
    //   }
    //   doc.count++;
    //   return doc;
    // }).then(function (res) {
    //   // success, res is {rev: '1-xxx', updated: true, id: 'myDocId'}
    //   console.log('Updated doc id: '+doc._id);
    // }).catch(function (err) {
    //   // error
    //   console.log(err);
    // });

  }

  deleteDoc(doc){
    this.localdb.remove(doc).catch((err) => {
      console.log(err);
    });
  }

  handleChange(change){

    let changedDoc = null;
    let changedIndex = null;

    this.data.forEach((doc, index) => {

      if(doc._id === change.id){
        changedDoc = doc;
        changedIndex = index;
      }

    });


    //force visual update with zone
    this.zone.run(() =>
    {
      //A document was deleted
      if(change.deleted){
        console.log('db doc delete');
        this.data.splice(changedIndex, 1);
      }
      else {

        //A document was updated
        if(changedDoc){
          console.log('db doc update');
          this.data[changedIndex] = change.doc;
        }

        //A document was added
        else {
          console.log('db doc add');
          this.data.push(change.doc);
        }

      }

    });

  }
}
