import { Component, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [
  ]
})
export class PromesasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    // const promesa = new Promise((resolve, reject)=>{
    //   if(false){
    //     resolve("hola mundo");
    //   }else{
    //     reject("algo salió mal");
    //   }
    // });

    // //las promesas son utiles para ejecutar DESPUES de que se haya realizado algo previo
    // promesa.then((mensaje)=>{
    //   //lo que quiero ejecutar una vez que la promesa se resuelva
    //   //este es el procedimiento asincrono
    //   console.log(mensaje);
    // })
    // .catch(error =>{
    //   console.log("error en mi promesa: ", error);
    // });


    // console.log("fin  del Init")
    
    
    //this.getUsuarios();
    this.getUsuarios().then(usuarios =>{
      console.log(usuarios);
    });

  }

  getUsuarios(){
    //las promesas son utiles para ejecutar DESPUES de que se haya realizado algo previo
    return new Promise(resolve =>{
      fetch('https://reqres.in/api/users')
        .then(resp => resp.json())
        .then(body => resolve( body.data)) ;
    });
  }

}
