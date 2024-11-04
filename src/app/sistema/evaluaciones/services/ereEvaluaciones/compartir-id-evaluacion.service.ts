import { Injectable } from '@angular/core'

@Injectable({
    providedIn: 'root',
})
export class CompartirIdEvaluacionService {
    private _iEvaluacionId: number | null = null

    set iEvaluacionId(id: number) {
        this._iEvaluacionId = id
    }

    get iEvaluacionId() {
        return this._iEvaluacionId
    }
}
