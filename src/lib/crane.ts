import { Boat, Crane } from "@/types/boat";

const checkCraneCapability = (crane: Crane, boat: Boat): CraneCapability => {
    if (!boat) return { canLift: false, maxDistance: 0, actualDistance: 0, weight: 0 };

    const distance = Math.sqrt(
        Math.pow(boat.position.x - crane.position.x, 2) +
        Math.pow(boat.position.y - crane.position.y, 2)
    );

    // Find the maximum distance the crane can lift this weight
    const capability = crane.capacityByDistance.find(cap => boat.weight <= cap.weight);
    const maxDistance = capability ? capability.distance : 0;

    return {
        canLift: distance <= maxDistance,
        actualDistance: distance,
        maxDistance,
        weight: boat.weight
    };
};

type CraneCapability = {
    canLift: boolean;
    actualDistance: number;
    maxDistance: number;
    weight: number;
}

type CraneWithCapability = CraneCapability & { crane: Crane; }

export const cranesSortedByDistance = (cranes: Crane[], selectedBoat: Boat): CraneWithCapability[] => {
    return cranes
        .map(crane => ({
            crane,
            ...checkCraneCapability(crane, selectedBoat)
        }))
        .sort((a, b) => (a.actualDistance || 0) - (b.actualDistance || 0))
}

export const cranesList = (cranes: Crane[]): CraneWithCapability[] => {
    return cranes.map(crane => ({ crane, canLift: false, actualDistance: 0, maxDistance: 0, weight: 0 }));
} 