import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'app-ajustar-precios',
  templateUrl: './ajustar-precios.component.html',
  styleUrls: ['./ajustar-precios.component.css']
})
export class AjustarPreciosComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: number) { }

  ngOnInit(): void {
  }

}
