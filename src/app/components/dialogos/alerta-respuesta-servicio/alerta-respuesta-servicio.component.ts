import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-alerta-respuesta-servicio',
  templateUrl: './alerta-respuesta-servicio.component.html',
  styleUrls: ['./alerta-respuesta-servicio.component.css']
})
export class AlertaRespuestaServicioComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

}
