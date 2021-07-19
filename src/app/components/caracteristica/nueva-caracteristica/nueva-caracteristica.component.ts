import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Caracteristica } from 'src/app/models/caracteristica';
import { Opcion } from 'src/app/models/opcion';
import { CaracteristicasService } from 'src/app/services/caracteristicas.service';
import { OpcionService } from 'src/app/services/opcion.service';
import { AlertaRespuestaServicioComponent } from '../../dialogos/alerta-respuesta-servicio/alerta-respuesta-servicio.component';

@Component({
  selector: 'app-nueva-caracteristica',
  templateUrl: './nueva-caracteristica.component.html',
  styleUrls: ['./nueva-caracteristica.component.css']
})
export class NuevaCaracteristicaComponent implements OnInit {

  form: FormGroup;

  estado = 'ACTIVO';
  usrCreacion = ''; // Se debe agregar el usuario que se loguea
  usrModificacion =''; // Se debe agregar el usuario que se loguea

  // Caracteristica insertada
  caracteristica: Caracteristica;
  // Lista de opciones que se agregaron en el formulario
  listaOpciones: Opcion[]=[];

  constructor(
    private caracteristicaService: CaracteristicasService,
    private opcionService: OpcionService,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
    ) {

      this.form = this.formBuilder.group({
        nombre: ['', Validators.required],
        opciones: this.formBuilder.array([])
      });
      
    }

    get opciones(){
      return this.form.get('opciones') as FormArray;
    }

  ngOnInit(): void {
  }

  // Crea una caracteristica con los datos del formulario
  crearCaracteristica(): void{
    
    const caracteristica = new Caracteristica(this.form.value.nombre,this.estado,this.usrCreacion,this.usrModificacion);
    this.caracteristicaService.crear(caracteristica).subscribe(
      data => {
        // Trae el objeto que se inserto en la db para saber el id de la caracteristica
        this.buscarCaracteristicaNombre(this.form.value.nombre);
        // Mensaje de confirmacion
        this.alertaRespuesta(data.mensaje, 'ok', 'Crear característica');
        // Redirecciona a la lista de caracteriticas
        this.router.navigate(['renticar',{outlets: {'caracteristica': ['caracteristicas']}}]);
      },
      err => {
        console.log(err);
        this.alertaRespuesta(err.error.mensaje, 'fail', 'ERROR');
      }
    );
  }

  // Trae la caracteristica que se acabo de crear
  buscarCaracteristicaNombre(nombreCaracteristica: string): void{
    this.caracteristicaService.buscarNombre(nombreCaracteristica).subscribe(
      data => {
        this.caracteristica = data;
        // Inserta las opciones del formulario en una lista de Opciones
        this.insertarOpciones();
      },
      err => {
        console.log(err);
      }
    );
  }

  // Crea un nuevo formulario de opciones, para agregar una nueva opcion desde el formulario
  agregarOpcion(){
    const opcionFormGroup = this.formBuilder.group({
      opcion: ['', Validators.required],
      precio: ['', Validators.required]
    });
    this.opciones.push(opcionFormGroup);
  }

  // Elimina un formulario de opciones por su indice
  removerOpcion(indice: number){
    this.opciones.removeAt(indice);
  }

  // Inserta las opciones de los formulario a una nueva lista de tipo Opcion
  insertarOpciones(): void{
    // Recorre el formulario en el valor opciones, para optener la opcion y el precio
    for (let opcion of this.form.value.opciones) {
      // Agrega el objeto a la lista
      this.listaOpciones.push({
        opcion: opcion.opcion,
        precio: opcion.precio,
        caracteristica: this.caracteristica, // Relaciona la caracteristica creada con la opcion
        est_opcion_caracteristica: this.estado,
        usr_creacion: this.usrCreacion,
        usr_modificacion: this.usrModificacion
      });
    }
    // Crea las opciones despues de llenar la lista
    this.crearOpciones();
  }

  // Crea las opciones con todos los objetos de la lista de Opciones
  crearOpciones(): void{    
    // Recorre la lista y crea cada una de las opciones
    for (let opcion of this.listaOpciones) {  
      this.opcionService.crear(opcion).subscribe(
        data => {
          //this.router.navigate(['/caracteristicas/']);
        },
        err => {
          console.log(err);
        }
      );  

    }    
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
