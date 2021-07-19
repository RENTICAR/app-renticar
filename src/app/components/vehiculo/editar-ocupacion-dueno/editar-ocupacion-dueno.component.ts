import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Ocupacion } from 'src/app/models/ocupacion';
import { OcupacionService } from 'src/app/services/ocupacion.service';

@Component({
  selector: 'app-editar-ocupacion-dueno',
  templateUrl: './editar-ocupacion-dueno.component.html',
  styleUrls: ['./editar-ocupacion-dueno.component.css']
})
export class EditarOcupacionDuenoComponent implements OnInit {

  disabledForm :boolean = true;
  disabledSlide: boolean = true;

  form: FormGroup;

  ocupaciones: Ocupacion[] = [];

  // Evento para pasar al padre el formulario de las fechas seleccionadas
  @Output() formFechasCompleto = new EventEmitter<FormGroup>();

  @Input() idVehiculo: number;
  @Input () propio: number;

  estado = 'ACTIVO';
  usrCreacion = ''; // Se debe agregar el usuario que se loguea
  usrModificacion =''; // Se debe agregar el usuario que se loguea

  constructor(
    private ocupacionService: OcupacionService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { 
    this.form = this.formBuilder.group({
      fechas: this.formBuilder.array([])
    });
  }

  get fechas(){
    return this.form.get('fechas') as FormArray;
  }

  ngOnInit(): void {
    this.form.controls.fechas.disable();

    this.buscarOcupacion(this.idVehiculo);

  }

  // Busca la lista de ocupaciones del dueño de un vehiculo
  buscarOcupacion(idVehiculo: number): void{
    this.ocupacionService.listar(idVehiculo).subscribe(
      data => {
        this.ocupaciones = data;
        // Recorre todas las opciones y crea un formulario por cada opcion
        for (let ocupacion of this.ocupaciones) {
           // Corrige la fecha que trae de la db
          let fechaCorregida = new Date(ocupacion.fec_ocupacion); 
          // Aumenta la fecha en 1
          fechaCorregida.setDate(fechaCorregida.getDate() + 1);
          // Crea un formgroup para las opciones de la caracteritica 
          const opcionFormGroup = this.formBuilder.group({
            id: [ocupacion.id_ocupaciones],
            dia: [fechaCorregida, Validators.required]
          });

          // Agrega el formulario al formulario de caracteristicas en la propiedad opciones
          this.fechas.push(opcionFormGroup);
        }
        // Habilita el slide de no propio y el formulario si es un vehiculo con dueño
        if(this.propio === 0){
          this.disabledSlide = false;
          this.form.controls.fechas.enable()
        }
        this.enviarFromularioFechas();
      },
      err => {
        console.log(err);
      }
    );

  }
  
  // Crea un nuevo formulario de opciones, para agregar una nueva opcion desde el formulario
  agregarOpcion(){
    const opcionFormGroup = this.formBuilder.group({
      id: [0],
      dia: ['', Validators.required]
    });
    this.fechas.push(opcionFormGroup);
    this.enviarFromularioFechas();
    
  }

  // Elimina un formulario de opciones por su indice
  removerOpcion(indice: number){
    this.fechas.removeAt(indice);
  }

  // Emite un evento para enviar al padre el formulario
  enviarFromularioFechas() {
    this.formFechasCompleto.emit(this.form);
  }

}
