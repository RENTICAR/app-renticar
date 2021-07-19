import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ocupacion } from '../models/ocupacion';

@Injectable({
  providedIn: 'root'
})
export class OcupacionService {

  ocupacionURL = 'http://localhost:8080/ocupaciones/';

  constructor(private httpClient: HttpClient) { }

  // Consume el servicio REST que lista todas las ocupaciones del dueño de un vehiculo
  public listar(idVehiculo: number): Observable<Ocupacion[]>{
    return this.httpClient.get<Ocupacion[]>(this.ocupacionURL + `listar/${idVehiculo}`);
  }

  /**
   * Consume el servicio REST que cuenta las ocupaciones del dueño de un vehiculo por año
   * @param idVehiculo 
   * @param ano 
   * @returns 
   */
  public contarDueno(idVehiculo: number, ano: number): Observable<number>{
    return this.httpClient.get<number>(this.ocupacionURL + `contarDueno/${idVehiculo}/${ano}`);
  }

  // Consume el servicio REST para crear ocupaciones
  public crear(ocupacion: Ocupacion): Observable<any>{
    return this.httpClient.post<any>(this.ocupacionURL + 'crear', ocupacion);
  }

  // Consume el servicio REST para editar una opcion
  public actualizar(id: number, ocupacion: Ocupacion): Observable<any>{
    return this.httpClient.put<any>(this.ocupacionURL + `actualizar/${id}`, ocupacion);
  }

  // Consume el servicio REST para eliminar de forma logica una opcion
  public eliminar(id: number, ocupacion: Ocupacion): Observable<any>{
    return this.httpClient.put<any>(this.ocupacionURL + `eliminar/${id}`, ocupacion);
  }
}
