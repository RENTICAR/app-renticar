import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Vehiculo } from '../models/vehiculo';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {

  vehiculoURL = 'http://localhost:8080/vehiculos/';

  constructor(private httpClient: HttpClient) { }

  // Consume el servicio REST que lista todos los vehiculos
  public listar(): Observable<Vehiculo[]>{
    return this.httpClient.get<Vehiculo[]>(this.vehiculoURL + 'listar');
  }

  // Consume el servicio REST que busca vehiculos por id
  public buscar(id: number): Observable<Vehiculo>{
    return this.httpClient.get<Vehiculo>(this.vehiculoURL + `buscar/${id}`);
  }

  // Consume el servicio REST que busca vehiculos por placa
  public buscarPlaca(placa: string): Observable<Vehiculo>{
    return this.httpClient.get<Vehiculo>(this.vehiculoURL + `buscarPlaca/${placa}`);
  }

  
  public listarOpcion(idOpcion: number): Observable<Vehiculo[]>{
    return this.httpClient.get<Vehiculo[]>(this.vehiculoURL + `listarFiltroOpcion/${idOpcion}`);
  }

  // Consume el servicio REST para crear vehiculos
  public crear(vehiculo: Vehiculo): Observable<any>{
    return this.httpClient.post<any>(this.vehiculoURL + 'crear', vehiculo);
  }

  // Consume el servicio REST para editar un vehiculo
  public actualizar(id: number, vehiculo: Vehiculo): Observable<any>{
    return this.httpClient.put<any>(this.vehiculoURL + `actualizar/${id}`, vehiculo);
  }

  // Consume el servicio REST para eliminar de forma logica un vehiculo
  public eliminar(id: number, vehiculo: Vehiculo): Observable<any>{
    return this.httpClient.put<any>(this.vehiculoURL + `eliminar/${id}`, vehiculo);
  }

}
