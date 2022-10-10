import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private linkTheme = document.querySelector('#theme'); //dispuesto en el index.html

  constructor() { 
    this.uploadTheme();
  }

  uploadTheme(){
    const url = localStorage.getItem('theme') || './assets/css/colors/purple-dark.css';
    this.linkTheme.setAttribute('href', url);
  }

  changeTheme(theme: string){
    const url = `./assets/css/colors/${theme}.css`
    this.linkTheme.setAttribute('href', url);
    localStorage.setItem('theme', url); //lo grabamos en el localstorage para recuperarlo por si la app se actualiza
    this.checkCurrentTheme();
  }

  checkCurrentTheme(){
    
    //no se recomienda hacer si son muchos elementos. La otra opcion podria ser mandarle como ref los enlaces a trabajar
    //desde donde se llama
    const links =  document.querySelectorAll('.selector');

    links.forEach(element =>{
      element.classList.remove('working'); //nos aseguramos de borrar la clase que coloca el check del theme seleccionado

      //y lo asignamos dinamicamente
      const btnTheme = element.getAttribute('data-theme') //obtener el valor del atributo
      const btnThemeUrl = `./assets/css/colors/${btnTheme}.css`
      const currentTheme = this.linkTheme.getAttribute('href');

      if (btnThemeUrl === currentTheme){
        element.classList.add('working');
      }
    });
  }
}
