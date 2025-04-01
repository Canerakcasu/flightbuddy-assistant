
from django.shortcuts import render
from django.http import JsonResponse
import json

# Mock flight data
MOCK_FLIGHTS = {
    "TK123": {
        "number": "TK123",
        "status": "In Flight",
        "departure": {
            "airport": "Istanbul (IST)",
            "time": "08:30"
        },
        "arrival": {
            "airport": "London (LHR)",
            "time": "10:45"
        },
        "progress": 65,
        "remaining": "Time Remaining: 1 hour 10 minutes"
    },
    "BA456": {
        "number": "BA456",
        "status": "Landing",
        "departure": {
            "airport": "Berlin (BER)",
            "time": "12:15"
        },
        "arrival": {
            "airport": "Istanbul (IST)",
            "time": "16:20"
        },
        "progress": 92,
        "remaining": "Time Remaining: 15 minutes"
    },
    "LH789": {
        "number": "LH789",
        "status": "Delayed",
        "departure": {
            "airport": "Munich (MUC)",
            "time": "14:00 (15:30)",
        },
        "arrival": {
            "airport": "Ankara (ESB)",
            "time": "17:45 (19:15)"
        },
        "progress": 0,
        "remaining": "Waiting for Departure"
    },
    "PC101": {
        "number": "PC101",
        "status": "On Time",
        "departure": {
            "airport": "Izmir (ADB)",
            "time": "16:40"
        },
        "arrival": {
            "airport": "Istanbul (SAW)",
            "time": "17:45"
        },
        "progress": 25,
        "remaining": "Time Remaining: 50 minutes"
    },
    "TK789": {
        "number": "TK789",
        "status": "Cancelled",
        "departure": {
            "airport": "Antalya (AYT)",
            "time": "09:15"
        },
        "arrival": {
            "airport": "Amsterdam (AMS)",
            "time": "12:05"
        },
        "progress": 0,
        "remaining": "Flight Cancelled"
    }
}

def index(request):
    return render(request, 'flights/index.html')

def search_flight(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            flight_number = data.get('flight_number')
            
            # Add to search history in session
            if 'search_history' not in request.session:
                request.session['search_history'] = []
            
            if flight_number not in request.session['search_history']:
                request.session['search_history'].insert(0, flight_number)
                request.session['search_history'] = request.session['search_history'][:10]
                request.session.modified = True
            
            if flight_number in MOCK_FLIGHTS:
                return JsonResponse({
                    'success': True,
                    'flight': MOCK_FLIGHTS[flight_number]
                })
            else:
                return JsonResponse({
                    'success': False,
                    'error': 'Flight not found'
                }, status=404)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)
    
    return JsonResponse({'error': 'Invalid request method'}, status=400)

def chat_with_assistant(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            flight_number = data.get('flight_number')
            message = data.get('message', '')
            
            if flight_number not in MOCK_FLIGHTS:
                return JsonResponse({
                    'success': False,
                    'error': 'Flight not found'
                }, status=404)
            
            flight = MOCK_FLIGHTS[flight_number]
            response = ""
            
            # Simple keyword-based responses
            message_lower = message.lower()
            
            if 'time' in message_lower or 'when' in message_lower or 'arrival' in message_lower:
                response = f"<div class='ai-response'>Planned arrival time for flight {flight['number']}: <strong>{flight['arrival']['time']}</strong>.<br>{flight['remaining']}</div>"
            elif 'weather' in message_lower:
                response = f"<div class='ai-response'>Weather at {flight['arrival']['airport']}: Partly cloudy, 22°C.<br>No adverse weather conditions expected to affect the flight.</div>"
            elif 'delay' in message_lower or 'late' in message_lower:
                if flight['status'] == 'Delayed' or flight['status'] == 'Cancelled':
                    response = f"<div class='ai-response'>Yes, flight {flight['number']} is currently <strong>{flight['status']}</strong>.</div>"
                else:
                    response = f"<div class='ai-response'>No, flight {flight['number']} is currently on schedule with no reported delays.</div>"
            elif 'status' in message_lower:
                response = f"<div class='ai-response'>Current status of flight {flight['number']}: <strong>{flight['status']}</strong>.<br>Flight progress: {flight['progress']}%</div>"
            else:
                response = f"I didn't understand your question about flight {flight['number']}. You can ask me about:<br>- When will the flight arrive?<br>- What's the weather like?<br>- Is there a delay?<br>- What's the status of the flight?"
            
            return JsonResponse({
                'success': True,
                'response': response
            })
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)
    
    return JsonResponse({'error': 'Invalid request method'}, status=400)

def get_search_history(request):
    search_history = request.session.get('search_history', [])
    return JsonResponse({'search_history': search_history})
