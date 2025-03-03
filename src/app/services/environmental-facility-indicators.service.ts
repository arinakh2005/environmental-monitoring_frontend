import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvironmentalFacilityIndicator } from '../types/environmental-facility-indicator';

@Injectable()
export class EnvironmentalFacilityIndicatorsService {
    private readonly API_URL = 'http://localhost:3000/environmental-facility-indicators';

    constructor(private readonly httpClient: HttpClient) {}

    public getLastIndicators(facilityId: number, indicatorId: number, count: number = 7): Observable<EnvironmentalFacilityIndicator[]> {
        return this.httpClient.get<EnvironmentalFacilityIndicator[]>(`${this.API_URL}/facility/${facilityId}/indicator/${indicatorId}/last?count=${count}`);
    }
}
