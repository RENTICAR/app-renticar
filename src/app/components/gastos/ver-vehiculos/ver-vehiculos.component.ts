import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Gasto } from 'src/app/models/gasto';
import { Reporte } from 'src/app/models/reporte';
import { Vehiculo } from 'src/app/models/vehiculo';
import { GastoService } from 'src/app/services/gasto.service';
import { VehiculoService } from 'src/app/services/vehiculo.service';

@Component({
  selector: 'app-ver-vehiculos',
  templateUrl: './ver-vehiculos.component.html',
  styleUrls: ['./ver-vehiculos.component.css']
})
export class VerVehiculosComponent implements OnInit {

  // Lista de Vehiculos
  vehiculos: Vehiculo[] = [];

  // Map gastos por vehiculo
  gastosVehiculos: Reporte[] = [];

  // Datos de la tabla
  dataSource = new MatTableDataSource(this.gastosVehiculos);

  // Orden de las columnas de la tabla
  displayedColumns: string[] = ['index', 'placa', 'marca', 'modelo', 'ano', 'color', 'propio', 'gastos', 'agregar'];

  

  constructor(
    private vehiculoService: VehiculoService,
    private gastoService: GastoService
  ) { }

  ngOnInit(): void {
    this.listarVehiculosGastos();
    this.listarVehiculos();
  }

  // Trae una lista de todas los vehiculos y los carga en el arreglo vehiculos[]
  listarVehiculos(): void{
    this.vehiculoService.listar().subscribe(
      data => {
        this.vehiculos = data;
        //this.dataSource = new MatTableDataSource(this.vehiculos);
      },
      err => {
        console.log(err);
      }
    );
  }

  listarVehiculosGastos(): void{
    this.gastoService.suma().subscribe(
      data => {
        this.gastosVehiculos = data;
        this.dataSource = new MatTableDataSource(this.gastosVehiculos);
      }
    );
  }

  /**
   * Aplica un filtro sobre los datos que se muestran en la tabla
   * @param event 
   */
   applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
