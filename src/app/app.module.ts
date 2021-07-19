import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'
import { ReactiveFormsModule } from '@angular/forms';

// Externas
import { MatTableExporterModule } from 'mat-table-exporter'; // Exportar tablas

// Angular material
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


// Components
import { ListaCaracteristicaComponent } from './components/caracteristica/lista-caracteristica/lista-caracteristica.component';
import { NuevaCaracteristicaComponent } from './components/caracteristica/nueva-caracteristica/nueva-caracteristica.component';
import { EditarCaracteristicaComponent } from './components/caracteristica/editar-caracteristica/editar-caracteristica.component';
import { EliminarCaracteristicaComponent } from './components/dialogos/eliminar-caracteristica.component';
import { ListaVehiculoComponent } from './components/vehiculo/lista-vehiculo/lista-vehiculo.component';
import { NuevoVehiculoComponent } from './components/vehiculo/nuevo-vehiculo/nuevo-vehiculo.component';
import { EditarVehiculoComponent } from './components/vehiculo/editar-vehiculo/editar-vehiculo.component';
import { CaracteristicasVehiculoComponent } from './components/vehiculo/caracteristicas-vehiculo/caracteristicas-vehiculo.component';
import { OcupacionDuenoComponent } from './components/vehiculo/ocupacion-dueno/ocupacion-dueno.component';
import { BuscarVehiculoComponent } from './components/alquiler/buscar-vehiculo/buscar-vehiculo.component';
import { FiltroFechasComponent } from './components/alquiler/filtro-fechas/filtro-fechas.component';
import { FiltroCaracteristicasComponent } from './components/alquiler/filtro-caracteristicas/filtro-caracteristicas.component';
import { ResultadoFiltroComponent } from './components/alquiler/resultado-filtro/resultado-filtro.component';
import { NuevoAlquilerComponent } from './components/alquiler/nuevo-alquiler/nuevo-alquiler.component';
import { DatosClienteComponent } from './components/alquiler/datos-cliente/datos-cliente.component';
import { DatosVehiculoComponent } from './components/alquiler/datos-vehiculo/datos-vehiculo.component';
import { DatosCaracteristicasComponent } from './components/alquiler/datos-caracteristicas/datos-caracteristicas.component';
import { VerVehiculosComponent } from './components/gastos/ver-vehiculos/ver-vehiculos.component';
import { ListaAlquilerComponent } from './components/recibir/lista-alquiler/lista-alquiler.component';
import { NuevoRecibidoComponent } from './components/recibir/nuevo-recibido/nuevo-recibido.component';
import { DatosVehiculoAlquilerComponent } from './components/recibir/datos-vehiculo-alquiler/datos-vehiculo-alquiler.component';
import { DatosClienteAlquilerComponent } from './components/recibir/datos-cliente-alquiler/datos-cliente-alquiler.component';
import { NuevoGastoComponent } from './components/gastos/nuevo-gasto/nuevo-gasto.component';
import { VehiculoPropioComponent } from './components/gastos/vehiculo-propio/vehiculo-propio.component';
import { VehiculoDuenoComponent } from './components/gastos/vehiculo-dueno/vehiculo-dueno.component';
import { DatosVehiculoGastosComponent } from './components/gastos/datos-vehiculo-gastos/datos-vehiculo-gastos.component';
import { EliminarVehiculoComponent } from './components/dialogos/eliminar-vehiculo/eliminar-vehiculo.component';
import { AjustarPreciosComponent } from './components/dialogos/ajustar-precios/ajustar-precios.component';
import { AjustarPrecioComponent } from './components/caracteristica/ajustar-precio/ajustar-precio.component';
import { RespuestaAjustePreciosComponent } from './components/dialogos/respuesta-ajuste-precios/respuesta-ajuste-precios.component';
import { AlertaRespuestaServicioComponent } from './components/dialogos/alerta-respuesta-servicio/alerta-respuesta-servicio.component';
import { ReporteAnualComponent } from './components/gastos/reporte-anual/reporte-anual.component';
import { ReporteAlquilerComponent } from './components/informe/reporte-alquiler/reporte-alquiler.component';
import { DetalleAlquilerComponent } from './components/dialogos/detalle-alquiler/detalle-alquiler.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { EmptyComponent } from './components/empty/empty.component';
import { EditarCaracteriticasVehiculoComponent } from './components/vehiculo/editar-caracteriticas-vehiculo/editar-caracteriticas-vehiculo.component';
import { EditarOcupacionDuenoComponent } from './components/vehiculo/editar-ocupacion-dueno/editar-ocupacion-dueno.component';



@NgModule({
  declarations: [
    AppComponent,
    ListaCaracteristicaComponent,
    NuevaCaracteristicaComponent,
    EditarCaracteristicaComponent,
    EliminarCaracteristicaComponent,
    ListaVehiculoComponent,
    NuevoVehiculoComponent,
    EditarVehiculoComponent,
    CaracteristicasVehiculoComponent,
    OcupacionDuenoComponent,
    BuscarVehiculoComponent,
    FiltroFechasComponent,
    FiltroCaracteristicasComponent,
    ResultadoFiltroComponent,
    NuevoAlquilerComponent,
    DatosClienteComponent,
    DatosVehiculoComponent,
    DatosCaracteristicasComponent,
    VerVehiculosComponent,
    ListaAlquilerComponent,
    NuevoRecibidoComponent,
    DatosVehiculoAlquilerComponent,
    DatosClienteAlquilerComponent,
    NuevoGastoComponent,
    VehiculoPropioComponent,
    VehiculoDuenoComponent,
    DatosVehiculoGastosComponent,
    EliminarVehiculoComponent,
    AjustarPreciosComponent,
    AjustarPrecioComponent,
    RespuestaAjustePreciosComponent,
    AlertaRespuestaServicioComponent,
    ReporteAnualComponent,
    ReporteAlquilerComponent,
    DetalleAlquilerComponent,
    LoginComponent,
    HomeComponent,
    EmptyComponent,
    EditarCaracteriticasVehiculoComponent,
    EditarOcupacionDuenoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatSelectModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableExporterModule,
    MatTabsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatDialogModule,
    MatCardModule,
    MatGridListModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
