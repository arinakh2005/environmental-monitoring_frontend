import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvironmentalIndicator } from '../types/environmental-indicator';

@Injectable()
export class EnvironmentalIndicatorService {
    private readonly API_URL = 'http://localhost:3000/environmental-indicators';

    constructor(private readonly httpClient: HttpClient) {}

    public getIndicators(): Observable<EnvironmentalIndicator[]> {
        return this.httpClient.get<EnvironmentalIndicator[]>(this.API_URL);
    }

    public getIndicatorById(id: number): Observable<EnvironmentalIndicator> {
        return this.httpClient.get<EnvironmentalIndicator>(`${this.API_URL}/${id}`);
    }

    public upsertIndicator(indicator: EnvironmentalIndicator): Observable<EnvironmentalIndicator> {
        if (indicator.id) {
            return this.httpClient.put<EnvironmentalIndicator>(`${this.API_URL}/${indicator.id}`, indicator);
        } else {
            return this.httpClient.post<EnvironmentalIndicator>(this.API_URL, indicator);
        }
    }

    public deleteIndicator(id: number): Observable<void> {
        return this.httpClient.delete<void>(`${this.API_URL}/${id}`);
    }
}
