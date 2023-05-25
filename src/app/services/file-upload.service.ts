import { ClassGetter } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor() { }

  async actualizarFoto(
    archivo: File, //viene propio de javascript
    tipo: 'usuarios'| 'medicos' |'hospitales',
    id: string
  ){

    try {

      const url = `${base_url}/upload/${tipo}/${id}`;

      //tamb es propio de javascript por eso no se importa 
      const formData= new FormData();
      formData.append('imagen', archivo);

      const resp = await fetch(url, {
        method: 'PUT',
        headers: {
          'x-token': localStorage.getItem('token') || ''
        },
        body: formData
      });

      const data =  await resp.json();

      if(data.ok){
        return data.nombreArchivo;
      }else{
        console.log(data.msg);
        return false;
      }
      
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
