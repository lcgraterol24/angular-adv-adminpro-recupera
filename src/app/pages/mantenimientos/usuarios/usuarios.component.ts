import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { BusquedasService } from "../../../services/busquedas.service";

import { Usuario } from '../../../models/usuario.model';
import Swal from 'sweetalert2';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios: number = 0;
  public usuarios: Usuario[]=[];
  public usuariosTemp: Usuario[]=[];
  public desde: number = 0;
  public cargando: boolean = true;
  public imgSubs: Subscription;


  constructor(
    private usuarioService : UsuarioService,
    private busquedasService: BusquedasService,
    private modalImagenService: ModalImagenService
  ) { }

  //para evitar fugas de memoria que se destruya la subscricion una vez obetnida la img
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarUsuarios();

    //me suscribo al observable que tendrá la imagen
    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(
      delay(100)
    )
    .subscribe(img =>{
      //para cargar la imagen actual en la tabla
      console.log("img ", img);
      this.cargarUsuarios();
    })
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
        .subscribe( (resp: Usuario[]) => {
 
          this.usuarios = resp;
 
        });
  }

  /**
   * eliminarUsuario
   */
  public eliminarUsuario(users: Usuario) {

    if(users.uid === this.usuarioService.uid){
      return Swal.fire('Error', 'No puede borrarse a si mismo');
    }

    Swal.fire({
      title: 'Esta seguro que desea borrar el registro?',
      text:`Esta a punto de borrar a ${users.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borralo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario(users).subscribe((resp)=>{
         
            Swal.fire(
              'Borrado!',
              `El usuario eliminado fue ${users.nombre}`,
              'success'
            );
            this.cargarUsuarios();
          
        })
        
      }
    })

  }


  cambiarRole(users: Usuario){
    this.usuarioService.guardarUsuario(users).subscribe(resp =>{
      // console.log("rol cambiado");
    })
  }

  abrirModal(usuario: Usuario){
    this.modalImagenService.abrirModal('usuarios', usuario.uid, usuario.img);
  }

}
