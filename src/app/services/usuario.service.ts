import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, delay, map, tap } from "rxjs/operators";

import { environment } from '../../environments/environment';

import { registerForm } from "../interfaces/register-form-interfaces";
import { LoginForm } from "../interfaces/login-form-interface";
import { CargarUsuario } from "../interfaces/cargar-usuarios.interface";

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


  /**
   * Obtengo el token cada vez que se ejecuta este services
   */
  get token():string{
    return localStorage.getItem('token') || '';
  }

  get role(): 'ADMIN_ROLE' | 'USER_ROLE'{
    return this.usuario.role;
  }

  /**
   * Obtengo el id del usuario cada vez que se llama a este servicio
   */
  get uid():string{
    return this.usuario.uid || '';
  }

  get headers(){
    return {headers: {'x-token': this.token}} 
  }


  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    this.router.navigateByUrl('/login');

    //Borrar Menu
    localStorage.removeItem('menu');

  
  }

  //validacion token - guard
  validarToken(): Observable<Boolean>{

    return this.http.get(`${base_url}/login/renew`,{
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map((resp:any)=>{
        this.guardarLocalStorage(resp.token, resp.menu)

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

  guardarLocalStorage(token: string, menu: any){
    localStorage.setItem('token', token);
    //en la peticion de login viene el menu (ver backend controller auth.js)
    localStorage.setItem('menu', JSON.stringify(menu) );
  }

  crearUsuario(formData: registerForm): Observable<any>{
    return this.http.post(`${base_url}/usuarios`, formData)
                          .pipe(
                            tap(
                              (resp: any) =>{
                                this.guardarLocalStorage(resp.token, resp.menu)
                              }
                            )
                          );
  }

  actualizarPerfilUsuario(data:{ email: string, nombre: string, role: string}){
    data = {
      ...data,
      role: this.usuario.role
    }
    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, this.headers)
  }

  login(formData: LoginForm){
    return this.http.post(`${base_url}/login`, formData)
                          .pipe(
                            tap(
                              (resp: any) =>{
                                this.guardarLocalStorage(resp.token, resp.menu)
                              }
                            )
                          );
  }


  loginGoogle(token: string){
    return this.http.post(`${base_url}/login/google`, {token})
                        .pipe(
                          tap(
                            (resp: any) =>{
                              this.guardarLocalStorage(resp.token, resp.menu)
                            }
                          )
                        );
  }

  cargarUsuarios(desde: number = 0){

    const url = `${base_url}/usuarios?desde=${desde}`
    return this.http.get<CargarUsuario>(url, this.headers).pipe(
      map(resp =>{
        //aca transformo a una instancia de Usuario (class) porque implementaré metodos sobre ella, Podría ser una interfax tamb
        const usuarios = resp.usuarios.map(user =>new Usuario(user.nombre, user.email, user.google, user.img , user.role, user.uid)
        );
        return {
          total: resp.total,
          usuarios
        };
        
 
      })
    )
  }

  eliminarUsuario(users: Usuario){

    const url = `${base_url}/usuarios/${users.uid}`
    return this.http.delete(url, this.headers);
  }

  guardarUsuario(usuario: Usuario){
    return this.http.put(`${base_url}/usuarios/${usuario.uid}`, usuario, this.headers)
  }
}
