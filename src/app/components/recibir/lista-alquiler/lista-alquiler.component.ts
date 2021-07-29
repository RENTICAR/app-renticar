import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Alquiler } from 'src/app/models/alquiler';
import { AlquilerService } from 'src/app/services/alquiler.service';

export interface AlquilerVehiculoCliente {
  id: number;
  placa: string;
  marca: string;
  modelo: string;
  ano: number;
  color: string;
  cliente: number;
  fec_inicio: Date;
  fec_fin: Date;
  tarifa: number;
}

@Component({
  selector: 'app-lista-alquiler',
  templateUrl: './lista-alquiler.component.html',
  styleUrls: ['./lista-alquiler.component.css']
})
export class ListaAlquilerComponent implements OnInit {

  // Lista de alquileres
  alquileres: Alquiler[] = [];

  // Lista para filtrar la tabla de alquileres
  alquileresCliente: AlquilerVehiculoCliente[]=[];
  // Datos de la tabla
  dataSource = new MatTableDataSource(this.alquileresCliente);

  // Orden de las columnas de la tabla
  displayedColumns: string[] = ['index', 'placa', 'marca', 'modelo', 'ano', 'color', 'cliente', 'fecha', 'recibir', 'tarifa'];

  constructor(
    private alquilerService: AlquilerService
  ) { }

  ngOnInit(): void {
    this.listarAlquileres();
  }

  // Trae una lista de los alquileres activos
  listarAlquileres(): void{
    this.alquilerService.listar().subscribe(
      data => {
        this.alquileres = data;
        //this.dataSource = new MatTableDataSource(this.alquileres);
        this.listaFiltroTabla();
      },
      err => {
        console.log(err);
      }
    );
  }

  /**
   * Crea una nueva lista de los alquileres con los datos del vehiculo y la cedula del cliente para que funcione el filtro
   */
  listaFiltroTabla(): void{
    for (let alquiler of this.alquileres){
      const alquilerCliente: AlquilerVehiculoCliente = {
        id: alquiler.id_alquileres,
        placa: alquiler.vehiculo.placa,
        marca: alquiler.vehiculo.marca,
        modelo: alquiler.vehiculo.modelo,
        ano: alquiler.vehiculo.ano,
        color: alquiler.vehiculo.color,
        cliente: alquiler.cliente.num_documento,
        fec_inicio: alquiler.fec_inicio,
        fec_fin: alquiler.fec_fin,
        tarifa: alquiler.tarifa
      }
      this.alquileresCliente.push(alquilerCliente);
      this.dataSource = new MatTableDataSource(this.alquileresCliente);
    }
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
