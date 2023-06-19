import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';


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


const childRoutes: Routes = [
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

@NgModule({
  imports: [ RouterModule.forChild(childRoutes) ],
  exports: [ RouterModule ]
})
export class ChildRoutesModule { }
