export class Vehiculo {
    id_vehiculos?: number;
    placa: string;
    marca: string;
    modelo: string;
    ano: number;
    color: string;
    propio: number;
    est_vehiculo: string;
    usr_creacion?: string;
    usr_modificacion?: string;

    constructor(placa: string, marca: string, modelo: string, ano: number, color: string, propio: number, estado: string, usrCreacion: string, usrModificacion: string){
        this.placa = placa;
        this.marca = marca;
        this.modelo = modelo;
        this.ano = ano;
        this.color = color;
        this.propio = propio;
        this.est_vehiculo = estado;
        this.usr_creacion = usrCreacion;
        this.usr_modificacion = usrModificacion;
    }
    
}
