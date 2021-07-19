import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ocupacion-dueno',
  templateUrl: './ocupacion-dueno.component.html',
  styleUrls: ['./ocupacion-dueno.component.css']
})
export class OcupacionDuenoComponent implements OnInit {

  disabledForm :boolean = true;

  form: FormGroup;

  // Evento para pasar al padre el formulario de las fechas seleccionadas
  @Output() formFechasCompleto = new EventEmitter<FormGroup>();



  estado = 'ACTIVO';
  usrCreacion = ''; // Se debe agregar el usuario que se loguea
  usrModificacion =''; // Se debe agregar el usuario que se loguea

  constructor(
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

  }

  
  // Crea un nuevo formulario de opciones, para agregar una nueva opcion desde el formulario
  agregarOpcion(){
    const opcionFormGroup = this.formBuilder.group({
      start: ['', Validators.required],
      end: ['', Validators.required]
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
    console.log(this.form.value);
    this.formFechasCompleto.emit(this.form);
  }


}
