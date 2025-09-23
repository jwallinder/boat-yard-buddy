import { Boat, Crane, Obstacle } from "@/types/boat";

export const BOATS: Boat[] = [
    {
        id: 'boat-1',
        name: 'omega 36',
        position: { x: 5, y: 100 },
        weight: 6000,
        length: 11,
        width: 3.36,
        type: 'sailboat',
        hasMast: false,
        owner: {
            name: 'Johan Wallinder',
            phone: '0706050270',
        },
    },
    {
        id: 'boat-2',
        name: 'GrandBanks',
        position: { x: 25, y: 100 },
        weight: 1500,
        length: 8.6,
        width: 2.8,
        type: 'motorboat',
        hasMast: false,
        owner: {
            name: 'Mattias Eriksson',
            phone: '0706050270',
        },
    },
    {
        id: 'boat-3',
        name: 'Ockelbo DC 21',
        position: { x: 50, y: 100 },
        weight: 2300,
        length: 8.1,
        width: 2.2,
        type: 'motorboat',
        hasMast: false,
        owner: {
            name: 'Ägare 3',
            phone: '1234567890',
        },
    },
];

const craneCapacity = [
    { distance: 35, weight: 2000 },
    { distance: 27, weight: 3000 },
    { distance: 22, weight: 4000 },
    { distance: 20, weight: 5000 },
    { distance: 15, weight: 8000 },
    { distance: 10, weight: 12000 },
    { distance: 5, weight: 18000 },
];
// Default cranes (example positions)
export const CRANES: Crane[] = [
    {
        id: 'crane-1',
        name: 'Kran 1',
        position: { x: 5, y: 100 },
        capacityByDistance: craneCapacity
    },
    {
        id: 'crane-2',
        name: 'Kran 2',
        position: { x: 25, y: 100 },
        capacityByDistance: craneCapacity
    },
    {
        id: 'crane-3',
        name: 'Kran 3',
        position: { x: 50, y: 100 },
        capacityByDistance: craneCapacity
    },
    {
        id: 'crane-4',
        name: 'Kran 4',
        position: { x: 70, y: 100 },
        capacityByDistance: craneCapacity
    }
];

// Example obstacles
export const OBSTACLES: Obstacle[] = [
    {
        id: 'building-1',
        name: 'Klubbhus',
        position: { x: 15, y: 120 },
        width: 8,
        height: 12,
        type: 'building'
    },
    {
        id: 'tree-1',
        name: 'Träd',
        position: { x: 40, y: 80 },
        width: 3,
        height: 3,
        type: 'tree'
    }
];