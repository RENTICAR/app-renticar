import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Caracteristica } from 'src/app/models/caracteristica';

@Component({
  selector: 'app-eliminar-caracteristica',
  templateUrl: './eliminar-caracteristica.component.html',
  styleUrls: ['./eliminar-caracteristica.component.css']
})
export class EliminarCaracteristicaComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: Caracteristica) { }

  ngOnInit(): void {
  }

}
