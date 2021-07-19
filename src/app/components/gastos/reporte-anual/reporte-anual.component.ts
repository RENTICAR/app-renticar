import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Reporte } from 'src/app/models/reporte';
import { GastoService } from 'src/app/services/gasto.service';
import { AlertaRespuestaServicioComponent } from '../../dialogos/alerta-respuesta-servicio/alerta-respuesta-servicio.component';


@Component({
  selector: 'app-reporte-anual',
  templateUrl: './reporte-anual.component.html',
  styleUrls: ['./reporte-anual.component.css']
})
export class ReporteAnualComponent implements OnInit {

  reporte: Reporte[] = [];

  // Orden de las columnas de la tabla
  displayedColumns: string[] = ['index', 'placa', 'marca', 'modelo', 'ano', 'color', 'propio', 'ingresos', 'gastos', 'rentabilidad'];

  form: FormGroup;

  constructor(
    private gastoService: GastoService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) { 
    this.form = this.formBuilder.group({
      ano: ['', Validators.required]
    });
  }
  

  ngOnInit(): void {
  }

  /**
   * Busca el reporte gastos anuales
   */
  generarReporte(): void{
    this.gastoService.reporte(this.form.value.ano).subscribe(
      data => {
        this.reporte = data;
      },
      err => {
        console.log(err);
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
