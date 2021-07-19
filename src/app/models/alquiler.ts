import { Cliente } from "./cliente";
import { Vehiculo } from "./vehiculo";

export class Alquiler {
    id_alquileres?: number;
    fec_inicio: Date;
    fec_fin: Date;
    tarifa: number;
    vehiculo: Vehiculo;
    cliente: Cliente;
    est_alquiler: string;
    usr_creacion?: string;
    usr_modificacion?: string;

    constructor(fec_inicio: Date, fec_fin: Date, tarifa: number, vehiculo: Vehiculo, cliente: Cliente, estado: string, usrCreacion: string, usrModificacion: string){
        this.fec_inicio = fec_inicio;
        this.fec_fin = fec_fin;
        this.tarifa = tarifa;
        this.vehiculo = vehiculo;
        this.cliente = cliente;
        this.est_alquiler = estado;
        this.usr_creacion = usrCreacion;
        this.usr_modificacion = usrModificacion;
    }
}
