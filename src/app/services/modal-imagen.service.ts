import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, delay, map, tap } from "rxjs/operators";

import { environment } from '../../environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ModalImagenService {

  //si lo hacemos publico, significa que cualquier componente va poder acceder a esta propiedad 
  //Lo haremos privada porque: cuando cierro el modal quiero hacer cierto tipo de limpieza (va ser solo una var para operaciones tecnicas)
  //el _ (guion bajo) es el estandar para indicar que es una propiedad privada
  private _ocultarModal: boolean = true;
  public tipo: 'usuarios'|'medicos'|'hospitales';
  public id: string;
  public img: string = 'no-image';

  //observable que emita algo cuando actualice la foto por ejemplo. Esto para que actualice el registro de atras de la tabla tras guardar
  public nuevaImagen :  EventEmitter<string> =  new EventEmitter();

  get ocultarModal(){
    return this._ocultarModal;
  }

  abrirModal(
    tipo: 'usuarios'|'medicos'|'hospitales',
    id: string,
    img: string
  ){
    this._ocultarModal = false;
    this.tipo= tipo;
    this.id= id;
    // this.img= img;

    if(img){
      if(img.includes('http')){
        this.img= img;
      }else {
        this.img  = `${base_url}/upload/${tipo}/${img}`;
      }
    }else{
      this.img  = `${base_url}/upload/${tipo}/${img}`;
    }
    

    console.log("this.img ", this.img);
  }

  cerrarModal(){
    this._ocultarModal = true;
  }

  constructor() { }
}
