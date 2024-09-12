import { TestBed } from '@angular/core/testing'

import { GlobalLoaderServiceService } from './global-loader-service.service'

describe('GlobalLoaderServiceService', () => {
    let service: GlobalLoaderServiceService

    beforeEach(() => {
        TestBed.configureTestingModule({})
        service = TestBed.inject(GlobalLoaderServiceService)
    })

    it('should be created', () => {
        expect(service).toBeTruthy()
    })
})
