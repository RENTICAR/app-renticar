import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Caracteristica } from 'src/app/models/caracteristica';
import { Opcion } from 'src/app/models/opcion';
import { Vehiculo } from 'src/app/models/vehiculo';
import { CaracteristicasService } from 'src/app/services/caracteristicas.service';
import { OpcionService } from 'src/app/services/opcion.service';
import { VehiculoService } from 'src/app/services/vehiculo.service';

@Component({
  selector: 'app-filtro-caracteristicas',
  templateUrl: './filtro-caracteristicas.component.html',
  styleUrls: ['./filtro-caracteristicas.component.css']
})
export class FiltroCaracteristicasComponent implements OnInit {

  form: FormGroup;

  // Lista de caracteristicas como resultado de la busqueda
  listaCaracteristicas: Caracteristica[] = [];
  // Lista de opciones que se agregaron en el formulario
  listaOpciones: Opcion[] = [];

  listasVehiculos = [];
  vehiculos: Vehiculo[] = [];

  // Evento para pasar al padre el formulario de las opciones seleccionadas
  @Output() listaVehiculosFiltrados = new EventEmitter<Vehiculo[]>();

  // Map con los id de cada caracteristicas y sus respectivas opciones
  listaCaracteristicaOpciones = new Map();

  constructor(
    private caracteristicaService: CaracteristicasService,
    private opcionService: OpcionService,
    private vehiculoService: VehiculoService,
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

        console.log(this.listaCaracteristicaOpciones);
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

  // Busca los vehiculos que tienen una misma caracteristica
  buscarVehiculos(idOpcion) {
    return new Promise((resolve, reject) => {
      this.vehiculoService.listarOpcion(idOpcion).subscribe(
        data => {
          this.listasVehiculos.push(data);
          resolve(data);
        },
        err => {
          console.log(err);
          reject(err);
        }
      );
    });

  }

  // Busca los vehiculos que tengan cada una de las caracteristicas y la lista es agregada a una lista nueva
  async llenarListasVehiculos() {
    this.listasVehiculos = [];
    // Recorre el formulario de las caracteristicas
    for (let caracteristica of this.form.controls.caracteristicas.value) {
      // Valida que solo se haga la busqueda de vehiculos con las opciones que estan seleccionadas en un valor valido
      if (caracteristica.opcion === undefined || caracteristica.opcion === "") {
        //console.log("NO ERROR");
      } else {
        // Espera hasta que la funcion retorne los datos
        const datos = await this.buscarVehiculos(caracteristica.opcion.id_opciones_caracteristicas);
      }
    }

    // Empieza el proceso de filtrado
    this.filtrarVehiculos();
  }

  // Recorre la lista de listas de vehiculos y valida cuales vehiculos estan en todas las listas (cuales vehiculos tienen todas las caracteristicas seleccionadas)
  filtrarVehiculos(): void{
    // Indice de la lista mas pequeña
    let indexMin: number = 0;
    // Longitud de la lista mas pequeña
    let lengthMin: number = this.listasVehiculos[0].length;

    // Encontrar la lista de longitud minima
    this.listasVehiculos.forEach(function (lista: Vehiculo[], index) {

      if (lista.length < lengthMin) {
        lengthMin = lista.length;
        indexMin = index;
      }
    });

    // Lista de los vehiculos filtrados
    let vehiculosFiltrados: Vehiculo[] = [];
    // Se crea una copia de la lista mas pequeña para empezar a filtrarla
    vehiculosFiltrados = this.listasVehiculos[indexMin];

    // Se recorre la lista pequeña
    for (let vehiculo of this.listasVehiculos[indexMin]) {

      // Recorrer todas las listas para encontrar cual de los elementos de la lista mas pequeña no esta en las otras listas
      this.listasVehiculos.forEach(function (lista: Vehiculo[], index) {
        // Valida si no es la lista mas pequeña
        if (index != indexMin) {
          // Valioda si el objeto esta dentro de la lista buscando su indice dentro de la lista
          // Si el indice retornado es -1 el objeto no esta dentro de la lista
          if (lista.map(x => x.id_vehiculos).indexOf(vehiculo.id_vehiculos) == -1) {
            // Se busca el indice del objeto que no fue encontrado, en la lista filtrada
            const indexVehiculo = vehiculosFiltrados.map(x => x.id_vehiculos).indexOf(vehiculo.id_vehiculos);
            // Se elimina el vehiculo de la lista de filtrados
            vehiculosFiltrados.splice(indexVehiculo, 1);            
          }

        }
      });
    }

    console.log(vehiculosFiltrados);
    // Se asignan los vehiculos filtrados a la lista principal de vehiculos
    this.vehiculos = vehiculosFiltrados;
    // Envia el evento con la lista filtrada 
    this.enviarFromularioCaracteriticas();
  }

  // Emite un evento para enviar al padre la lista de vehiculos
  enviarFromularioCaracteriticas() {
    console.log(this.form.value);
    this.listaVehiculosFiltrados.emit(this.vehiculos);
    
  }


}
