import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Caracteristica } from 'src/app/models/caracteristica';
import { Opcion } from 'src/app/models/opcion';
import { CaracteristicaVehiculoService } from 'src/app/services/caracteristica-vehiculo.service';
import { CaracteristicasService } from 'src/app/services/caracteristicas.service';
import { OpcionService } from 'src/app/services/opcion.service';

@Component({
  selector: 'app-editar-caracteriticas-vehiculo',
  templateUrl: './editar-caracteriticas-vehiculo.component.html',
  styleUrls: ['./editar-caracteriticas-vehiculo.component.css']
})
export class EditarCaracteriticasVehiculoComponent implements OnInit {

  form: FormGroup;

  // Evento para pasar al padre el formulario de las opciones seleccionadas
  @Output() formCaracteriticasCompleto = new EventEmitter<FormGroup>();

  // Lista de opciones que se agregaron en el formulario
  listaOpciones: Opcion[] = [];
  // Lista de caracteristicas como resultado de la busqueda
  listaCaracteristicas: Caracteristica[] = [];

  // Map con los id de cada caracteristicas y sus respectivas opciones
  listaCaracteristicaOpciones = new Map();

  // Opciones de caracteriticas que tiene el veniculo actualmente
  caracteristicasVehiculo = new Map();
  // Opciones que seran mostradas en el select
  opcionesVehiculo = new Map();

  @Input() idVehiculo: number;

  constructor(
    private caracteristicaService: CaracteristicasService,
    private opcionService: OpcionService,
    private caracteristicaVehiculoService: CaracteristicaVehiculoService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      caracteristicas: this.formBuilder.array([])
    });
  }

  get caracteristicas() {
    return this.form.get('caracteristicas') as FormArray;
  }

  ngOnInit(): void {

    // Busca las caracteriticas del vehculo
    this.buscarCaracteristicas(this.idVehiculo);

  }

  //Buscar caracteristicas del vehiculo
  buscarCaracteristicas(idVehiculo: number) {
    this.caracteristicaVehiculoService.listar(idVehiculo).subscribe(
      data => {
        let i = 0;
        // recorre la lista y va agregando los valores al Map con la key id_caracteristica        
        for (let caracteristica of data) {
          this.caracteristicasVehiculo.set(caracteristica.opcion.caracteristica.id_caracteristicas, caracteristica.opcion);
          this.opcionesVehiculo.set(caracteristica.opcion.caracteristica.id_caracteristicas, caracteristica.opcion.opcion);
          
          //if (i === data.length - 1) this.listarCaracteristicas();
          i++;
        }
        
        this.listarCaracteristicas();
      },
      err => {
        console.log(err);
      }
    );
  }

  // Trae una lista de todas las caracteristicas y los carga en el arreglo caracteristicas[]
  listarCaracteristicas(): void {
    this.caracteristicaService.listar().subscribe(
      data => {
        this.listaCaracteristicas = data;
        // Recorre todas las opciones y crea un formulario por cada opcion
        for (let caracteristica of this.listaCaracteristicas) {

          // Crea un formgroup para las opciones de la caracteritica y se inicializa con los datos del vehiculo
          const caracteristicaFormGroup = this.formBuilder.group({
            id: [caracteristica.id_caracteristicas],
            nombre: [caracteristica.nombre, Validators.required],
            opcion: [this.caracteristicasVehiculo.get(caracteristica.id_caracteristicas), Validators.required] 
          });

          // Agrega el formulario al formulario de caracteristicas en la propiedad opciones
          this.caracteristicas.push(caracteristicaFormGroup);

          // Busca las opciones de cada caracteristica
          this.listarOpciones(caracteristica.id_caracteristicas, caracteristica);
        }

      },
      err => {
        console.log(err);
      }
    );
  }

  // Trae una lista de todas las opciones de una caracteristicas y los carga en el Map listaCaracteristicaOpciones
  listarOpciones(idCaracteristica: number, caracteristica: Caracteristica): void {

    // Busca las opciones de la caracteristica seleccionada
    this.opcionService.listar(idCaracteristica).subscribe(
      data => {
        // Guarda la lista del resultado de la funcion
        this.listaOpciones = data;

        // Agrega el formulario al formulario de caracteristicas en la propiedad opciones
        this.listaCaracteristicaOpciones.set(idCaracteristica, this.listaOpciones);

        //this.caracteristicasVehiculo.set(idCaracteristica, this.listaOpciones[0]);

        // Se crea un formulario para las opciones de las caracteritica
        //this.crearFormularioOpciones(caracteristica);

        this.enviarFromularioCaracteriticas();
      },
      err => {
        console.log(err);
      }
    );

  }
  

  // Emite un evento para enviar al padre el formulario
  enviarFromularioCaracteriticas() {
    console.log(this.form.value);
    console.log(this.caracteristicasVehiculo);
    console.log(this.caracteristicasVehiculo.get(1));
    this.formCaracteriticasCompleto.emit(this.form);
  }


  /**
   * Construye un formulario donde se guardara el nombre de la caracteritica y la Opcion seleccionada
   * @param caracteristica 
   */
  crearFormularioOpciones(caracteristica: Caracteristica) {
    // Crea un formgroup para las opciones de la caracteritica y se inicializa con los datos del vehiculo
    const caracteristicaFormGroup = this.formBuilder.group({
      id: [caracteristica.id_caracteristicas],
      nombre: [caracteristica.nombre, Validators.required],
      opcion: [this.caracteristicasVehiculo.get(caracteristica.id_caracteristicas), Validators.required] 
    });

    // Agrega el formulario al formulario de caracteristicas en la propiedad opciones
    this.caracteristicas.push(caracteristicaFormGroup);
  }

}
