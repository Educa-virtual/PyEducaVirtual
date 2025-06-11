import { Injectable } from '@angular/core'
import {
    IGetTableService,
    IInsertTableService,
    IUpdateTableService,
    IDeleteTableService,
} from '@/app/interfaces/api.interface'
import { httpServiceObs } from './httpServiceObs'

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    constructor(private http: httpServiceObs) {}

    getData(queryPayload: IGetTableService | IGetTableService[]) {
        // Realizar la solicitud HTTP y obtener los datos.
        this.http.getData('virtual/getData', queryPayload)
    }

    insertData(queryPayload: IInsertTableService | IInsertTableService[]) {
        if (Array.isArray(queryPayload)) {
            queryPayload.forEach((item) => {
                if (typeof item['campos'] === 'object') {
                    item['campos'] = JSON.stringify(item['campos'])
                }
            })
        }

        if (typeof queryPayload['campos'] === 'object') {
            queryPayload['campos'] = JSON.stringify(queryPayload['campos'])
        }

        return this.http.postData('virtual/insertData', queryPayload)
    }
    updateData(queryPayload: IUpdateTableService | IUpdateTableService[]) {
        if (Array.isArray(queryPayload)) {
            queryPayload.forEach((item) => {
                if (typeof item['campos'] === 'object') {
                    item['campos'] = JSON.stringify(item['campos'])
                }
                if (typeof item['where'] === 'object') {
                    item['where'] = JSON.stringify(item['where'])
                }
            })
        }

        if (typeof queryPayload['campos'] === 'object') {
            queryPayload['campos'] = JSON.stringify(queryPayload['campos'])
        }
        if (typeof queryPayload['where'] === 'object') {
            queryPayload['where'] = JSON.stringify(queryPayload['where'])
        }

        return this.http.putData('virtual/updateData', queryPayload)
    }
    deleteData(queryPayload: IDeleteTableService | IDeleteTableService[]) {
        return this.http.deleteData('virtual/deleteData', queryPayload)
    }
}
