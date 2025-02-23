export type EnvironmentalFacility = {
    name: string,
    identifier?: string,
    station_code?: string,
    laboratory?: string,
    address: string,
    coordinates: string,
    subsystemType: 'air_quality' | 'coastal_water' | 'biodiversity' | 'radiation',
    subsystemDescription: string,
    indicatorsTitle: string,
    indicators: EnvironmentalIndicator[],
}

export type EnvironmentalIndicator = {
    name: string,
    value: string,
}
