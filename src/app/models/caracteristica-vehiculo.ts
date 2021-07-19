import { Opcion } from "./opcion";
import { Vehiculo } from "./vehiculo";

export class CaracteristicaVehiculo {
    id_caracteristicas_vehiculos?: number;
    vehiculo: Vehiculo;
    opcion: Opcion;
    est_caracteristica_vehiculo: string;
    usr_creacion?: string;
    usr_modificacion?: string;

    constructor(vehiculo: Vehiculo, opcion: Opcion, estado: string, usrCreacion: string, usrModificacion: string){
        this.vehiculo = vehiculo;
        this.opcion = opcion;
        this.est_caracteristica_vehiculo = estado;
        this.usr_creacion = usrCreacion;
        this.usr_modificacion = usrModificacion;
    }
    
}
