import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UsuarioService } from "../../services/usuario.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [ './register.component.css' ]
})
export class RegisterComponent {

  public formSubmitted =false;

  public registerForm= this.fb.group({
    nombre:['Lorena', Validators.required],
    email: ['test1000@gmail.com', [Validators.required, Validators.email]],
    password: ['1234', Validators.required],
    password2: ['1234', Validators.required],
    terminos: [true, Validators.required],
  },{
    validators: this.passwordsIguales('password', 'password2')
  });

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router
  ) { }

  /**
   * Metodo que crea en la base de datos al usuario
   * @returns si es inválido, hace un returns y no sigue la función
   */
  crearUsuario(){
    this.formSubmitted=true;
    //console.log(this.registerForm.value);

    if(this.registerForm.invalid){
      return;
    }

    //si es válido, realizar el posteo 
    this.usuarioService.crearUsuario(this.registerForm.value).subscribe(resp=>{
      // console.log("usuario creado con exito!!", resp);
      //navegamos al dashboard
      this.router.navigateByUrl('/');
    },(error)=>{
      //si sucede un error 
      Swal.fire({
        title: 'Error!',
        text: error.error.msg,
        icon: 'error',
        confirmButtonText: 'Cerrar'
      })
    });
  }

  /**
   * Metodo que valida los campos nombre y email
   * @param campo recibe el nombre y el email y comprueba si es valido al momento de presionar el boton de guardar
   * @returns {boolean} si no es valida, retorna true. Si es valido retorna false
   */
  campoNoValido(campo:string):boolean{
    if(this.registerForm.get(campo).invalid && this.formSubmitted){
      return true;
    }else{
      return false;
    }
  }

  aceptaTerminos(){
    return !this.registerForm.get('terminos').value && this.formSubmitted;
  }

  contrasenasNoValidas(){
    const pass1 =this.registerForm.get("password").value;
    const pass2 =this.registerForm.get("password2").value;

    if((pass1 !== pass2) && this.formSubmitted){
      return true;
    }else{
      return false;
    }
  }

  passwordsIguales(pass1Name: string, pass2Name: string){
    // retornamos una funcion
    return (formGroup: FormGroup)=>{
      const pass1Control = formGroup.get(pass1Name);
      const pass2Control = formGroup.get(pass2Name);

      if(pass1Control.value === pass2Control.value){
        pass2Control.setErrors(null);
      }else{
        pass2Control.setErrors({noEsIgual:true});
      }
    }
  }

  
}
