import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente';
import { TipoDocumento } from '../models/tipo-documento';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  clienteURL = 'http://localhost:8080/clientes/';

  constructor(private httpClient: HttpClient) { }

  // Consume el servicio REST que busca clientes por numero de documento
  public buscarDocumento(numDocumento: number, idTipoDocumento: number): Observable<Cliente>{
    return this.httpClient.get<Cliente>(this.clienteURL + `buscarDocumento/${numDocumento}/${idTipoDocumento}`);
  }

  /**
   * Consume el servicio REST para crear y actualizar clientes
   * @param cliente 
   * @returns 
   */
  public crear(cliente: Cliente): Observable<any>{
    return this.httpClient.post<any>(this.clienteURL + 'crear', cliente);
  }

}
