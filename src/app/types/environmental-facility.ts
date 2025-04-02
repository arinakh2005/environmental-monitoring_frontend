import { EnvironmentalFacilityIndicator } from './environmental-facility-indicator';

export type EnvironmentalFacility = {
    id?: string | number,
    name: string,
    identifier?: string,
    station_code?: string,
    laboratory?: string,
    address: string,
    coordinates: string,
    subsystemType: 'air_quality' | 'coastal_water' | 'biodiversity' | 'radiation',
    subsystemDescription: string,
    indicatorsTitle: string,
    calculatedData: {
        overallAqi?: number,
        totalConcentrationRatio?: number,
    },
    facilityIndicators: EnvironmentalFacilityIndicator[],
    extra?: {
        aqiColor?: string,
        aqiLabel?: string,
        aqiDescription?: string,
        waterQualityColor?: string,
        waterQualityLabel?: string,
        waterQualityDescription?: string,
        radiationColor?: string,
        radiationLabel?: string,
        radiationDescription?: string,
    },
}
