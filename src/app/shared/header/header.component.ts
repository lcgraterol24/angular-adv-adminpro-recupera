import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {

  public usuario: Usuario;
  public imgUrl = '';

  constructor(
    private usuarioService: UsuarioService
  ) { 
    //no hace falta poner imagenUrl() porque es un get
    this.imgUrl = usuarioService.usuario.imagenUrl;
    this.usuario = usuarioService.usuario;
  }
  
  ngOnInit(): void {
    
  }

  logout(){
    this.usuarioService.logout();
  }

  

}
