import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';

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
    private usuarioService: UsuarioService,
    private router: Router
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

  buscar(termino: string){

    if(termino.length === 0){
      return;
    }

    this.router.navigateByUrl(`dashboard/buscar/${termino}`)
    
  }

}
