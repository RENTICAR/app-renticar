import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Vehiculo } from 'src/app/models/vehiculo';
import { AlquilerService } from 'src/app/services/alquiler.service';
import { VehiculoService } from 'src/app/services/vehiculo.service';

@Component({
  selector: 'app-buscar-vehiculo',
  templateUrl: './buscar-vehiculo.component.html',
  styleUrls: ['./buscar-vehiculo.component.css']
})
export class BuscarVehiculoComponent implements OnInit {
  
  // Lista de Vehiculos
  vehiculos: Vehiculo[] = [];

  // Rango de fechas de alquiler
  formFechas: FormGroup;
  
  constructor(
  ) { }

  ngOnInit(): void {
  }

  

}
