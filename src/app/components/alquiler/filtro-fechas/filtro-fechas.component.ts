import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-filtro-fechas',
  templateUrl: './filtro-fechas.component.html',
  styleUrls: ['./filtro-fechas.component.css']
})
export class FiltroFechasComponent implements OnInit {

  form: FormGroup;

  // Evento para pasar al padre el formulario de la fecha seleccionada
  @Output() formFechasCompleto = new EventEmitter<FormGroup>();
  

  constructor(
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      start: ['', Validators.required],
      end: ['', Validators.required]
    });
   }


  ngOnInit(): void {
    
  }

  enviarEventos(){
    this.formFechasCompleto.emit(this.form);
  }

}
