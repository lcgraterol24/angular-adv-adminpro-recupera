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

  constructor(
    private usuarioService: UsuarioService
  ) { 
    //no hace falta poner imagenUrl() porque es un get
    this.usuario = this.usuarioService.usuario;
  }
  
  ngOnInit(): void {
    
  }

  logout(){
    this.usuarioService.logout();
  }

  

}
