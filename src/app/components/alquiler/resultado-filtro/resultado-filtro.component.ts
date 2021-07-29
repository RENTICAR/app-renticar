import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CaracteristicaVehiculo } from 'src/app/models/caracteristica-vehiculo';
import { Vehiculo } from 'src/app/models/vehiculo';
import { AlquilerService } from 'src/app/services/alquiler.service';
import { CaracteristicaVehiculoService } from 'src/app/services/caracteristica-vehiculo.service';
import { VehiculoService } from 'src/app/services/vehiculo.service';
import { callbackify } from 'util';

@Component({
  selector: 'app-resultado-filtro',
  templateUrl: './resultado-filtro.component.html',
  styleUrls: ['./resultado-filtro.component.css']
})
export class ResultadoFiltroComponent implements OnInit {

  // Lista de Vehiculos
  @Input() vehiculos: Vehiculo[] = [];

  // Rango de las fechas que se alquilara el vehiculo
  @Input() fechasAlquiler: FormGroup;

  // Orden de las columnas de la tabla
  displayedColumns: string[] = ['index', 'placa', 'marca', 'modelo', 'ano', 'color', 'tarifa', 'alquilar'];

  // Map con los id (key) de cada vehiculo y su tarica por dia (value)
  listaTarifasVehiculos = new Map();

  // Lista de las caracteristicas de un vehiculo
  caracteristicasVehiculos: CaracteristicaVehiculo[] = [];

  constructor(
    private vehiculoService: VehiculoService,
    private caracteristicaVehiculoService: CaracteristicaVehiculoService,
    private alquilerService: AlquilerService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.fechasAlquiler = this.formBuilder.group({ status: ['', Validators.required] })
    this.listarVehiculos();
    
  }

  // Trae una lista de todas los vehiculos y los carga en el arreglo vehiculos[]
  listarVehiculos(): void{
    this.vehiculoService.listar().subscribe(
      data => {
        this.vehiculos = data;
        // Agrega la lista de todos los vehiculos a las listas de los servicios
        this.vehiculoService.listaFiltradaCaracteristica = this.vehiculos;
        this.vehiculoService.listaFiltradaFecha = this.vehiculos;
        console.log(this.vehiculoService.listaFiltradaCaracteristica);
        this.calcularTarifas();
      },
      err => {
        console.log(err);
      }
    );
  }

  /**
   * Trae una lista del las caracteristicas de un vehiculo
   * @param idVehiculo 
   * @returns CaracteristicaVehiculoService[]
   */
  listarCaracteristicas(idVehiculo:number) {
    return new Promise((resolve, reject) => {
      this.caracteristicaVehiculoService.listar(idVehiculo).subscribe(
        data => {
          this.caracteristicasVehiculos = data;
          resolve(data);
        },
        err => {
          console.log(err);
          reject(err);
        }
      );
      
    });
  }

  /**
   * Calcula la tarifa diaria de un vehiculo y la agrega a un Map para mostrarse en la tabla
   */
  async calcularTarifas(){
    for(let vehiculo of this.vehiculos){
      // Espera mientras se consultan los datos de las caracteristicas de un vehiculo
      const datos = await this.listarCaracteristicas(vehiculo.id_vehiculos);
      let tarifa: number = 0;
      // Calcula la tarifa de cada vehiculo
      for(let caracteristica of this.caracteristicasVehiculos){
        tarifa = tarifa + caracteristica.opcion.precio;
      }
      this.listaTarifasVehiculos.set(vehiculo.id_vehiculos,tarifa);
    }
  }

  enviarRangoFechas(){
    this.alquilerService.fechasAlquiler = this.fechasAlquiler;
  }

}
