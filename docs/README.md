
# inst377-week13-sampleapp-fa26
Week 13 - Sample Vercel app for INST377
# 377project

# Weather Helper
Weather helper is a weather web application designed to help users understand weather conditions and make better decisions for their day. Users can search for cities, receive current weather information, save locations, and also receive simple weather advice based on the current weather conditions

The application also provudes visual weather features such as a temperature chart and an interactive map for searched cities

# Features
Search for live weather by city
Receive simple weather advice
Save favorite locations
Clear saved locations
Interactive temperature chart
Interactive city map
Responsive and user-friendly design

# API and Libraries Used
API: OpenWeather API, Supabase Database API
Libraries: Chart.js, Leaflet.js


# Target Browsers
This applicaion is deisnged for Google Chrome, Firefox, Safari, and mobile browsers

# Developer Manual
1. Clone repository:
git clone github_repo_link
2. Installing dependencies:
npm install
3. Create new ".env" file in root directory
4. Add the following to the file:
supabase key, supabase url, openweather api key
5. Start server using: npm start
Open: http://localhost:3000/

# Language/Technologies Used
HTML
CSS
JavaScript
Node.js
Express.js
OpenWeather API
Chart.js
Leaflet.js

# API Endpoints
GET /api/weather?city={city} gets the current weather from OpenWeather API
GET /api/saved-locations retrieves all saved locations from Supabase database
POST /api/saved-locations saves a city to the Supabase database
DELETE /api/saved-locations clears saved locations from Supabase database

# Tests
Testing is done manually by running the application locally and checking that weather search, saved locations, charts, maps, and delete feature work correctly

# Known Bugs
Smaller cities may not return weather results, app depends on OpenWeather and Supabase, saved locations are shared globally

# Future Development 
Adding user accounts
Allow users to individually delete certain locations
Adding weather icons
Improving mobile design