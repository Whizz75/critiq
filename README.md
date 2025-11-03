# Critiq 🎬 – Modern Movie Review Platform

**Critiq** is a modern, interactive movie review platform that lets users explore, rate, and review movies. Powered by the OMDb API and Firebase, Critiq offers a seamless experience for movie lovers to discover films, share opinions, and track their reviews.

---

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Installation](#installation)  
- [Usage](#usage) 
- [Future Improvements](#future-improvements)  
- [Author](#author)  

---

## Features

- **Home Page:**  
  Highlights popular movies (currently hardcoded for demo) with posters, titles, years, and a “Details” button.  

- **Movie Details Page:**  
  - Fetches full movie details via OMDb API  
  - Displays poster, title, plot, director, actors, runtime, awards, ratings, language, etc.  
  - Users can **add reviews with star ratings**  
  - Users can **edit or delete their own reviews**  
  - Reviews are saved in **Firebase Firestore**  

- **Profile Page:**  
  - Displays user info (photo, name, email)  
  - Shows all reviews submitted by the user  
  - Calculates and displays **average rating** across all reviews  
  - Users can **edit or delete reviews directly from their profile**  

- **Movies Page (Instant Search):**  
  - Users can search any movie title  
  - **Instant search** (debounced) for fast feedback  
  - Results show movie poster, title, year, and “Details” button  

- **Authentication:**  
  - Google sign-in powered by Firebase Authentication  
  - Only logged-in users can post, edit, or delete reviews  

---

## Tech Stack

- **Frontend:** React, React Router, Shadcn UI, Tailwind CSS  
- **Backend & Database:** Firebase (Authentication + Firestore)  
- **API:** [OMDb API](http://www.omdbapi.com/) for movie data  
- **Icons & Loader:** lucide-react  

---
## Installation
1. **Clone the repository**:

```bash
git clone https://github.com/Whizz75/critiq.git
cd critiq
Install dependencies:

npm install
Setup Firebase:

Create a Firebase project

Enable Firestore & Authentication (Google sign-in)

Create a .env file at the root:

VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_OMDB_API_KEY=your_omdb_api_key

Start development server:

npm run dev
```

## Usage
Browse movies: Home page shows highlighted movies

Search movies: Navigate to /movies and use the instant search bar

Movie details: Click “Details” to see full information and add reviews

Profile: Click on your user avatar to see your profile, previous reviews, and average rating

Review management: Edit or delete reviews directly from movie details or profile page

## Future Improvements
Add user avatars for reviews

Implement pagination or infinite scroll for reviews

Add genre filters in search

Implement average rating visualizations per movie

Enable social sharing for reviews

## Author
Harry Ntsekhe – Faculty of ICT, Limkokwing University of Creative Technology
