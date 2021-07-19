import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Vehiculo } from 'src/app/models/vehiculo';
import { VehiculoService } from 'src/app/services/vehiculo.service';

@Component({
  selector: 'app-filtro-fechas',
  templateUrl: './filtro-fechas.component.html',
  styleUrls: ['./filtro-fechas.component.css']
})
export class FiltroFechasComponent implements OnInit {

  form: FormGroup;

  // Vehiculos disponibles en el rango de fechas
  vehiculos: Vehiculo[] = [];

  // Evento para pasar al padre el formulario de las opciones seleccionadas
  @Output() listaVehiculosFiltrados = new EventEmitter<Vehiculo[]>();

  // Evento para pasar al padre el formulario de la fecha seleccionada y saber si el formulario es valido
  @Output() formFechasCompleto = new EventEmitter<FormGroup>();


  constructor(
    private vehiculoService: VehiculoService,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      start: ['', Validators.required],
      end: ['', Validators.required]
    });
  }


  ngOnInit(): void {

  }


  // Busca los vehiclos que esten disponibles en eun rango de fechas
  buscarVehiculos(): void {
    if (this.form.valid) {
      // Coregir y contruir la fecha inicio
      let corregirMes = this.form.value.start.getMonth() + 1;
      let fechaInicio = this.form.value.start.getDate() + "-" + corregirMes + "-" + this.form.value.start.getFullYear();
      // Coregir y contruir la fecha fin
      corregirMes = this.form.value.end.getMonth() + 1;
      let fechaFin = this.form.value.end.getDate() + "-" + corregirMes + "-" + this.form.value.end.getFullYear();
      
      // Llama al servicio
      this.vehiculoService.listarFecha(fechaInicio, fechaFin).subscribe(
        data => {
          this.vehiculos = data;
          this.vehiculoService.listaFiltradaFecha = this.vehiculos;
          this.filtrarVehiculos();
        },
        err => {
          console.log(err);
        }
      );
    }
    this.enviarEventos();
  }

  // Recorre la lista de vehiculos filtrados por fecha y la lista de vehiculos filtrados por caracteristicas
  // Filtra los vehiculos que estan en ambas listas
  filtrarVehiculos(): void{
    let vehiculosFiltrados: Vehiculo[]=[];
    let i = 0;
    for(let vehiculoFecha of this.vehiculos){
      for(let vehiculoCaracteristica of this.vehiculoService.listaFiltradaCaracteristica){
        if(vehiculoFecha.id_vehiculos == vehiculoCaracteristica.id_vehiculos){
          vehiculosFiltrados.push(vehiculoFecha);
          break;
        }
      }
      i++;
    }
    if(i===this.vehiculos.length){
      // Asigna la lista filtrada a la lista general
      this.vehiculos = vehiculosFiltrados;
      // Agisna la lista filtrada a la lista del servicio
      this.vehiculoService.listaFiltradaFecha = vehiculosFiltrados;
      this.enviarEventos();
    }
  }

  enviarEventos() {
    this.listaVehiculosFiltrados.emit(this.vehiculos);
    this.formFechasCompleto.emit(this.form);
  }

}
