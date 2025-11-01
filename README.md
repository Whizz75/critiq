# Critiq 🎬 – Modern Movie Review Platform

**Critiq** is a modern, interactive movie review platform that lets users explore, rate, and review movies. Powered by the OMDb API and Firebase, Critiq offers a seamless experience for movie lovers to discover films, share opinions, and track their reviews.

---

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Installation](#installation)  
- [Usage](#usage)  
- [Project Structure](#project-structure)  
- [Screenshots](#screenshots)  
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
