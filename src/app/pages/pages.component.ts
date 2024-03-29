import { Component, OnInit } from '@angular/core';

import { SettingsService } from "../services/settings.service";
import { SidebarService } from '../services/sidebar.service';

//esta funcion arregla el theme despues que se logea para que se vea correcto (es una funcion global)
declare function customInitFunctions();

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [
  ]
})
export class PagesComponent implements OnInit {
  

  constructor(
    //inyectamos servicios
    private settingsService: SettingsService ,
    private sidebarService: SidebarService
    ) { }

  ngOnInit(): void {
    customInitFunctions();
    this.sidebarService.cargarMenu();
  }

  



}
