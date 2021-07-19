import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CaracteristicaVehiculo } from '../models/caracteristica-vehiculo';

@Injectable({
  providedIn: 'root'
})
export class CaracteristicaVehiculoService {

  caracteristicaVehiculoURL = 'http://localhost:8080/caracteristicasVehiculos/';

  constructor(private httpClient: HttpClient) { }

  // Consume el servicio REST que lista todas las relaciones de caractereristicas(opciones) de un mismo vehiculo
  public listar(idVehiculo: number): Observable<CaracteristicaVehiculo[]>{
    return this.httpClient.get<CaracteristicaVehiculo[]>(this.caracteristicaVehiculoURL + `listar/${idVehiculo}`);
  }

  // Consume el servicio REST para crear relaciones de caracteriticas(opciones) y vehiculo
  public crear(caracteristicaVehiculo: CaracteristicaVehiculo): Observable<any>{
    return this.httpClient.post<any>(this.caracteristicaVehiculoURL + 'crear', caracteristicaVehiculo);
  }

  // Consume el servicio REST para editar una relacion caracteritica(opcion) de un vehiculo
  public actualizar(id: number, caracteristicaVehiculo: CaracteristicaVehiculo): Observable<any>{
    return this.httpClient.put<any>(this.caracteristicaVehiculoURL + `actualizar/${id}`, caracteristicaVehiculo);
  }

  // Consume el servicio REST para eliminar de forma logica una relacion caracteritica(opcion)
  public eliminar(id: number, caracteristicaVehiculo: CaracteristicaVehiculo): Observable<any>{
    return this.httpClient.put<any>(this.caracteristicaVehiculoURL + `eliminar/${id}`, caracteristicaVehiculo);
  }
}
