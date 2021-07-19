import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Alquiler } from '../models/alquiler';
import { Reporte } from '../models/reporte';

@Injectable({
  providedIn: 'root'
})
export class AlquilerService {

  fechasAlquiler: FormGroup;
  alquilerURL = 'http://localhost:8080/alquileres/';

  constructor(private httpClient: HttpClient) { }

  /**
   * Consume el servicio REST que lista todos los alquileres
   * @returns Alquiler[]
   */
  public listar(): Observable<Alquiler[]>{
    return this.httpClient.get<Alquiler[]>(this.alquilerURL + 'listar');
  }

  /**
   * Consume el servicio REST que lista todos los alquileres de un mismo vehiculo
   * @param idVehiculo 
   * @returns Alquiler[]
   */
  public listarVehiculo(idVehiculo: number): Observable<Alquiler[]>{
    return this.httpClient.get<Alquiler[]>(this.alquilerURL + `listarVehiculo/${idVehiculo}`);
  }

  /**
   * Consume el servicio REST que lista todos los alquileres de un mismo cliente
   * @param idVehiculo 
   * @returns Alquiler[]
   */
   public listarCliente(idCliente: number): Observable<Alquiler[]>{
    return this.httpClient.get<Alquiler[]>(this.alquilerURL + `listarCliente/${idCliente}`);
  }

  /**
   * Consume el servicio REST que busca alquileres por id
   * @param id 
   * @returns 
   */
  public buscar(id: number): Observable<Alquiler>{
    return this.httpClient.get<Alquiler>(this.alquilerURL + `buscar/${id}`);
  }

  /**
   * Consume el servicio REST para crear alquileres
   * @param alquiler 
   * @returns
   */
  public crear(alquiler: Alquiler): Observable<any>{
    return this.httpClient.post<any>(this.alquilerURL + 'crear', alquiler);
  }

  /**
   * Consume el servicio REST para eliminar de forma logica un alquiler
   * @param id 
   * @param alquiler 
   * @returns 
   */
  public eliminar(id: number, alquiler: Alquiler): Observable<any>{
    return this.httpClient.put<any>(this.alquilerURL + `eliminar/${id}`, alquiler);
  }

  /**
   * Consume el servicio REST que genera un reporte de gastos
   * @param ano 
   * @param mes 
   * @returns 
   */
   public reporte(ano: string, mes: string): Observable<Reporte[]>{
    return this.httpClient.get<Reporte[]>(this.alquilerURL + `reporte/${ano}/${mes}`);
  }

}
