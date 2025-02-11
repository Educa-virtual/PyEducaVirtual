import { PrimengModule } from '@/app/primeng.module'
import { Component } from '@angular/core'

@Component({
    selector: 'app-representante',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './representante.component.html',
    styleUrl: './representante.component.scss',
})
export class RepresentanteComponent {
    tipo_documentos: Array<object>
    estados_civiles: Array<object>
    relaciones: Array<object>
    sexos: Array<object>
    paises: Array<object>
    departamentos: Array<object>
    provincias: Array<object>
    distritos: Array<object>
    lenguas: Array<object>
    etnias: Array<object>
    religiones: Array<object>
    grados_instruccion: Array<object>
    ocupaciones: Array<object>

    ngOnInit(): void {
        this.getTipoDocumento()
        this.getEstadosCiviles()
        this.getSexos()
        this.getPaises()
        this.getDepartamentos()
        this.getProvincias()
        this.getDistritos()
        this.getLenguas()
        this.getEtnias()
        this.getReligiones()
        this.getRelaciones()
        this.getGradosInstruccion()
        this.getOcupaciones()
    }

    getTipoDocumento() {
        this.tipo_documentos = [
            { nombre: 'DOCUMENTO NACIONAL DE IDENTIDAD', id: '1' },
            { nombre: 'CARNET DE EXTRANJERIA', id: '2' },
            { nombre: 'PERMISO TEMPORAL DE PERMANENCIA', id: '3' },
            { nombre: 'PASAPORTE', id: '4' },
        ]
    }

    getEstadosCiviles() {
        this.estados_civiles = [
            { nombre: 'SOLTERO', id: '1' },
            { nombre: 'CASADO', id: '2' },
            { nombre: 'VIUDO', id: '3' },
        ]
    }

    getSexos() {
        this.sexos = [
            { nombre: 'MASCULINO', id: 'M' },
            { nombre: 'FEMENINO', id: 'F' },
        ]
    }

    getPaises() {
        this.paises = [
            { nombre: 'ARGENTINA', id: 'AR' },
            { nombre: 'BOLIVIA', id: 'BO' },
            { nombre: 'BRASIL', id: 'BR' },
            { nombre: 'CHILE', id: 'CL' },
            { nombre: 'COLOMBIA', id: 'CO' },
            { nombre: 'ECUADOR', id: 'EC' },
            { nombre: 'GUATEMALA', id: 'GT' },
            { nombre: 'MEXICO', id: 'MX' },
            { nombre: 'PARAGUAY', id: 'PY' },
            { nombre: 'PERU', id: 'PE' },
            { nombre: 'URUGUAY', id: 'UY' },
            { nombre: 'VENEZUELA', id: 'VE' },
        ]
    }

    getDepartamentos() {
        this.departamentos = [
            { nombre: 'MOQUEGUA', id: '1' },
            { nombre: 'TACNA', id: '2' },
            { nombre: 'PUNO', id: '3' },
            { nombre: 'CUZCO', id: '4' },
            { nombre: 'LIMA', id: '5' },
        ]
    }

    getProvincias() {
        this.provincias = [
            { nombre: 'MARISCAL DOMINGO NIETO', id: '1' },
            { nombre: 'ILO', id: '2' },
            { nombre: 'GENERAL SANCHEZ CERRO', id: '3' },
        ]
    }

    getDistritos() {
        this.distritos = [
            { nombre: 'ILO', id: '1' },
            { nombre: 'EL ALGARROBAL', id: '2' },
            { nombre: 'PACOCHA', id: '3' },
            { nombre: 'SAMEGUA', id: '4' },
            { nombre: 'SAN ANTONIO', id: '5' },
        ]
    }

    getLenguas() {
        this.lenguas = [
            { nombre: 'ESPAÑOL', id: '1' },
            { nombre: 'QUECHUA', id: '2' },
            { nombre: 'AYMARA', id: '3' },
            { nombre: 'INGLÉS', id: '4' },
        ]
    }

    getEtnias() {
        this.etnias = [
            { nombre: 'MESTIZO', id: '1' },
            { nombre: 'AFROAMERICANO', id: '2' },
        ]
    }

    getReligiones() {
        this.religiones = [
            { nombre: 'CATOLICO', id: '1' },
            { nombre: 'PROTESTANTE', id: '2' },
            { nombre: 'ATEO', id: '3' },
        ]
    }

    getRelaciones() {
        this.relaciones = [
            { nombre: 'PADRE', id: '1' },
            { nombre: 'MADRE', id: '2' },
            { nombre: 'HERMANO', id: '3' },
            { nombre: 'HERMANA', id: '4' },
            { nombre: 'ABUELO', id: '5' },
            { nombre: 'ABUELA', id: '6' },
            { nombre: 'TIO', id: '7' },
            { nombre: 'TIA', id: '8' },
            { nombre: 'PRIMO', id: '9' },
            { nombre: 'PRIMA', id: '10' },
        ]
    }

    getGradosInstruccion() {
        this.grados_instruccion = [
            { nombre: 'SUPERIOR UNIVERSITARIO', id: '1' },
            { nombre: 'SUPERIOR TECNICO', id: '2' },
            { nombre: 'SECUNDARIA', id: '3' },
            { nombre: 'PRIMARIA', id: '4' },
            { nombre: 'SIN ESTUDIOS', id: '5' },
        ]
    }

    getOcupaciones() {
        this.ocupaciones = [
            { nombre: 'INGENIERO', id: '1' },
            { nombre: 'CONTADOR', id: '1' },
            { nombre: 'ABOGADO', id: '1' },
            { nombre: 'ENFERMERO', id: '2' },
            { nombre: 'MEDICO', id: '3' },
            { nombre: 'DOCENTE', id: '4' },
            { nombre: 'COMERCIANTE', id: '5' },
            { nombre: 'INDEPENDIENTE', id: '6' },
        ]
    }
}
