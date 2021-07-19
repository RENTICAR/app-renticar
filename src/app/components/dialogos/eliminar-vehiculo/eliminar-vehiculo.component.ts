import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Vehiculo } from 'src/app/models/vehiculo';

@Component({
  selector: 'app-eliminar-vehiculo',
  templateUrl: './eliminar-vehiculo.component.html',
  styleUrls: ['./eliminar-vehiculo.component.css']
})
export class EliminarVehiculoComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: Vehiculo) { }

  ngOnInit(): void {
  }

}
