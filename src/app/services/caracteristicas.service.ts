import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Caracteristica } from '../models/caracteristica';

@Injectable({
  providedIn: 'root'
})
export class CaracteristicasService {

  caracteristicaURL = 'http://localhost:8080/caracteristicas/';

  constructor(private httpClient: HttpClient) { }

  // Consume el servicio REST que lista todas las caracteristicas
  public listar(): Observable<Caracteristica[]>{
    return this.httpClient.get<Caracteristica[]>(this.caracteristicaURL + 'listar');
  }

  // Consume el servicio REST que busca caracteristicas por id
  public buscar(id: number): Observable<Caracteristica>{
    return this.httpClient.get<Caracteristica>(this.caracteristicaURL + `buscar/${id}`);
  }

  // Consume el servicio REST que busca caracteristicas por nombre
  public buscarNombre(nombre: string): Observable<Caracteristica>{
    return this.httpClient.get<Caracteristica>(this.caracteristicaURL + `buscarNombre/${nombre}`);
  }

  // Consume el servicio REST para crear caracteristicas
  public crear(caracteristica: Caracteristica): Observable<any>{
    return this.httpClient.post<any>(this.caracteristicaURL + 'crear', caracteristica);
  }

  // Consume el servicio REST para editar una caracteristicas
  public actualizar(id: number, caracteristica: Caracteristica): Observable<any>{
    return this.httpClient.put<any>(this.caracteristicaURL + `actualizar/${id}`, caracteristica);
  }

  // Consume el servicio REST para eliminar de forma logica una caracteristicas
  public eliminar(id: number, caracteristica: Caracteristica): Observable<any>{
    return this.httpClient.put<any>(this.caracteristicaURL + `eliminar/${id}`, caracteristica);
  }

}
