
import { FlightData } from '../types/flight';

// Mock data for demo purposes
const MOCK_FLIGHTS: Record<string, FlightData> = {
  "TK123": {
    number: "TK123",
    status: "Uçuşta",
    departure: {
      airport: "İstanbul (IST)",
      time: "08:30"
    },
    arrival: {
      airport: "Londra (LHR)",
      time: "10:45"
    },
    progress: 65,
    remaining: "Kalan Süre: 1 saat 10 dakika"
  },
  "BA456": {
    number: "BA456",
    status: "İniş Yapıyor",
    departure: {
      airport: "Berlin (BER)",
      time: "12:15"
    },
    arrival: {
      airport: "İstanbul (IST)",
      time: "16:20"
    },
    progress: 92,
    remaining: "Kalan Süre: 15 dakika"
  },
  "LH789": {
    number: "LH789",
    status: "Ertelendi",
    departure: {
      airport: "Münih (MUC)",
      time: "14:00 (15:30)",
      
    },
    arrival: {
      airport: "Ankara (ESB)",
      time: "17:45 (19:15)"
    },
    progress: 0,
    remaining: "Kalkış Bekleniyor"
  },
  "PC101": {
    number: "PC101",
    status: "Zamanında",
    departure: {
      airport: "İzmir (ADB)",
      time: "16:40"
    },
    arrival: {
      airport: "İstanbul (SAW)",
      time: "17:45"
    },
    progress: 25,
    remaining: "Kalan Süre: 50 dakika"
  },
  "TK789": {
    number: "TK789",
    status: "İptal Edildi",
    departure: {
      airport: "Antalya (AYT)",
      time: "09:15"
    },
    arrival: {
      airport: "Amsterdam (AMS)",
      time: "12:05"
    },
    progress: 0,
    remaining: "Uçuş İptal"
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
        reject(new Error("Uçuş bulunamadı"));
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
        resolve("Bu uçuş hakkında bilgi bulunamadı.");
        return;
      }
      
      const lowercaseMessage = userMessage.toLowerCase();
      
      if (lowercaseMessage.includes("saat") || lowercaseMessage.includes("zaman") || lowercaseMessage.includes("ne zaman")) {
        resolve(`<div class="ai-response">
          ${flight.number} uçuşu için planlanan varış saati: <strong>${flight.arrival.time}</strong>.<br>
          ${flight.remaining}
        </div>`);
      }
      else if (lowercaseMessage.includes("hava") || lowercaseMessage.includes("hava durumu")) {
        resolve(`<div class="ai-response">
          ${flight.arrival.airport} varış noktasında hava durumu: Parçalı bulutlu, 22°C.<br>
          Uçuşu etkileyecek bir hava durumu beklenmiyor.
        </div>`);
      }
      else if (lowercaseMessage.includes("gecik") || lowercaseMessage.includes("rötar")) {
        if (flight.status === "Ertelendi" || flight.status === "İptal Edildi") {
          resolve(`<div class="ai-response">
            Evet, ${flight.number} uçuşu şu anda <strong>${flight.status}</strong> durumunda.
          </div>`);
        } else {
          resolve(`<div class="ai-response">
            Hayır, ${flight.number} uçuşu şu anda zamanında ilerliyor ve herhangi bir gecikme bilgisi yok.
          </div>`);
        }
      }
      else if (lowercaseMessage.includes("durum") || lowercaseMessage.includes("statü")) {
        resolve(`<div class="ai-response">
          ${flight.number} uçuşunun mevcut durumu: <strong>${flight.status}</strong>.<br>
          Uçuş ilerlemesi: %${flight.progress}
        </div>`);
      }
      else {
        resolve(`${flight.number} uçuşu hakkında sorduğunuz soruyu anlamadım. Şunları sorabilirsiniz:<br>
        - Uçuş ne zaman varacak?<br>
        - Hava durumu nasıl?<br>
        - Uçuşta gecikme var mı?<br>
        - Uçuşun durumu nedir?`);
      }
    }, 1500);
  });
};
