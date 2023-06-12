import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HospitalService } from '../../../services/hospital.service';
import { Hospital } from '../../../models/hospital.model';
import { MedicoService } from '../../../services/medico.service';
import { Medico } from "../../../models/medico.model";
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-medico-id',
  templateUrl: './medico-id.component.html',
  styles: [
  ]
})
export class MedicoIdComponent implements OnInit {

  public medicoForm: FormGroup;
  public hospitales: Hospital[] = [];
  public hospitalSeleccionado: Hospital;
  public medicoSeleccionado: Medico;

  constructor(
    private fb: FormBuilder,
    private hospitalService: HospitalService,
    private medicoService: MedicoService,
    private router: Router,
    private activateRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.obtenerMedicoById();

    this.cargarHospitales();
    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required]
    });

    //gracias a que estamos trabajando con Formularios Reactvos, yo me puedo crear un observable para saber cuando cambia
    //el valuechanges es un observable

    this.medicoForm.get('hospital').valueChanges.subscribe(
      (hospitalId) =>{
        // console.log(hospitalId);

        // Va devolver toda la info del hospital seleccionado
        this.hospitalSeleccionado = this.hospitales.find( h=> h._id === hospitalId)
        // console.log(this.hospitalSeleccionado);
      }
    )
  }

  guardarMedico(){

    const {nombre}= this.medicoForm.value;

    //si tenemos valor en medicoSeleccionado, debemos actualizar (no creralo de vuelta)
    if(this.medicoSeleccionado){
      //actualizar

      //desestructuro la data del form
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      }
      this.medicoService.actualizarMedico(data).subscribe(resp =>{
        // console.log("actualizado ", resp);  
        Swal.fire(
          'Actualizado', `${nombre} actualizado correctamente`, 'success'
        );
      })
    }else{
      
      this.medicoService.crearMedico(this.medicoForm.value).subscribe((resp: any)=>{
        // console.log(resp);
        Swal.fire(
          'Creado', `${nombre} creado correctamente`, 'success'
        );
        this.router.navigateByUrl(`/dashboard/medico/${resp.medico._id}`)
      })
    }
    
  }

  obtenerMedicoById(){
    //obtenermos parametros de la url
    this.activateRoute.params.subscribe(({id}) =>{

      if(id === 'nuevo'){
        return;
      }


      //tenemos el id del parametro
      this.medicoService.obtenerMedicoById(id)
        .pipe(
          delay(100)
        )
        .subscribe(medico =>{
    
        //el medico no existe
        if(!medico){
          return this.router.navigateByUrl(`/dashboard/medicos`);
        }

        //desestructuramos la response medico en constantes que usarmeos mas adelante
        const {nombre, hospital:{_id}} = medico;
        this.medicoSeleccionado = medico;

        //seteamos los valores en elñ formulario
        this.medicoForm.setValue({nombre, hospital: _id});
      })
    });
    
  }

  cargarHospitales(){
    this.hospitalService.cargarHospitales().subscribe((hospitales)=>{
      this.hospitales = hospitales;
    });
  }




}
