import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-vehiculo-propio',
  templateUrl: './vehiculo-propio.component.html',
  styleUrls: ['./vehiculo-propio.component.css']
})
export class VehiculoPropioComponent implements OnInit {

  form: FormGroup;

  // Tipos de gastos de un vehiculo propio
  tiposGastos: string[]=['SEGURO','MANTENIMIENTO','IMPUESTO']

  // Evento para pasar al padre el formulario de los gastos
  @Output() formGastosCompleto = new EventEmitter<FormGroup>();

  constructor(
    private formBuilder: FormBuilder
  ) { 
    this.form = this.formBuilder.group({
      gastos: this.formBuilder.array([])
    });
  }

  get gastos(){
    return this.form.get('gastos') as FormArray;
  }

  ngOnInit(): void {
    this.crearFormGasto();
  }

  /**
   * Crea una formulario para cada uno de los gastos listados
   */
  crearFormGasto(){
    // Recorre el arreglo con los tipos de gastos
    for(let tipo of this.tiposGastos){
      // Crea un formgroup para el tipo de gasto
      const gastoFormGroup = this.formBuilder.group({
        tipo: [tipo, Validators.required],
        costo: ['', Validators.required],
        fecha: ['', Validators.required]
      });

      // Agrega el forGroup al formulario principal en la propiedad gastos
      this.gastos.push(gastoFormGroup);
    }
    
  }

  /**
   * Emite un evento para enviar al padre el formulario
   */
  enviarFromulario(){
    console.log(this.form.value);
    this.formGastosCompleto.emit(this.form);
  }
}
