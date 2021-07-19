import { Vehiculo } from "./vehiculo";

export class Gasto {
    id_gastos?: number;
    tipo_gasto: string;
    costo: number;
    fec_gasto: Date;
    vehiculo: Vehiculo;
    est_gasto: string;
    usr_creacion?: string;
    usr_modificacion?: string;

    constructor(tipo_gasto: string, costo: number, fec_gasto: Date, vehiculo: Vehiculo, estado: string, usrCreacion: string, usrModificacion: string){
        this.tipo_gasto = tipo_gasto;
        this.costo = costo;
        this.fec_gasto = fec_gasto;
        this.vehiculo = vehiculo;
        this.est_gasto = estado;
        this.usr_creacion = usrCreacion;
        this.usr_modificacion = usrModificacion;
    }
}
