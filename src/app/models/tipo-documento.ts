export class TipoDocumento {
    id_tipos_documentos?: number;
    des_tipo_documento: string;
    cod_tipo_documento: string;
    est_tipo_documento: string;
    usr_creacion?: string;
    usr_modificacion?: string;

    constructor(des_tipo_documento: string, cod_tipo_documento: string, estado: string, usrCreacion: string, usrModificacion: string){
        this.des_tipo_documento = des_tipo_documento;
        this.cod_tipo_documento = cod_tipo_documento;
        this.est_tipo_documento = estado;
        this.usr_creacion = usrCreacion;
        this.usr_modificacion = usrModificacion;
    }
}
