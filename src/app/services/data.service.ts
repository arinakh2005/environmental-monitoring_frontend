import { Injectable } from '@angular/core';
import { EnvironmentalFacility } from '../types/environmental-facility';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    // @ts-ignore
    public environmentalFacilities$: BehaviorSubject<EnvironmentalFacility[]> = new BehaviorSubject(null);

    constructor(private readonly httpClient: HttpClient) { }

    public fetchEnvironmentalFacilities(): void {
        this.httpClient.get<any>('http://localhost:3000/environmental-facilities').subscribe((result: EnvironmentalFacility[]) => {
            this.environmentalFacilities$.next([...result]);
        });
    }
}
