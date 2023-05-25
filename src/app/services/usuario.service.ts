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

  //Instancia de la clase usuario 
  public usuario: Usuario;

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone
  ) { }


  get token():string{
    return localStorage.getItem('token') || '';
  }

  get uid():string{
    return this.usuario.uid || '';
  }


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

    return this.http.get(`${base_url}/login/renew`,{
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map((resp:any)=>{
        localStorage.setItem('token', resp.token);

        //como desestructurar la instancia del usuario * mejor practica*
        const {
        email,
        google,
        img='',
        nombre,
        role,
        uid,
        } = resp.usuario;

        this.usuario = new Usuario(nombre,
          email,
          google,
          img,
          role,
          uid);
      
          return true;

      }),
      
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

  actualizarPerfilUsuario(data:{ email: string, nombre: string, role: string}){

    data = {
      ...data,
      role: this.usuario.role
    }
    
    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, {headers: {'x-token': this.token}})
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
