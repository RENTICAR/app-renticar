import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Alquiler } from 'src/app/models/alquiler';
import { AlquilerService } from 'src/app/services/alquiler.service';

@Component({
  selector: 'app-lista-alquiler',
  templateUrl: './lista-alquiler.component.html',
  styleUrls: ['./lista-alquiler.component.css']
})
export class ListaAlquilerComponent implements OnInit {

  // Lista de alquileres
  alquileres: Alquiler[] = [];
  // Datos de la tabla
  dataSource = new MatTableDataSource(this.alquileres);

  // Orden de las columnas de la tabla
  displayedColumns: string[] = ['index', 'placa', 'marca', 'modelo', 'ano', 'color', 'cliente', 'fecha', 'recibir', 'tarifa'];

  constructor(
    private alquilerService: AlquilerService
  ) { }

  ngOnInit(): void {
    this.listarAlquileres();
  }

  listarAlquileres(): void{
    this.alquilerService.listar().subscribe(
      data => {
        this.alquileres = data;
        this.dataSource = new MatTableDataSource(this.alquileres);
      },
      err => {
        console.log(err);
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
