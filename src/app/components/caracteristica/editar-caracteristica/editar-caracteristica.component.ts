import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Caracteristica } from 'src/app/models/caracteristica';
import { Opcion } from 'src/app/models/opcion';
import { CaracteristicasService } from 'src/app/services/caracteristicas.service';
import { OpcionService } from 'src/app/services/opcion.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AlertaRespuestaServicioComponent } from '../../dialogos/alerta-respuesta-servicio/alerta-respuesta-servicio.component';

@Component({
  selector: 'app-editar-caracteristica',
  templateUrl: './editar-caracteristica.component.html',
  styleUrls: ['./editar-caracteristica.component.css']
})
export class EditarCaracteristicaComponent implements OnInit {

  form: FormGroup;

  estado = 'ACTIVO';
  usrCreacion = ''; // Usuario que se loguea
  usrModificacion = ''; // Usuario que se loguea

  // Caracteristica que se va a actualizar
  caracteristica: Caracteristica;
  // Lista actual de opciones de la caracteristica
  listaOpciones: Opcion[] = [];
  // Lista de opciones que se agregaron en el formulario
  nuevaListaOpciones: Opcion[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private caracteristicaService: CaracteristicasService,
    private opcionService: OpcionService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {
    this.form = this.formBuilder.group({
      nombre: ['', Validators.required],
      opciones: this.formBuilder.array([])
    });
  }

  get opciones() {
    return this.form.get('opciones') as FormArray;
  }

  get nombre() {
    return this.form.get('nombre');
  }


  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params.id;

    // Busca las opciones de la caracteristica seleccionada
    this.opcionService.listar(id).subscribe(
      data => {
        // Guarda la lista del resultado de la funcion
        this.listaOpciones = data;

        // Recorre todas las opciones y crea un formulario por cada opcion
        for (let opcion of this.listaOpciones) {
          // Crea un formgroup para las opciones de la caracteritica
          const opcionFormGroup = this.formBuilder.group({
            id: [opcion.id_opciones_caracteristicas],
            opcion: [opcion.opcion, Validators.required],
            precio: [opcion.precio, Validators.required]
          });

          // Agrega el formulario al formulario de caracteristicas en la propiedad opciones
          this.opciones.push(opcionFormGroup);
        }
      },
      err => {
        console.log(err);
      }
    );

    // Busca la caracteristica seleccionada
    this.caracteristicaService.buscar(id).subscribe(
      data => {
        // Guarda el objeto del resultado de la funcion
        this.caracteristica = data;
        // Agrega el nombre de la caracteristica al formulario       
        this.nombre.setValue(this.caracteristica.nombre, Validators.required);
      },
      err => {
        console.log(err.error.mensaje);
      }
    );

    // Usuario logueado
    this.usrCreacion = this.usuarioService.nombreUsuario;
    this.usrModificacion = this.usuarioService.nombreUsuario;

  }

  // Crea un nuevo formulario de opciones, para agregar una nueva opcion desde el formulario
  agregarOpcion() {
    const opcionFormGroup = this.formBuilder.group({
      id: [0],
      opcion: ['', Validators.required],
      precio: ['', Validators.required]
    });
    this.opciones.push(opcionFormGroup); // Agrega el formgroup al valos opciones del formulario padre
  }

  // Elimina un formulario de opciones por su indice
  removerOpcion(indice: number) {
    this.opciones.removeAt(indice);
  }

  // Actualiza el registro seleccionado con el nuevo nombre de la caracteristica
  actualizarCaracteristica(): void {
    const id = this.activatedRoute.snapshot.params.id;
    this.caracteristica.usr_modificacion = this.usrModificacion;
    this.caracteristica.nombre = this.form.value.nombre;
    this.caracteristicaService.actualizar(id, this.caracteristica).subscribe(
      data => {
        // Desencadena el proceso para actualizar las opciones
        this.quitarOpcionesLista();
        // Mensaje de confirmacion
        this.alertaRespuesta(data.mensaje, 'ok', 'Editar característica');
        // Redirecciona a la lista de caracteriticas
        this.router.navigate(['renticar', { outlets: { 'caracteristica': ['caracteristicas'] } }]);
      },
      err => {
        console.log(err);
        this.alertaRespuesta(err.error.mensaje, 'fail', 'ERROR');
      }
    );
  }

  // Compara las opciones de la lista de Opciones y las del formulario y extrae las que no esten en el formulario
  quitarOpcionesLista(): void {
    // Lista de opciones que se borraran
    let listaBorrar: Opcion[] = [];

    let i = 0;
    for (let opcionLista of this.listaOpciones) {
      let igual = false;
      for (let opcionForm of this.form.value.opciones) {
        // Valida si el id de la opcion esta en el formulario y en la lista
        if (opcionLista.id_opciones_caracteristicas == opcionForm.id) {
          // Bandera para saber que el elemento si esta en ambas listas
          igual = true;
          break;
        }
      }
      // Agrega el objeto a la lista de borrado si la bandera continua false 
      if (!igual) listaBorrar.push(opcionLista);
      //Valida si ya se llego al final de la lista 
      if (i === this.listaOpciones.length - 1) {
        // Se inicia el proceso de eliminado de las opciones que se agregaron a la lista
        this.eliminarOpciones(listaBorrar);
      }
      i++;
    }
  }

  // Elimina todas las opciones de la lista
  eliminarOpciones(lista: Opcion[]): void {

    // Recorre la lista de opciones que se quitaron del formulario
    for (let opcion of lista) {
      opcion.caracteristica = null;
      opcion.est_opcion_caracteristica = 'INACTIVO';
      opcion.usr_modificacion = this.usrModificacion;
      this.opcionService.eliminar(opcion.id_opciones_caracteristicas, opcion).subscribe(
        data => {

        },
        err => {
          console.log(err);
        }
      );
    }
    this.insertarOpciones();
  }

  // Inserta las opciones modificadas de los formulario a una nueva lista de opciones
  insertarOpciones(): void {
    // Recorre el formulario en el valor opciones, para optener la opcion, el precio y el id
    for (let opcion of this.form.value.opciones) {
      // Valida si la opcion es nueva
      if (opcion.id == 0) {
        // Si la opcion es nueva se crea
        this.crearOpcion(opcion);
      } else {
        // Agrega el objeto a la lista
        this.nuevaListaOpciones.push({
          id_opciones_caracteristicas: opcion.id,
          opcion: opcion.opcion,
          precio: opcion.precio,
          caracteristica: this.caracteristica, // Relaciona la caracteristica con la opcion
          est_opcion_caracteristica: this.estado,
          usr_modificacion: this.usrModificacion
        });
      }

    }
    // Actualiza las opciones que estan en la lista nueva
    this.actualizarOpciones();
  }

  // Actualiza las opciones que estan en la lista
  actualizarOpciones(): void {
    for (let opcion of this.nuevaListaOpciones) {
      this.opcionService.actualizar(opcion.id_opciones_caracteristicas, opcion).subscribe(
        data => {

        },
        err => {
          console.log(err);
        }
      );
    }

  }

  // Crea una opcion nueva para esa caracteristica
  crearOpcion(opcion: Opcion): void {
    // LLenar atributos para crear la opcion
    opcion.caracteristica = this.caracteristica;
    opcion.est_opcion_caracteristica = this.estado;
    opcion.usr_creacion = this.usrCreacion;
    opcion.usr_modificacion = this.usrModificacion;
    this.opcionService.crear(opcion).subscribe(
      data => {
        //this.router.navigate(['/caracteristicas/']);
      },
      err => {
        console.log(err);
      }
    );
  }

  /**
   * Muestra un pop-up en respuesta al resultado de la consulta, puede ser exitosa o fallida
   * @param mensaje 
   * @param respuesta 
   * @param titulo 
   */
  alertaRespuesta(mensaje: string, respuesta: string, titulo: string): void {
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
