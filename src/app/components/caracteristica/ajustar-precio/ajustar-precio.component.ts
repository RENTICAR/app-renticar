import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { OpcionService } from 'src/app/services/opcion.service';
import { AjustarPreciosComponent } from '../../dialogos/ajustar-precios/ajustar-precios.component';
import { AlertaRespuestaServicioComponent } from '../../dialogos/alerta-respuesta-servicio/alerta-respuesta-servicio.component';
import { RespuestaAjustePreciosComponent } from '../../dialogos/respuesta-ajuste-precios/respuesta-ajuste-precios.component';



@Component({
  selector: 'app-ajustar-precio',
  templateUrl: './ajustar-precio.component.html',
  styleUrls: ['./ajustar-precio.component.css']
})

export class AjustarPrecioComponent implements OnInit {

  form: FormGroup;

  estado = 'ACTIVO';
  usrCreacion = ''; // Se debe agregar el usuario que se loguea
  usrModificacion =''; // Se debe agregar el usuario que se loguea

  constructor(
    private opcionService: OpcionService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private router: Router
  ) { 
    this.form = this.formBuilder.group({
      porcentaje: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  // Muestra una alerta para confimar el proceso de eliminacion
  abrirAlerta() {
    const dialogRef = this.dialog.open(AjustarPreciosComponent, {
      width: '450px',
      data: this.form.value.porcentaje
    });

    dialogRef.afterClosed().subscribe(result => {
      
      console.log(`Dialog result: ${result}`);
      if(result){
        this.ajustarPrecios();
      }
    });
  }

  /**
   * Ejecuta el proceso masivo para aumentar el precio de las caracteristicas
   */
  ajustarPrecios(): void{
    let porcentaje: Object = {porcentaje: this.form.value.porcentaje};
    this.opcionService.aumentarPrecios(porcentaje).subscribe(
      data => {
        // Mensaje de confirmacion
        this.alertaRespuesta(data.mensaje, 'ok', 'Ajuste de precios');
        // Redirecciona a la lista de caracteristicas
        this.router.navigate(['renticar',{outlets: {'caracteristica': ['caracteristicas']}}]);
      },
      err => {
        console.log(err.error.mensaje);
        this.alertaRespuesta(err.error.mensaje, 'fail', 'ERROR');
      }
    );
  }

  /**
   * Muestra un pop-up en respuesta al resultado de la consulta, puede ser exitosa o fallida
   * @param mensaje 
   * @param respuesta 
   * @param titulo 
   */
  alertaRespuesta(mensaje: string, respuesta: string, titulo: string): void{
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
