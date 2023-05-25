import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { FileUploadService } from "../../services/file-upload.service";
import { Usuario } from '../../models/usuario.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  public profileForm : FormGroup;
  public usuario: Usuario;
  public imagenSubir: File;
  public imgTemp: any = ''


  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private fileUploadService: FileUploadService
  ) {
    //referencia al service de usuario
    this.usuario = usuarioService.usuario;
   }

  ngOnInit(): void {

    this.profileForm = this.fb.group({
      nombre: [this.usuario.nombre, Validators.required],
      email: [this.usuario.email, [Validators.required, Validators.email]],
    });


  }


  cambiarImagen(file: File){

    this.imagenSubir = file;

    //si no existe que no siga 
    if(!file){
      return this.imgTemp = null;
    }

    const reader =  new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = ()=>{
      this.imgTemp = reader.result;
    }
  }

  subirImagen(){
    this.fileUploadService.actualizarFoto(this.imagenSubir, 'usuarios', this.usuario.uid)
    .then(img => {
      this.usuario.img = img;
      Swal.fire("Guardado", "Imagen de Usuario actualizada correctamente", "success");
    }).catch(err=>{
      Swal.fire("Error", 'No se pudo cambiar la imagen', "error");
    })
  }

  actualizarPerfil(){
    this.usuarioService.actualizarPerfilUsuario(this.profileForm.value)
    .subscribe(()=>{

      const {nombre, email} = this.profileForm.value;

      // El cambio se visualiza en el header y sidebar en tiempo real ya que la clase de usuario esta referenciada en este .ts
      //y los cambios impactan de forma automática. 
      this.usuario.nombre =  nombre;
      this.usuario.email =  email;

      Swal.fire("Guardado", "Cambios guardados correctamente", "success");
    }, (err)=>{
      console.log(err);
      Swal.fire("Error", err.error.msg, "error");
    })
  }

}
