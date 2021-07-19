import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Gasto } from '../models/gasto';
import { Reporte } from '../models/reporte';

@Injectable({
  providedIn: 'root'
})
export class GastoService {

  gastoURL = 'http://localhost:8080/gastos/';

  constructor(private httpClient: HttpClient) { }

  /**
   * Consume el servicio REST que lista todos los gasto
   * @returns Gasto[]
   */
   public listar(): Observable<Gasto[]>{
    return this.httpClient.get<Gasto[]>(this.gastoURL + 'listar');
  }

  /**
   * Consume el servicio REST que lista todos los gastos de un mismo vehiculo
   * @param idVehiculo 
   * @returns Gasto[]
   */
  public listarVehiculo(idVehiculo: number): Observable<Gasto[]>{
    return this.httpClient.get<Gasto[]>(this.gastoURL + `listarVehiculo/${idVehiculo}`);
  }

  /**
   * Consume el servicio REST que busca gastos por id
   * @param id 
   * @returns 
   */
   public buscar(id: number): Observable<Gasto>{
    return this.httpClient.get<Gasto>(this.gastoURL + `buscar/${id}`);
  }

  /**
   * Consume el servicio REST para crear alquileres
   * @param alquiler 
   * @returns
   */
  public crear(alquiler: Gasto): Observable<any>{
    return this.httpClient.post<any>(this.gastoURL + 'crear', alquiler);
  }

  /**
   * Consume el servicio REST que genera un reporte de gastos
   * @param ano 
   * @returns 
   */
   public reporte(ano: string): Observable<Reporte[]>{
    return this.httpClient.get<Reporte[]>(this.gastoURL + `reporte/${ano}`);
  }

  /**
   * Consume el servicio REST que genera un reporte de gastos
   * @param ano 
   * @returns 
   */
   public suma(): Observable<Reporte[]>{
    return this.httpClient.get<Reporte[]>(this.gastoURL + `suma`);
  }

}
