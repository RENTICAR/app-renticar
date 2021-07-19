import { Alquiler } from "./alquiler";

export class Recibido {
    id_recibidos?:number;
    novedades: string;
    satisfaccion_servicio: number;
    fec_recibido: Date;
    ingresos: number;
    alquiler: Alquiler;
    est_recibido: string;
    usr_creacion?: string;
    usr_modificacion?: string;

    constructor(novedades: string, satisfaccion_servicio: number, fec_recibido: Date, ingresos: number, alquiler: Alquiler, estado: string, usrCreacion: string, usrModificacion: string){
        this.novedades = novedades;
        this.satisfaccion_servicio =satisfaccion_servicio;
        this.fec_recibido = fec_recibido;
        this.ingresos = ingresos;
        this.alquiler = alquiler;        
        this.est_recibido = estado;
        this.usr_creacion = usrCreacion;
        this.usr_modificacion = usrModificacion;
    }
}
