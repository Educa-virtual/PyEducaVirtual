import { Injectable } from '@angular/core'

@Injectable({
    providedIn: 'root',
})
export class CompartirIdEvaluacionService {
    private _iEvaluacionId: number | null = null

    set iEvaluacionId(id: number) {
        //!Se agrego localStorage para el momento de reinicar la pagina no se pierdan esos datos
        // this._iEvaluacionId = id
        // // Guardar en el localStorage
        // localStorage.setItem('iEvaluacionId', id.toString())
        this._iEvaluacionId = id
        // Guardar en el localStorage
        localStorage.setItem('iEvaluacionId', id.toString()) //! Guardar el valor en localStorage
    }

    get iEvaluacionId() {
        // Intentar recuperar del localStorage si está vacío
        // if (!this._iEvaluacionId) {
        //     const storedId = localStorage.getItem('_iEvaluacionId')
        //     this._iEvaluacionId = storedId ? parseInt(storedId, 10) : null
        // }
        // return this._iEvaluacionId

        if (this._iEvaluacionId === null) {
            const storedId = localStorage.getItem('iEvaluacionId')
            this._iEvaluacionId = storedId ? parseInt(storedId, 10) : null
        }
        return this._iEvaluacionId
    }

    // NUEVO: Maneja el ID con persistencia en localStorage
    set iEvaluacionIdStorage(id: number) {
        this._iEvaluacionId = id
        localStorage.setItem('iEvaluacionId', id.toString()) // Guarda en localStorage
    }

    get iEvaluacionIdStorage(): number | null {
        // Recupera el ID de localStorage si _iEvaluacionId es nulo
        if (this._iEvaluacionId === null) {
            const storedId = localStorage.getItem('iEvaluacionId')
            this._iEvaluacionId = storedId ? parseInt(storedId, 10) : null
        }

        return this._iEvaluacionId
    }
    // NUEVO: Método para limpiar el ID de localStorage
    clearStorage(): void {
        this._iEvaluacionId = null
        localStorage.removeItem('iEvaluacionId')
    }
}
