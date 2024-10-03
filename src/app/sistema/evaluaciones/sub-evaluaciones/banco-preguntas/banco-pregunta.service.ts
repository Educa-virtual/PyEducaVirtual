import { Injectable } from '@angular/core'
import { BehaviorSubject, distinctUntilChanged, map, Observable } from 'rxjs'
import { IPregunta } from './models/pregunta.model'

interface PreguntaFormState {
    preguntaState: 'EDITAR' | 'CREAR'
    alternativaState: 'EDITAR' | 'CREAR'
    pregunta: IPregunta
}

@Injectable()
export class BancoPreguntaFormStateService {
    private state: BehaviorSubject<PreguntaFormState> =
        new BehaviorSubject<PreguntaFormState>({
            preguntaState: 'CREAR',
            alternativaState: 'CREAR',
            pregunta: {} as IPregunta,
        })

    selectPreguntaState(): Observable<'EDITAR' | 'CREAR'> {
        return this.state.pipe(
            map((state) => state.preguntaState),
            distinctUntilChanged()
        )
    }

    constructor() {}

    selectAlternativaState(): Observable<'EDITAR' | 'CREAR'> {
        return this.state.pipe(
            map((state) => state.alternativaState),
            distinctUntilChanged()
        )
    }

    selectPregunta(): Observable<IPregunta> {
        return this.state.pipe(
            map((state) => state.pregunta),
            distinctUntilChanged()
        )
    }

    setPreguntaState(newState: 'EDITAR' | 'CREAR'): void {
        this.state.next({ ...this.state.value, preguntaState: newState })
    }

    setAlternativaState(newState: 'EDITAR' | 'CREAR'): void {
        this.state.next({ ...this.state.value, alternativaState: newState })
    }

    setPregunta(pregunta: IPregunta): void {
        this.state.next({ ...this.state.value, pregunta })
    }
}
