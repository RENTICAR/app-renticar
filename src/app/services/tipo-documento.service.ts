import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TipoDocumento } from '../models/tipo-documento';

@Injectable({
  providedIn: 'root'
})
export class TipoDocumentoService {

  tiposDocumentosURL = 'http://localhost:8080/tiposDocumentos/';

  constructor(private httpClient: HttpClient) { }

  // Consume el servicio REST que lista todas los tipos de documento
  public listar(): Observable<TipoDocumento[]>{
    return this.httpClient.get<TipoDocumento[]>(this.tiposDocumentosURL + 'listar');
  }
}
