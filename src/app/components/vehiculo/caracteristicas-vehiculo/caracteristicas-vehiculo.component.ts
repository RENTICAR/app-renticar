import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Caracteristica } from 'src/app/models/caracteristica';
import { Opcion } from 'src/app/models/opcion';
import { CaracteristicasService } from 'src/app/services/caracteristicas.service';
import { OpcionService } from 'src/app/services/opcion.service';

@Component({
  selector: 'app-caracteristicas-vehiculo',
  templateUrl: './caracteristicas-vehiculo.component.html',
  styleUrls: ['./caracteristicas-vehiculo.component.css']
})
export class CaracteristicasVehiculoComponent implements OnInit {

  form: FormGroup;

  // Evento para pasar al padre el formulario de las opciones seleccionadas
  @Output() formCaracteriticasCompleto = new EventEmitter<FormGroup>();

  // Lista de opciones que se agregaron en el formulario
  listaOpciones: Opcion[] = [];
  // Lista de caracteristicas como resultado de la busqueda
  listaCaracteristicas: Caracteristica[] = [];

  // Map con los id de cada caracteristicas y sus respectivas opciones
  listaCaracteristicaOpciones = new Map();


  constructor(
    private caracteristicaService: CaracteristicasService,
    private opcionService: OpcionService,
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
    this.listarCaracteristicas();
  }


  // Trae una lista de todas las caracteristicas y los carga en el arreglo caracteristicas[]
  listarCaracteristicas(): void {
    this.caracteristicaService.listar().subscribe(
      data => {
        this.listaCaracteristicas = data;

        // Recorre todas las opciones y crea un formulario por cada opcion
        for (let caracteristica of this.listaCaracteristicas) {
          // Crea un formgroup para las opciones de la caracteritica
          const caracteristicaFormGroup = this.formBuilder.group({
            id: [caracteristica.id_caracteristicas],
            nombre: [caracteristica.nombre, Validators.required],
            opcion: ['', Validators.required] 
          });

          this.listarOpciones(caracteristica.id_caracteristicas);
          // Agrega el formulario al formulario de caracteristicas en la propiedad opciones
          this.caracteristicas.push(caracteristicaFormGroup);

        }
       
      },
      err => {
        console.log(err);
      }
    );
  }

  // Trae una lista de todas las opciones de una caracteristicas y los carga en el Map listaCaracteristicaOpciones
  listarOpciones(idCaracteristica: number): void {

    // Busca las opciones de la caracteristica seleccionada
    this.opcionService.listar(idCaracteristica).subscribe(
      data => {
        // Guarda la lista del resultado de la funcion
        this.listaOpciones = data;
        // Agrega el formulario al formulario de caracteristicas en la propiedad opciones
        this.listaCaracteristicaOpciones.set(idCaracteristica, this.listaOpciones);

      },
      err => {
        console.log(err);
      }
    );

  }

  // Emite un evento para enviar al padre el formulario
  enviarFromularioCaracteriticas() {
    console.log(this.form.value);
    this.formCaracteriticasCompleto.emit(this.form);
  }


}
