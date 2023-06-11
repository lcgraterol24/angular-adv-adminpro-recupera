import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from "../models/usuario.model";
import { environment } from '../../environments/environment';
import { catchError, delay, map, tap } from "rxjs/operators";
import { Hospital } from '../models/hospital.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  //Instancia de la clase usuario 
  public usuario: Usuario;
  

  constructor( 
    private http: HttpClient
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

  buscar( 
    tipo: 'usuarios'|'medicos'|'hospitales',
    termino: string
  ) {

  const url = `${ base_url }/todo/coleccion/${ tipo }/${ termino }`;
  return this.http.get<any[]>( url, this.headers )
          .pipe(
            map( (resp: any ) => { 

              switch ( tipo ) {
                case 'usuarios':
                  return this.transformarUsuarios( resp.resultados )
                
                case 'hospitales':
                  return this.transformarHospitales( resp.resultados )

                // case 'medicos':
                //   return this.transformarUsuarios( resp.resultados )
              
                default:
                  return [];
              }

            })
          );

}

  private transformarUsuarios( resultados: any[] ): Usuario[] {

    return resultados.map(
      user => new Usuario(user.nombre, user.email, user.google, user.img , user.role, user.uid)  
    );
  }

  private transformarHospitales( resultados: any[] ): Hospital[] {

    return resultados.map(
      user => new Hospital(user.nombre, user._id, user.img , user.usuarios)  
    );
  }

  // private transformarMedicos( resultados: any[] ): Medico[] {

  //   return resultados.map(
  //     user => new Usuario(user.nombre, user.email, user.google, user.img , user.role, user.uid)  
  //   );
  // }
}
