import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface Dataset {
    _id?: string;
    id?: string;
    name: string;
    data?: any[]; 
    customers?: any[];
    createdAt?: string;
}

export interface DatasetResponse {
    success: boolean;
    data: Dataset[];
}

export interface SingleDatasetResponse {
    success: boolean;
    data: Dataset;
}

@Injectable({ providedIn: 'root' })
export class DatasetService {

    constructor(private http: HttpClient) { }

    saveDataset(data: Dataset, token: string): Observable<SingleDatasetResponse> {
        return this.http.post<SingleDatasetResponse>(
            `${environment.api}/api/datasets`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
    }

    getDatasets(token: string): Observable<DatasetResponse> {
        return this.http.get<DatasetResponse>(
            `${environment.api}/api/datasets`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
    }

    deleteDataset(id: string, token: string): Observable<{success: boolean}> {
        return this.http.delete<{success: boolean}>(
            `${environment.api}/api/datasets/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
    }

    updateDataset(id: string, data: Partial<Dataset>, token: string): Observable<SingleDatasetResponse> {
        return this.http.put<SingleDatasetResponse>(
            `${environment.api}/api/datasets/${id}`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
    }
}
