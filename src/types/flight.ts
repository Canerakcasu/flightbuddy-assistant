
export interface FlightData {
  number: string;
  status: string;
  departure: {
    airport: string;
    time: string;
  };
  arrival: {
    airport: string;
    time: string;
  };
  progress: number;
  remaining: string;
}
