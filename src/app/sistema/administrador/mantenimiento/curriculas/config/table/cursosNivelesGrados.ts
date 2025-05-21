import { CurriculasComponent } from '../../curriculas.component'
import * as acciones from '../actions/table'
import { payload } from '../types/cursosNivelesGrados'

export function accionBtnCursosNivelesGrados(
    this: CurriculasComponent,
    { accion, item }: { accion: keyof typeof acciones; item: any }
) {
    console.log(item)

    switch (accion) {
        case 'eliminar':
            break
    }
}

const filters: (keyof payload)[] = ['iNivelGradoId']

export function asyncCursosNivelGrado(this: CurriculasComponent) {
    filters.forEach((field: keyof payload) => {
        this.forms.assignCursosInNivelesGrados
            .get(field)
            .valueChanges.subscribe((value) => {
                console.log(field)
                if (value == undefined || value == null) return

                if (field == 'iNivelGradoId' && value != null) {
                    console.log('get cursos nivel grado')

                    const nivelGrado = this.dropdowns.nivelesGrados.find(
                        (niv) => niv.code == value
                    )

                    console.log('nivelGrado')
                    console.log(nivelGrado)
                    console.log(this.forms.curriculas.value.iCurrId)
                    console.log(
                        this.forms.assignCursosInNivelesGrados.get(
                            'iNivelGradoId'
                        ).value
                    )
                    console.log(value)

                    this.nivelesGradosService
                        .getCursosNivelesGrados(
                            this.forms.curriculas.get('iCurrId')?.value,
                            this.forms.assignCursosInNivelesGrados.get(
                                'iNivelGradoId'
                            )?.value
                        )
                        .subscribe({
                            next: (res: any) => {
                                this.cursosNivelesGrados.table.data = res.data
                            },
                        })
                }
            })
    })
}
