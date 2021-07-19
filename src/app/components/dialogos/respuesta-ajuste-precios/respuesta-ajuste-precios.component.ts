import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-respuesta-ajuste-precios',
  templateUrl: './respuesta-ajuste-precios.component.html',
  styleUrls: ['./respuesta-ajuste-precios.component.css']
})
export class RespuestaAjustePreciosComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

}
