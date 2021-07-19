import { Component, Input, OnInit } from '@angular/core';
import { Vehiculo } from 'src/app/models/vehiculo';

@Component({
  selector: 'app-datos-vehiculo-gastos',
  templateUrl: './datos-vehiculo-gastos.component.html',
  styleUrls: ['./datos-vehiculo-gastos.component.css']
})
export class DatosVehiculoGastosComponent implements OnInit {

  @Input() vehiculo: Vehiculo[];

  // Orden de las columnas de la tabla
  displayedColumns: string[] = ['placa', 'marca', 'modelo', 'ano', 'color', 'propio'];

  constructor() { }

  ngOnInit(): void {
  }

}
