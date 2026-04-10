🎬 Movie Recommendation Web App
📌 Project Idea

This project is a Movie Recommendation Web Application that allows users to explore, discover, and save movies.
Instead of just searching, the application provides trending movies, personalized recommendations, and a watchlist feature, making it more interactive and user-focused.

🎯 Purpose

The purpose of this project is to:

Demonstrate JavaScript concepts using real-world data
Integrate a public API to fetch dynamic movie data
Build an interactive and responsive user interface
Apply searching, filtering, and sorting using array methods
Create a more recommendation-based experience rather than just search
🔗 API Used

TMDB (The Movie Database) API
https://www.themoviedb.org/

This API provides:

Trending movies
Popular movies
Movie search results
Movie details (ratings, overview, posters)
Recommendations based on user activity
🚀 Features
🔍 Search
Users can search movies by title
Implemented with debouncing to reduce unnecessary API calls
🎯 Recommendations
Displays personalized movie recommendations
Based on recently viewed movies
🔥 Trending Movies
Shows real-time trending movies using TMDB API
❤️ Watchlist
Users can add movies to a watchlist
Data is stored using localStorage for persistence
🎚️ Filtering
Movies can be filtered based on criteria (e.g., type or category)
Implemented using filter()
🔽 Sorting
Movies can be sorted by:
Title (A–Z)
Rating or popularity
Implemented using sort()
🎴 Display

Each movie card displays:

Movie poster
Movie title
Rating (in details view)
📱 Responsive Design
Fully responsive across:
Mobile
Tablet
Desktop
🧠 Concepts Used
JavaScript
Fetch API
Async/Await
DOM Manipulation
Event Handling
Array Higher-Order Functions
map() → rendering movie cards
filter() → filtering movies
sort() → sorting results
Performance Optimization
Debouncing (search input)
Browser Storage
localStorage (watchlist & recent movies)
🛠️ Technologies Used
HTML
CSS
JavaScript (ES6+)
TMDB API
