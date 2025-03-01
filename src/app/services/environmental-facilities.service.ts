import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvironmentalFacility } from '../types/environmental-facility';

@Injectable()
export class EnvironmentalFacilitiesService {
    private readonly API_URL = 'http://localhost:3000/environmental-facilities';

    constructor(private http: HttpClient) {}

    public getAll(subsystemTypes: string[] = []): Observable<EnvironmentalFacility[]> {
        let queryParams = '';

        if (subsystemTypes.length > 0) {
            queryParams = `?subsystemTypes=${subsystemTypes.join(',')}`;
        }

        return this.http.get<EnvironmentalFacility[]>(`${this.API_URL}${queryParams}`);
    }

    public getById(id: number): Observable<EnvironmentalFacility> {
        return this.http.get<EnvironmentalFacility>(`${this.API_URL}/${id}`);
    }

    public create(facility: Partial<EnvironmentalFacility>): Observable<EnvironmentalFacility> {
        return this.http.post<EnvironmentalFacility>(this.API_URL, facility);
    }

    public update(id: number, facility: Partial<EnvironmentalFacility>): Observable<EnvironmentalFacility> {
        return this.http.put<EnvironmentalFacility>(`${this.API_URL}/${id}`, facility);
    }

    public delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }
}
