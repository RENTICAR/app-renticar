import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BuscarVehiculoComponent } from './components/alquiler/buscar-vehiculo/buscar-vehiculo.component';
import { NuevoAlquilerComponent } from './components/alquiler/nuevo-alquiler/nuevo-alquiler.component';
import { AjustarPrecioComponent } from './components/caracteristica/ajustar-precio/ajustar-precio.component';
import { EditarCaracteristicaComponent } from './components/caracteristica/editar-caracteristica/editar-caracteristica.component';
import { ListaCaracteristicaComponent } from './components/caracteristica/lista-caracteristica/lista-caracteristica.component';
import { NuevaCaracteristicaComponent } from './components/caracteristica/nueva-caracteristica/nueva-caracteristica.component';
import { EmptyComponent } from './components/empty/empty.component';
import { NuevoGastoComponent } from './components/gastos/nuevo-gasto/nuevo-gasto.component';
import { ReporteAnualComponent } from './components/gastos/reporte-anual/reporte-anual.component';
import { VerVehiculosComponent } from './components/gastos/ver-vehiculos/ver-vehiculos.component';
import { HomeComponent } from './components/home/home.component';
import { ReporteAlquilerComponent } from './components/informe/reporte-alquiler/reporte-alquiler.component';
import { LoginComponent } from './components/login/login.component';
import { ListaAlquilerComponent } from './components/recibir/lista-alquiler/lista-alquiler.component';
import { NuevoRecibidoComponent } from './components/recibir/nuevo-recibido/nuevo-recibido.component';
import { EditarVehiculoComponent } from './components/vehiculo/editar-vehiculo/editar-vehiculo.component';
import { ListaVehiculoComponent } from './components/vehiculo/lista-vehiculo/lista-vehiculo.component';
import { NuevoVehiculoComponent } from './components/vehiculo/nuevo-vehiculo/nuevo-vehiculo.component';

// Rutas para acceder a cada URL
const routes: Routes = [
  //Rutas para la gestion de caracteristicas
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'renticar', component: HomeComponent, children: [
    // Rutas menu Alquilar
    {path: 'alquileres', component: BuscarVehiculoComponent, outlet:'alquiler'},
    {path: 'alquileres/carga', component: EmptyComponent, outlet:'alquiler'},
    {path: 'alquileres/crear/:id', component: NuevoAlquilerComponent, outlet:'alquiler'},
    // Rutas menu Recibir
    {path: 'recibidos', component: ListaAlquilerComponent, outlet:'recibido'},
    {path: 'recibidos/carga', component: EmptyComponent, outlet:'recibido'},
    {path: 'recibidos/crear/:id', component: NuevoRecibidoComponent, outlet:'recibido'},
    // Rutas menu Vehiculos
    {path: 'vehiculos', component: ListaVehiculoComponent, outlet: 'vehiculo'},
    {path: 'vehiculos/crear', component: NuevoVehiculoComponent, outlet:'vehiculo'},
    {path: 'vehiculos/editar/:id', component: EditarVehiculoComponent, outlet:'vehiculo'},
    // Rutas menu Caracteristicas
    {path: 'caracteristicas', component: ListaCaracteristicaComponent, outlet:'caracteristica'},
    {path: 'caracteristicas/crear', component: NuevaCaracteristicaComponent, outlet:'caracteristica'},
    {path: 'caracteristicas/editar/:id', component: EditarCaracteristicaComponent, outlet:'caracteristica'},
    {path: 'caracteristicas/ajustar', component: AjustarPrecioComponent, outlet:'caracteristica'},
    // Rutas menu Gastos
    {path: 'gastos', component: VerVehiculosComponent, outlet: 'gasto'},
    {path: 'gastos/carga', component: EmptyComponent, outlet:'gasto'},
    {path: 'gastos/crear/:id', component: NuevoGastoComponent, outlet:'gasto'},
    {path: 'gastos/reporte', component: ReporteAnualComponent, outlet: 'gasto'},
    // Rutas menu Informe
    {path: 'informes', component: ReporteAlquilerComponent, outlet: 'informe'},
    // Ruta default
    {path: '**', redirectTo: '/renticar/(alquiler:alquileres)', pathMatch: 'full'}
  ]},

  // Ruta default
  //{path: '**', redirectTo: 'login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
