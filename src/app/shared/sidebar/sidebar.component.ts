import { Component, OnInit } from '@angular/core';
import { SidebarService } from "../../services/sidebar.service";
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {
  // menuItems: any[];
  public usuario: Usuario;
  public imgUrl = '';

  constructor(
    public sideBarServices: SidebarService,
    private usuarioService: UsuarioService
  ) { 

    //ya no voy a usar el this.menuItems porque el meníu ya viene el servicio de sideBarServices 
    // this.menuItems = sideBarServices.menu;
    //no hace falta poner imagenUrl() porque es un get
    // this.imgUrl = usuarioService.usuario.imagenUrl;
    this.usuario = usuarioService.usuario;
  }

  ngOnInit(): void {
  }

}
