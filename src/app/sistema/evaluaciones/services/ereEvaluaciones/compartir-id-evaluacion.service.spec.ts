import { TestBed } from '@angular/core/testing'

import { CompartirIdEvaluacionService } from './compartir-id-evaluacion.service'

describe('CompartirIdEvaluacionService', () => {
    let service: CompartirIdEvaluacionService

    beforeEach(() => {
        TestBed.configureTestingModule({})
        service = TestBed.inject(CompartirIdEvaluacionService)
    })

    it('should be created', () => {
        expect(service).toBeTruthy()
    })
})
