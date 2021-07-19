import { Component, Input, OnInit } from '@angular/core';
import { Cliente } from 'src/app/models/cliente';

@Component({
  selector: 'app-datos-cliente-alquiler',
  templateUrl: './datos-cliente-alquiler.component.html',
  styleUrls: ['./datos-cliente-alquiler.component.css']
})
export class DatosClienteAlquilerComponent implements OnInit {

  @Input() cliente: Cliente[];

  // Orden de las columnas de la tabla
  displayedColumns: string[] = ['tipo', 'documento', 'nombre', 'apellido', 'email', 'telefono', 'direccion'];

  constructor() { }

  ngOnInit(): void {
  }

}
