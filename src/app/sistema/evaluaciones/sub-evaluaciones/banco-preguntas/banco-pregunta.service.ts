import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

interface PreguntaFormState {
    parentContainer: 'ere' | 'eval'
    config: {
        iPesoName: string
    }
}

@Injectable()
export class BancoPreguntaFormStateService {
    private state: BehaviorSubject<PreguntaFormState> =
        new BehaviorSubject<PreguntaFormState>({
            parentContainer: 'ere',
            config: {
                iPesoName: 'Peso',
            },
        })
}
