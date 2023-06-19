import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from "../guards/auth.guard";  

import { PagesComponent } from './pages.component';


/**Mover desde aqui a pages.routing */
import { AdminGuard } from "../guards/admin.guard"; 

import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from "../pages/promesas/promesas.component";
import { RxjsComponent } from "../pages/rxjs/rxjs.component";
import { PerfilComponent } from './perfil/perfil.component';
import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';
import { HospitalesComponent } from './mantenimientos/hospitales/hospitales/hospitales.component';
import { MedicosComponent } from './mantenimientos/medicos/medicos/medicos.component';
import { MedicoIdComponent } from './mantenimientos/medicoId/medico-id.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
/**Fin aqui a pages.routing */

const routes: Routes = [
    { 
        path: 'dashboard', 
        component: PagesComponent,
        canActivate: [AuthGuard],
        children:[
                { path: '', component: DashboardComponent, data:{ titulo:'Dashboard' } },
                { path: 'progress', component: ProgressComponent, data:{ titulo:'ProgressBar' } },
                { path: 'grafica1', component: Grafica1Component, data:{ titulo:'Gráficas' } },
                { path: 'account-settings', component: AccountSettingsComponent, data:{ titulo:'Ajustes de Cuenta' } },
                { path: 'buscar/:termino', component: BusquedaComponent, data:{ titulo:'Busquedas' } },
                { path: 'promesas', component: PromesasComponent, data:{ titulo:'Promesas' } },
                { path: 'rxjs', component:  RxjsComponent, data:{ titulo:'Rxjs' }},
                { path: 'perfil', component:  PerfilComponent, data:{ titulo:'Perfil de usuario' }},
                
                //Mantenimientos
                /**
                 *
                 */
                { path: 'usuarios', canActivate: [AdminGuard], component:  UsuariosComponent, data:{ titulo:'Mantenimiento de Usuarios' }},
                { path: 'hospitales', component:  HospitalesComponent, data:{ titulo:'Mantenimiento de Hospitales' }},
                { path: 'medicos', component:  MedicosComponent, data:{ titulo:'Mantenimiento de Medicos' }},
                { path: 'medico/:id', component:  MedicoIdComponent, data:{ titulo:'Mantenimiento de Medicos' }},
        ]
        //con el canLoad validamos que solo cargue el lazyload si tiene acceso al AuthGuard
        // canLoad:[AuthGuard],
        //Para trabajar con el lazyload debo quitar el array childen: [] y sustituirlo por la siguiente forma: loadChildren...
        //loadchildren va ser igual a una funcion de flecha en la cual voy a importar el modulo de manera perezona, en cuanto se 
        //CARGA el modulo child-routes.module, entonces (.then) RETORNA el bombre del modulo
        // loadChildren: () =>  import('./child-routes.module').then( m=>{m.ChildRoutesModule}) 
    },
];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ]
})
export class PagesRoutingModule {}


