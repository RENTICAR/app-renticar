import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TipoDocumento } from 'src/app/models/tipo-documento';
import { TipoDocumentoService } from 'src/app/services/tipo-documento.service';

@Component({
  selector: 'app-datos-cliente',
  templateUrl: './datos-cliente.component.html',
  styleUrls: ['./datos-cliente.component.css']
})
export class DatosClienteComponent implements OnInit {

  form: FormGroup;

  tiposDocumentos: TipoDocumento[] =[];

  // Evento para pasar al padre el formulario de las opciones seleccionadas
  @Output() formClienteCompleto = new EventEmitter<FormGroup>();

  constructor(
    private formBuilder: FormBuilder,
    private tipoDocumentoService: TipoDocumentoService
  ) {
    this.form = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      email: ['', Validators.required],
      documento: ['', Validators.required],
      tipo: ['', Validators.required],
    });
   }

  ngOnInit(): void {
    this.listarTiposDocumentos();
  }

  // Emite un evento para enviar al padre el formulario
  enviarFromulario(){
    console.log(this.form.value);
    this.formClienteCompleto.emit(this.form);
  }

  listarTiposDocumentos(): void{
    this.tipoDocumentoService.listar().subscribe(
      data => {
        this.tiposDocumentos = data;

      },
      err => {
        console.log(err);
      }
    );
  }

}
