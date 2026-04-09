# Front-end Oh My Skin (React)

## Table of Contents

- [About The Project](#about-the-project)
- [Built With](#built-with)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Features](#features)
- [Architecture](#architecture)
- [Roadmap](#roadmap)
- [Contact](#contact)

---

## About The Project

Oh My Skin is a web e-commerce application inspired by the Oh My Cream website and Typology, developed as part of a group project.

The main goal is to provide a personalized experience by allowing users to find products adapted to their skin type through a recommendation system.

The application enables smooth navigation between categories, brands, and products, while focusing on a user-centered e-commerce experience.

### Main features

- Navigation between categories, brands, and products
- Detailed product pages
- Personalized recommendation form
- Generation of skincare routine
- Email sending with PDF generation
- User authentication (signup / login)
- Favorites management
- Payment system
- Search bar

---

## Built With

- React
- React Router
- Axios
- Stripe (payment)
- Resend (email)
- CSS

---

## Getting Started

### Prerequisites

- Node.js
- yarn

### Installation

```bash
git clone https://github.com/ohmyskinroutine/OhMySkin.git
cd oh-my-skin-frontend
yarn install
```

## Run the project

```bash
yarn dev
```

## Usage

Users can:

- Browse categories and brands
- View detailed product pages (description, ingredients, reviews)
- Add products reviews
- Like or dislike reviews
- Complete a form to get a personalized skincare routine
- Receive their routine by email as a PDF
- Sign up and log in
- Add products to favorites
- Check their routine history
- Complete a payment

## Features

### Personalized Recommendation

- User form based on targeted questions
- Dynamic generation of a tailored routine
- Display of results on a dedicated page

### Email & PDF

- Routine sent via email
- Automatic PDF generation with the routine products

### Authentication

- Signup / login
- Access to protected features (favorites, history, payment)

### E-commerce Experience

- Smooth navigation
- Product search
- Detailed product pages
- Favorites system
- Stripe payment integration

---

## Architecture

The frontend is built with reusable React components.

### Structure

- Pages (Home, Categories, Products, Profile, Routine results…)
- Components (RoutineBlock, Form, Header…)
- Services (API calls with Axios)
- Utils (product mapping, email content generation…)

The frontend communicates with a Node.js backend through HTTP requests.

---

## Roadmap

- Improve recommendation relevance
- Optimize performance
- Enhance UX/UI
- Add new user features

---

## Disclaimer

This project is a non-commercial educational replica of the Oh My Cream and Typology website.

## Contact

GitHub:
Eva Caruana https://github.com/kmarguiraut-sys
Keanu Marguiraut https://github.com/Eva-caruana
Margaux Mathar https://github.com/Margaux-972
Lassana Baradji https://github.com/lassana-hub
