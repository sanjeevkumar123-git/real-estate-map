Property Discovery App

Minimal real estate property discovery interface built with:
Next.js (App Router)
React (JavaScript)
Leaflet + OpenStreetMap

Features :
Interactive Map (Leaflet)
Property Filters
Map View / List View
Property Details Drawer
Enquiry Form (Mocked to Console)
Search Near Me (Geolocation)

Adding Properties
Edit: data/properties.json
Each property requires:
title, type, saleMode, usage, price, area, city, locality, lat, lng, images
Example:
{
  "id": 1,
  "title": "Modern Flat",
  "type": "Flat",
  "saleMode": "Fresh",
  "usage": "Residential",
  "price": 18500000,
  "area": 1200,
  "city": "Bangalore",
  "locality": "Indiranagar",
  "lat": 12.9716,
  "lng": 77.5946,
  "images": [
    "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg"
  ],
  "description": "Beautiful modern flat."
}

Enquiry Handling
Currently mocked → check terminal console.
