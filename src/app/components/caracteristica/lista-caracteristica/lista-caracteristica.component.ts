import { Component, OnInit } from '@angular/core';
import { Caracteristica } from 'src/app/models/caracteristica';

import { Opcion  } from 'src/app/models/opcion';
import { CaracteristicasService } from 'src/app/services/caracteristicas.service';
import { OpcionService } from 'src/app/services/opcion.service';
import {FormControl, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import { EliminarCaracteristicaComponent } from '../../dialogos/eliminar-caracteristica.component';
import { AlertaRespuestaServicioComponent } from '../../dialogos/alerta-respuesta-servicio/alerta-respuesta-servicio.component';


@Component({
  selector: 'app-lista-caracteristica',
  templateUrl: './lista-caracteristica.component.html',
  styleUrls: ['./lista-caracteristica.component.css']
})
export class ListaCaracteristicaComponent implements OnInit {

  selectedValue: number;
  opcionControl = new FormControl('', Validators.required);

  usrModificacion ='ELIMINA'; // Se debe agregar el usuario que se loguea

  // Lista de Caracteristicas
  caracteristicas: Caracteristica[] = [];
  // Lista de opciones segun el id de la caracteristica
  opciones: Opcion[]=[];

  // Map con los id de cada caracteristicas y sus respectivas opciones
  listaCaracteristicaOpciones = new Map();
  // Map con los precios de las opciones seleccionadas
  selectOpciones = new Map();

  // Orden de las columnas de la tabla
  displayedColumns: string[] = ['index', 'nombre', 'opciones', 'precio', 'editar', 'eliminar'];
  

  constructor(
    private caracteristicaService: CaracteristicasService, 
    private opcionService: OpcionService,
    public dialog: MatDialog,
    public router: Router
    ) { }

  ngOnInit(): void {
    this.listarCaracteristicas();
  }

  // Trae una lista de todas las caracteristicas y los carga en el arreglo caracteristicas[]
  listarCaracteristicas(): void{
    this.caracteristicaService.listar().subscribe(
      data => {
        this.caracteristicas = data;
      },
      err => {
        console.log(err);
      }
    );
  }

  // Trae una lista de todas las opciones de una caracteristicas y los carga en el arreglo caracteristicas[]
  listarOpciones(idCaracteristica: number): void{
    this.opcionService.listar(idCaracteristica).subscribe(
      data => {
        this.opciones = data;

        // Agrega el formulario al formulario de caracteristicas en la propiedad opciones
        this.listaCaracteristicaOpciones.set(idCaracteristica, this.opciones);

      },
      err => {
        console.log(err);
      }
    );
  }

  // Muestra una alerta para confimar el proceso de eliminacion
  abrirAlerta(idCaracteristica: number, caracteristica: Caracteristica) {
    const dialogRef = this.dialog.open(EliminarCaracteristicaComponent, {
      data: caracteristica
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if(result){
        this.borrarCaracteristica(idCaracteristica, caracteristica);
      }
    });
  }

  // Elimina de forma logica el registro en la db
  borrarCaracteristica(idCaracteristica: number, caracteristica: Caracteristica): void{
    caracteristica.est_caracteristica = 'INACTIVO';
    caracteristica.usr_modificacion = this.usrModificacion;
    this.caracteristicaService.eliminar(idCaracteristica, caracteristica).subscribe(
      data => {
        // Mensaje de confirmacion
        this.alertaRespuesta(data.mensaje, 'ok', 'Eliminar característica');
        // Refresca la lista de caracteriticas
        this.listarCaracteristicas();
      },
      err => {
        console.log(err);
        this.alertaRespuesta(err.error.mensaje, 'fail', 'ERROR');
      }
    );
  }

  // Agrega un precio y lo asocia al id de una caracteritica para despues mostrarlo en la columna precio
  agregarPrecio(idCaracteristica: number ,precio: number){
    
    this.selectOpciones.set(idCaracteristica, precio);
  }

  /**
   * Muestra un pop-up en respuesta al resultado de la consulta, puede ser exitosa o fallida
   * @param mensaje 
   * @param respuesta 
   * @param titulo 
   */
   alertaRespuesta(mensaje: string, respuesta: string, titulo: string): void{
    const dialogRef = this.dialog.open(AlertaRespuestaServicioComponent, {
      // Pasa los parametros al dialogo para ser mostrados en el pop-up
      width: '450px',
      data: {
        mensaje: mensaje,
        respuesta: respuesta,
        titulo: titulo
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
