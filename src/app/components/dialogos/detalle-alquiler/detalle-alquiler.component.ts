import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Alquiler } from 'src/app/models/alquiler';

@Component({
  selector: 'app-detalle-alquiler',
  templateUrl: './detalle-alquiler.component.html',
  styleUrls: ['./detalle-alquiler.component.css']
})
export class DetalleAlquilerComponent implements OnInit {

  // Orden de las columnas de la tabla
  displayedColumns: string[] = ['index', 'desde', 'hasta', 'cliente'];


  constructor(@Inject(MAT_DIALOG_DATA) public data: Alquiler[]) { }

  ngOnInit(): void {
  }

}
