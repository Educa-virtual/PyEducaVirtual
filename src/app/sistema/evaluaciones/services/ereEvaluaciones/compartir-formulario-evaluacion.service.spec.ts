import { TestBed } from '@angular/core/testing'

import { CompartirFormularioEvaluacionService } from './compartir-formulario-evaluacion.service'

describe('CompartirFormularioEvaluacionService', () => {
    let service: CompartirFormularioEvaluacionService

    beforeEach(() => {
        TestBed.configureTestingModule({})
        service = TestBed.inject(CompartirFormularioEvaluacionService)
    })

    it('should be created', () => {
        expect(service).toBeTruthy()
    })
})
