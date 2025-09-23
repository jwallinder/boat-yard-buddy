export interface Boat {
  id: string;
  name: string;
  length: number; // meters
  width: number; // meters
  type: 'motorboat' | 'sailboat';
  weight: number; // tons
  hasMast: boolean;
  owner: {
    name: string;
    phone: string;
  };
  position: {
    x: number;
    y: number;
  };
}

export interface Crane {
  id: string;
  name: string;
  position: {
    x: number;
    y: number;
  };
  capacityByDistance: {
    distance: number; // meters
    weight: number; // tons
  }[];
}

export interface Obstacle {
  id: string;
  name: string;
  position: {
    x: number;
    y: number;
  };
  width: number;
  height: number;
  type: 'building' | 'tree' | 'pole' | 'other';
}

export interface YardLayout {
  width: number;
  height: number;
  boats: Boat[];
  cranes: Crane[];
  obstacles: Obstacle[];
}