import { Component, OnInit } from '@angular/core';
import { HospitalService } from "../../../../services/hospital.service";
import { Hospital } from 'src/app/models/hospital.model';
import Swal from "sweetalert2";
import { ModalImagenService } from '../../../../services/modal-imagen.service';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { BusquedasService } from 'src/app/services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit {

  public hospitales: Hospital[] = [];
  public cargando: boolean = true;
  public imgSubs: Subscription;

  constructor(
    private hospitalService: HospitalService,
    private modalImagenService: ModalImagenService,
    private busquedasService: BusquedasService,
  ) { }

  ngOnInit(): void {
    this.cargarHospitales();

    //me suscribo al observable que tendrá la imagen
    this.imgSubs = this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(
      delay(100)
    )
    .subscribe(img =>{
      //para cargar la imagen actual en la tabla
      console.log("img ", img);
      this.cargarHospitales();
    })
  }

  cargarHospitales(){
    this.cargando = true; 

    this.hospitalService.cargarHospitales().subscribe(
      (hospitales) =>{
        this.hospitales = hospitales;
        this.cargando = false; 

      }
    )
  }

  guardarCambios(hospital: Hospital){
    this.hospitalService.actualizarHospital(hospital._id, hospital.nombre).subscribe(
      (resp) => {
        Swal.fire('Actualizado', hospital.nombre, 'success');
      }
    )
  }

  eliminarHospital(hospital: Hospital){
    this.hospitalService.eliminarHospital(hospital._id).subscribe(
      (resp) => {
        this.cargarHospitales();
        Swal.fire('Eliminado', hospital.nombre, 'success');
      }
    )
  }

  async abrirModalCrear(){
    const {value = ''} = await Swal.fire<string>({
      title: "Crear Hospital",
      text: 'Ingrese el nombre del hospital',
      input: 'text',
      inputPlaceholder: 'Escriba el nombre del hospital',
      showCancelButton: true,
    })
    
    // console.log(value);
    if(value.trim().length > 0){
      //significa que escribió algo
      this.hospitalService.crearHospital(value).subscribe(
        (resp: any) =>{
          //insertamos al arreglo y asi podemos evitar otra peticion
          this.hospitales.push(resp.hospital);
        }
      )
    }
    
  }

  abrirImagen(hospital: Hospital){
    this.modalImagenService.abrirModal('hospitales', hospital._id, hospital.img);
  }


  buscar( termino: string ) {
 
    if ( termino.length === 0 ) {
      return this.cargarHospitales();
    }
 
    this.busquedasService.buscar( 'hospitales', termino )
        .subscribe( (resp: Hospital[]) => {
 
          this.hospitales = resp;
 
        });
  }
}
