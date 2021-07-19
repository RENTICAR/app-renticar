export class Caracteristica {
    id_caracteristicas?: number;
    nombre: string;
    est_caracteristica: string;
    usr_creacion?: string;
    usr_modificacion?: string;

    constructor(nombre: string, estado: string, usrCreacion: string, usrModificacion: string){
        this.nombre = nombre;
        this.est_caracteristica = estado;
        this.usr_creacion = usrCreacion;
        this.usr_modificacion = usrModificacion;
    }
}
