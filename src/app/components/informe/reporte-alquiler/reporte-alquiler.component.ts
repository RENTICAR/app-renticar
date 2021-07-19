import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Reporte } from 'src/app/models/reporte';
import { AlquilerService } from 'src/app/services/alquiler.service';
import { AlertaRespuestaServicioComponent } from '../../dialogos/alerta-respuesta-servicio/alerta-respuesta-servicio.component';

@Component({
  selector: 'app-reporte-alquiler',
  templateUrl: './reporte-alquiler.component.html',
  styleUrls: ['./reporte-alquiler.component.css']
})
export class ReporteAlquilerComponent implements OnInit {

  reporte: Reporte[] = [];

  // Orden de las columnas de la tabla
  displayedColumns: string[] = ['index', 'placa', 'marca', 'modelo', 'ano', 'color', 'propio', 'ingresos', 'rentabilidad', 'alquilado', 'dias','satisfaccion', 'novedades'];

  form: FormGroup;

  constructor(
    private alquilerService: AlquilerService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) { 
    this.form = this.formBuilder.group({
      ano: ['', Validators.required],
      mes: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  /**
   * Busca el reporte de alquiler del mes-año
   */
  generarReporte(): void{
    this.alquilerService.reporte(this.form.value.ano, this.form.value.mes).subscribe(
      data => {
        this.reporte = data;
      },
      err => {
        console.log(err);
        this.alertaRespuesta(err.error.mensaje, 'fail', 'ERROR');
        this.form.reset();
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
