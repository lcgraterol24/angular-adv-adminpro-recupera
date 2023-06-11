import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, delay, map, tap } from "rxjs/operators";

import { environment } from '../../environments/environment';

import { Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from "../models/usuario.model";
import { Hospital } from "../models/hospital.model";

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  /**
   * Obtengo el token cada vez que se ejecuta este services
   */
  get token():string{
    return localStorage.getItem('token') || '';
  }

  get headers(){
    return {headers: {'x-token': this.token}} 
  }

  cargarHospitales(){

    const url = `${base_url}/hospitales`
    return this.http.get(url, this.headers).pipe(
      map((resp: {ok: boolean, hospitales: Hospital[]})=> resp.hospitales)
    )
  }



  crearHospital(nombre: string){

    const url = `${base_url}/hospitales`
    return this.http.post(url, {nombre},this.headers);
  }


  actualizarHospital(_id: string, nombre: string){

    const url = `${base_url}/hospitales/${_id}`
    return this.http.put(url,{nombre},this.headers);
  }


  eliminarHospital(_id: string){

    const url = `${base_url}/hospitales/${_id}`
    return this.http.delete(url,this.headers);
  }
}
