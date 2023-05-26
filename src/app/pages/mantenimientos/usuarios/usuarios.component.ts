import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { BusquedasService } from "../../../services/busquedas.service";

import { Usuario } from '../../../models/usuario.model';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  public totalUsuarios: number = 0;
  public usuarios: Usuario[]=[];
  public usuariosTemp: Usuario[]=[];
  public desde: number = 0;
  public cargando: boolean = true;


  constructor(
    private usuarioService : UsuarioService,
    private busquedasService: BusquedasService
  ) { }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(){
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.desde)
    .subscribe(({total, usuarios}) => {
      this.totalUsuarios = total;
      this.usuarios = usuarios;
      this.usuariosTemp = usuarios;
      this.cargando = false;

    })
  }

  cambiarPagina(valor:number){
    this.desde += valor;

    if(this.desde<0){
      this.desde = 0;
    }else if(this.desde>this.totalUsuarios){
      this.desde -= valor;
    }
    this.cargarUsuarios();
  }

  buscar( termino: string ) {
 
    if ( termino.length === 0 ) {
      return this.usuarios = this.usuariosTemp;
    }
 
    this.busquedasService.buscar( 'usuarios', termino )
        .subscribe( resp => {
 
          this.usuarios = resp;
 
        });
  }

}
