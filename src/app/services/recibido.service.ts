import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Recibido } from '../models/recibido';

@Injectable({
  providedIn: 'root'
})
export class RecibidoService {

  fechasAlquiler: FormGroup;
  recibidoURL = 'http://localhost:8080/recibidos/';

  constructor(private httpClient: HttpClient) { }

  /**
   * Consume el servicio REST para crear alquileres
   * @param alquiler 
   * @returns
   */
   public crear(recibido: Recibido): Observable<any>{
    return this.httpClient.post<any>(this.recibidoURL + 'crear', recibido);
  }

}
