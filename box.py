
"""
This file contains the HTML code for the flight search box component.
This can be included in a Django template using template inclusion tags.
"""

def get_search_box_html():
    """
    Returns the HTML for the flight search box component.
    """
    html = """
    <div class="search-container">
      <form id="flightSearchForm" class="flight-search-form backdrop-blur-lg bg-slate-800/60 border border-slate-700/50 rounded-xl p-6 shadow-lg transition-all hover:shadow-blue-900/20">
          <div class="space-y-2 mb-4">
              <h2 class="text-xl font-semibold text-white">Flight Tracking</h2>
              <p class="text-slate-400 text-sm">Enter a flight number to get real-time tracking information</p>
          </div>
          
          <div class="search-box relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3 top-1/2 transform -translate-y-1/2 lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input
                  type="text"
                  id="flightNumberInput"
                  class="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-3 px-4 pl-10 
                    text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 
                    focus:border-transparent"
                  placeholder="Enter flight number (Example: TK123)"
                  required
              >
          </div>
          
          <button 
              type="submit" 
              class="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plane"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>
              <span>Track Flight</span>
          </button>
      </form>
    </div>
    """
    return html

def render_search_box():
    """
    Function to be called from a Django view to render the search box.
    """
    return get_search_box_html()
