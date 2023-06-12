import { Component, OnDestroy, OnInit } from '@angular/core';
import { MedicoService } from "../../../../services/medico.service";
import { Medico } from 'src/app/models/medico.model';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  public cargando: boolean = true;
  public medicos: Medico[] = [];
  public imgSubs: Subscription;

  constructor(
    private medicoService: MedicoService,
    private modalImagenService: ModalImagenService,
    private busquedasService: BusquedasService,
  ) { }

  //para evitar fugas de memoria que se destruya la subscricion una vez obetnida la img
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();

    //me suscribo al observable que tendrá la imagen
    this.imgSubs = this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(
      delay(100)
    )
    .subscribe(img =>{
      //para cargar la imagen actual en la tabla
      // console.log("img ", img);
      this.cargarMedicos();
    })
  }

  cargarMedicos(){
    this.medicoService.cargarMedicos().subscribe((resp)=>{
      this.cargando = false;
      this.medicos = resp;
      // console.log("medicos ", this.medicos);
    });
  }

  abrirImagen(medico: Medico){
    this.modalImagenService.abrirModal('medicos', medico._id, medico.img);
  }


  buscar( termino: string ) {
 
    if ( termino.length === 0 ) {
      return this.cargarMedicos();
    }
 
    this.busquedasService.buscar( 'medicos', termino )
        .subscribe( (resp: Medico[]) => {
 
          this.medicos = resp;
 
        });
  }

  borrarMedico(medico: Medico){
    Swal.fire({
      title: 'Esta seguro que desea borrar el Médico?',
      text:`Esta a punto de borrar a ${medico.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borralo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicoService.eliminarMedico(medico._id).subscribe((resp)=>{
         
            Swal.fire(
              'Borrado!',
              `El médico eliminado fue ${medico.nombre}`,
              'success'
            );
            this.cargarMedicos();
          
        })
        
      }
    })
  }

}
