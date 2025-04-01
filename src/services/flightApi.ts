
import { FlightData } from '../types/flight';

// Mock data for demo purposes
const MOCK_FLIGHTS: Record<string, FlightData> = {
  "TK123": {
    number: "TK123",
    status: "In Flight",
    departure: {
      airport: "Istanbul (IST)",
      time: "08:30"
    },
    arrival: {
      airport: "London (LHR)",
      time: "10:45"
    },
    progress: 65,
    remaining: "Time Remaining: 1 hour 10 minutes"
  },
  "BA456": {
    number: "BA456",
    status: "Landing",
    departure: {
      airport: "Berlin (BER)",
      time: "12:15"
    },
    arrival: {
      airport: "Istanbul (IST)",
      time: "16:20"
    },
    progress: 92,
    remaining: "Time Remaining: 15 minutes"
  },
  "LH789": {
    number: "LH789",
    status: "Delayed",
    departure: {
      airport: "Munich (MUC)",
      time: "14:00 (15:30)",
      
    },
    arrival: {
      airport: "Ankara (ESB)",
      time: "17:45 (19:15)"
    },
    progress: 0,
    remaining: "Waiting for Departure"
  },
  "PC101": {
    number: "PC101",
    status: "On Time",
    departure: {
      airport: "Izmir (ADB)",
      time: "16:40"
    },
    arrival: {
      airport: "Istanbul (SAW)",
      time: "17:45"
    },
    progress: 25,
    remaining: "Time Remaining: 50 minutes"
  },
  "TK789": {
    number: "TK789",
    status: "Cancelled",
    departure: {
      airport: "Antalya (AYT)",
      time: "09:15"
    },
    arrival: {
      airport: "Amsterdam (AMS)",
      time: "12:05"
    },
    progress: 0,
    remaining: "Flight Cancelled"
  }
};

export const searchFlight = async (flightNumber: string): Promise<FlightData> => {
  return new Promise((resolve, reject) => {
    // Simulate API delay
    setTimeout(() => {
      const flight = MOCK_FLIGHTS[flightNumber];
      
      if (flight) {
        resolve(flight);
      } else {
        reject(new Error("Flight not found"));
      }
    }, 1000);
  });
};

export const chatWithAssistant = async (flightNumber: string, userMessage: string): Promise<string> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Simple keyword-based responses
      const flight = MOCK_FLIGHTS[flightNumber];
      
      if (!flight) {
        resolve("No information found for this flight.");
        return;
      }
      
      const lowercaseMessage = userMessage.toLowerCase();
      
      if (lowercaseMessage.includes("time") || lowercaseMessage.includes("when") || lowercaseMessage.includes("arrival")) {
        resolve(`<div class="ai-response">
          Planned arrival time for flight ${flight.number}: <strong>${flight.arrival.time}</strong>.<br>
          ${flight.remaining}
        </div>`);
      }
      else if (lowercaseMessage.includes("weather")) {
        resolve(`<div class="ai-response">
          Weather at ${flight.arrival.airport}: Partly cloudy, 22°C.<br>
          No adverse weather conditions expected to affect the flight.
        </div>`);
      }
      else if (lowercaseMessage.includes("delay") || lowercaseMessage.includes("late")) {
        if (flight.status === "Delayed" || flight.status === "Cancelled") {
          resolve(`<div class="ai-response">
            Yes, flight ${flight.number} is currently <strong>${flight.status}</strong>.
          </div>`);
        } else {
          resolve(`<div class="ai-response">
            No, flight ${flight.number} is currently on schedule with no reported delays.
          </div>`);
        }
      }
      else if (lowercaseMessage.includes("status")) {
        resolve(`<div class="ai-response">
          Current status of flight ${flight.number}: <strong>${flight.status}</strong>.<br>
          Flight progress: ${flight.progress}%
        </div>`);
      }
      else {
        resolve(`I didn't understand your question about flight ${flight.number}. You can ask me about:<br>
        - When will the flight arrive?<br>
        - What's the weather like?<br>
        - Is there a delay?<br>
        - What's the status of the flight?`);
      }
    }, 1500);
  });
};
