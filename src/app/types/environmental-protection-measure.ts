import { EnvironmentalSubsystem } from '../enums/environmental-subsystem';

export type EnvironmentalProtectionMeasure = {
    id: number;
    subsystemType: EnvironmentalSubsystem,
    objectName: string,
    protectionMeasureName: string,
    estimatedFunding: number,
    executionPeriod: string,
    expectedEffect: string,
    fundingSource: string,
    executor: string,
}
