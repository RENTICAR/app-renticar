import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Opcion } from '../models/opcion';

@Injectable({
  providedIn: 'root'
})
export class OpcionService {

  opcionURL = 'http://localhost:8080/opciones/';

  constructor(private httpClient: HttpClient) { }

  // Consume el servicio REST que lista todas las opciones de una misma caracteristica
  public listar(idCaracteristica: number): Observable<Opcion[]>{
    return this.httpClient.get<Opcion[]>(this.opcionURL + `listar/${idCaracteristica}`);
  }

  // Consume el servicio REST para crear opciones
  public crear(opcion: Opcion): Observable<any>{
    return this.httpClient.post<any>(this.opcionURL + 'crear', opcion);
  }

  // Consume el servicio REST para crear opciones
  public aumentarPrecios(porcentaje: Object): Observable<any>{
    return this.httpClient.put<any>(this.opcionURL + 'aumentarPrecios', porcentaje);
  }

  // Consume el servicio REST para editar una opcion
  public actualizar(id: number, opcion: Opcion): Observable<any>{
    return this.httpClient.put<any>(this.opcionURL + `actualizar/${id}`, opcion);
  }

  // Consume el servicio REST para eliminar de forma logica una opcion
  public eliminar(id: number, opcion: Opcion): Observable<any>{
    return this.httpClient.put<any>(this.opcionURL + `eliminar/${id}`, opcion);
  }
}
