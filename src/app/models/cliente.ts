import { TipoDocumento } from "./tipo-documento";

export class Cliente {
    id_clientes?: number;
    nombre: string;
    apellido: string;
    telefono: string;
    direccion: string;
    email: string;
    num_documento: number;
    tipoDocumento: TipoDocumento;
    est_cliente: string;
    usr_creacion?: string;
    usr_modificacion?: string;

    constructor(nombre: string, apellido: string, telefono: string, direccion: string, email: string, num_documento: number, tipoDocumento: TipoDocumento, estado: string, usrCreacion: string, usrModificacion: string){
        this.nombre = nombre;
        this.apellido = apellido;
        this.telefono = telefono;
        this.direccion = direccion;
        this.email = email;
        this.num_documento = num_documento;
        this.tipoDocumento = tipoDocumento;
        this.est_cliente = estado;
        this.usr_creacion = usrCreacion;
        this.usr_modificacion = usrModificacion;
    }

}
