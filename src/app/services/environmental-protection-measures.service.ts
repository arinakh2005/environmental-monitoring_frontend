import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvironmentalProtectionMeasure } from '../types/environmental-protection-measure';

@Injectable()
export class EnvironmentalProtectionMeasuresService {
    private readonly API_URL = 'http://localhost:3000/environmental-protection-measures';

    constructor(private readonly httpClient: HttpClient) {}

    public getMeasures(): Observable<EnvironmentalProtectionMeasure[]> {
        return this.httpClient.get<EnvironmentalProtectionMeasure[]>(this.API_URL);
    }

    public getMeasureById(id: number): Observable<EnvironmentalProtectionMeasure> {
        return this.httpClient.get<EnvironmentalProtectionMeasure>(`${this.API_URL}/${id}`);
    }
}
