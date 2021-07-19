import { Vehiculo } from "./vehiculo";

export class Ocupacion {
    id_ocupaciones?: number;
    fec_ocupacion: Date;
    ocupacion_dueno: number;
    vehiculo:  Vehiculo;
    est_ocupacion: string;
    usr_creacion?: string;
    usr_modificacion?: string;

    constructor(fec_ocupacion: Date, ocupacion_dueno: number, vehiculo: Vehiculo, estado: string, usrCreacion: string, usrModificacion: string){
        this.fec_ocupacion = fec_ocupacion;
        this.ocupacion_dueno = ocupacion_dueno;
        this.vehiculo = vehiculo;
        this.est_ocupacion = estado;
        this.usr_creacion = usrCreacion;
        this.usr_modificacion = usrModificacion;
    }

}
