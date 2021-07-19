import { Component, Input, OnInit } from '@angular/core';
import { Vehiculo } from 'src/app/models/vehiculo';

@Component({
  selector: 'app-datos-vehiculo-alquiler',
  templateUrl: './datos-vehiculo-alquiler.component.html',
  styleUrls: ['./datos-vehiculo-alquiler.component.css']
})
export class DatosVehiculoAlquilerComponent implements OnInit {

  @Input() vehiculo: Vehiculo[];

  // Orden de las columnas de la tabla
  displayedColumns: string[] = ['placa', 'marca', 'modelo', 'ano', 'color'];

  constructor() { }

  ngOnInit(): void {
  }


}
