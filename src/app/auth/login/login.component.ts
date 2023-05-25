import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

declare const google: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements OnInit, AfterViewInit {

  //ferencia local del boton de google
  @ViewChild('googleBtn') googleBtn: ElementRef;

  public formSubmitted =false;

  public loginForm= this.fb.group({
    //si marcó el remember, tomó el mail/user del localstorage y lo seteo en la ventana
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    remember: [false]
  });

  constructor( 
    private fb: FormBuilder,
    private router: Router,
    private usuarioService: UsuarioService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
      this.googleInit();
  }

  googleInit(){
    google.accounts.id.initialize({
      client_id: "348767175435-va4n23u70a5gpejegj4pci2jl35ie7n7.apps.googleusercontent.com",
      callback: (response) => this.handleCredentialResponse(response)
    });
    google.accounts.id.renderButton(
      // document.getElementById("buttonDiv"),
      this.googleBtn.nativeElement,
      { theme: "outline", size: "large" }  // customization attributes
    );
  }

  handleCredentialResponse(response: any){
    // console.log({'componente actual': this})
    console.log("Encoded JWT ID token: " + response.credential);

    this.usuarioService.loginGoogle(response.credential).subscribe(resp =>{
      // console.log({login: resp})
      //el mail existe y tenemos el token de google
      // Navegar al Dashboard
      this.ngZone.run( () => {
        this.router.navigateByUrl('/');
      })
    })
  }

  login(){

    this.usuarioService.login(this.loginForm.value).subscribe(resp =>{
      if(this.loginForm.get('remember').value){
        //quiere grabarlo en el localstorage
        localStorage.setItem('email', this.loginForm.get('email').value);
      }else{
        // localStorage.removeItem('email');
      }

      // Navegar al Dashboard
      this.ngZone.run( () => {
        this.router.navigateByUrl('/');
      })

    }, (error)=>{
      console.log(error);
      //si sucede un error 
      Swal.fire("Error", error.error.msg, 'error');
    })

  }

}
