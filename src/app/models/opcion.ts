import { Caracteristica } from "./caracteristica";

export class Opcion {

    id_opciones_caracteristicas?: number;
    opcion: string;
    precio: number;
    caracteristica: Caracteristica;
    est_opcion_caracteristica: string;
    usr_creacion?: string;
    usr_modificacion?: string;

    constructor(opcion: string, precio: number, caracteristica: Caracteristica, estado: string, usrCreacion: string, usrModificacion: string){
        this.opcion = opcion;
        this.precio = precio;
        this.caracteristica = caracteristica;
        this.est_opcion_caracteristica = estado;
        this.usr_creacion = usrCreacion;
        this.usr_modificacion = usrModificacion;
    }
}
