
import { environment } from "src/environments/environment";
const base_url = environment.base_url;

export class Usuario {
    constructor(
        public nombre: string,
        public email: string,
        public google?: boolean,
        public img?: string,
        public role?: string,
        public uid?: string
    ) {}

    get imagenUrl(){
        if (this.img) {
            //vaidacion por si es la imagen guardada de google
            if (this.img.includes('https')){ return this.img; } 
            return `${base_url}/upload/usuarios/${this.img}`
        } else {
            return `${base_url}/upload/usuarios/no-image`
        }
    }
}