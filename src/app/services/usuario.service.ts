import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from "rxjs/operators";

import { environment } from '../../environments/environment';

import { registerForm } from "../interfaces/register-form-interfaces";
import { LoginForm } from "../interfaces/login-form-interface";
import { Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from "../models/usuario.model";

declare const google: any;
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public usuario: Usuario;

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone
  ) { }


  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    this.router.navigateByUrl('/login');
    
    // google.accounts.id.revoke('lgraterol@experta.com.ar' || 'lcgraterol@gmail.com', ()=>{
      
    // })
    // const email=localStorage.getItem('email')|| '';
    // google.accounts.id.revoke('lcgraterol@gmail.com',()=> {
    //   // this.ngZone.run(()=>{
    //     this.router.navigateByUrl('/login');
    //   // })
    //   localStorage.removeItem('token');
    //   localStorage.removeItem('email');
    // })
  
  }

  //validacion token - guard
  validarToken(): Observable<Boolean>{
    const token = localStorage.getItem('token') || '';

    return this.http.get(`${base_url}/login/renew`,{
      headers: {
        'x-token': token
      }
    }).pipe(
      tap((resp:any)=>{
        localStorage.setItem('token', resp.token);

        //como desestructurar la instancia del usuario * mejor practica*
        const {
          email,
          google,
          nombre,
          role,
          img,
          uid
        } = resp.usuario;

        this.usuario = new Usuario(nombre, email, '', img, google, role, uid);
       

      }),
      map(resp=> true),
      catchError(error => {
        return of(false)
      })
    );
  }

  crearUsuario(formData: registerForm): Observable<any>{
    return this.http.post(`${base_url}/usuarios`, formData)
                          .pipe(
                            tap(
                              (resp: any) =>{
                                localStorage.setItem('token', resp.token)
                              }
                            )
                          );
  }

  login(formData: LoginForm){
    return this.http.post(`${base_url}/login`, formData)
                          .pipe(
                            tap(
                              (resp: any) =>{
                                localStorage.setItem('token', resp.token)
                              }
                            )
                          );
  }


  loginGoogle(token: string){
    return this.http.post(`${base_url}/login/google`, {token})
                        .pipe(
                          tap(
                            (resp: any) =>{
                              localStorage.setItem('token', resp.token)
                            }
                          )
                        );
  }

}
