import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Vehiculo } from 'src/app/models/vehiculo';
import { OcupacionService } from 'src/app/services/ocupacion.service';

@Component({
  selector: 'app-vehiculo-dueno',
  templateUrl: './vehiculo-dueno.component.html',
  styleUrls: ['./vehiculo-dueno.component.css']
})
export class VehiculoDuenoComponent implements OnInit {

  form: FormGroup;

  diasDisponibles: number = 0;
  tarifaTotal: number = 0;

  // Tipos de gastos de un vehiculo propio
  tiposGastos: string[] = ['PRESTAMO']

  // Evento para pasar al padre el formulario de los gastos
  @Output() formGastosCompleto = new EventEmitter<FormGroup>();

  // Vehiculo seleccionado
  @Input() vehiculo: Vehiculo;

  constructor(
    private ocupacionService: OcupacionService,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      gastos: this.formBuilder.array([])
    });
  }

  get gastos() {
    return this.form.get('gastos') as FormArray;
  }

  ngOnInit(): void {
    this.crearFormGasto();
  }

  /**
   * Crea una formulario para cada uno de los gastos listados
   */
  crearFormGasto() {
    // Recorre el arreglo con los tipos de gastos
    for (let tipo of this.tiposGastos) {
      // Crea un formgroup para el tipo de gasto
      const gastoFormGroup = this.formBuilder.group({
        tipo: [tipo, Validators.required],
        costo: [''],
        fecha: ['', Validators.required],
        tarifa: ['', Validators.required]
      });

      // Agrega el forGroup al formulario principal en la propiedad gastos
      this.gastos.push(gastoFormGroup);
    }

  }

  /**
   * Emite un evento para enviar al padre el formulario
   */
  enviarFromulario() {
    for (let gasto of this.form.value.gastos) {
      gasto.costo = gasto.tarifa * this.diasDisponibles;
      this.tarifaTotal = gasto.costo;
      this.formGastosCompleto.emit(this.form);
    }
    console.log(this.form.value);
  }

  /**
   * Calcula la cantidad de dias disponibles que se puede rentar el vehiculo en el año
   */
  calcularDiasDisponibles(): void {
    for (let gasto of this.form.value.gastos) {
      if (gasto.fecha != undefined) {
        const ano = gasto.fecha.getFullYear();
        console.log(ano);
        this.ocupacionService.contarDueno(this.vehiculo.id_vehiculos, ano).subscribe(
          data => {
            this.diasDisponibles = 365 - data;
            console.log(this.diasDisponibles);
            this.enviarFromulario();
          }
        );
      }

    }
  }

}
