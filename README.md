# 🏠 **My Apartment**

*A Secure, Easy-to-Use Rental Property Listing Platform*

---

## 📌 1. Introduction

**My Apartment** is a web-based rental listing platform where verified users can post, edit, and manage properties such as houses, rooms, and flats.
It integrates **secure authentication**, **interactive maps**, **image cloud storage**, **real-time chat**, and **advanced property search** into a single streamlined solution for both property owners and tenants.

---

## 🚀 2. Problem Statement

Online rental portals often have:

* Complicated listing workflows
* Lack of property verification
* No direct owner–tenant communication
* Weak search filters

These lead to inefficiency, scams, and user frustration.

---

## 💡 3. Solution Provided

**My Apartment** addresses these challenges by:

* Providing **OTP-based account verification**
* Offering an **easy and guided listing process**
* Using **Mapbox** for exact location mapping
* Enabling **real-time chat** between owners and tenants
* Allowing **reviews and ratings** for credibility
* Supporting **search by title, city, and location**

---

## ✨ 4. Features

### 4.1 Property Management

* Create listings with **title, price, city, location, and description**
* Upload multiple photos to **Cloudinary**
* Edit/update property details anytime

### 4.2 Security & Verification

* OTP verification using **NodeMailer**
* **Passport.js** with cookies for authentication

### 4.3 Search & Discovery

* Search properties via **MongoDB Atlas Search**
* Filter by **title, city, and location**
* Map view with **Mapbox** integration

### 4.4 User Interaction

* Ratings and review system for each property
* Real-time **WebSocket** chat feature

### 4.5 Error Handling & Validation

* Centralized **Express.js** error middleware
* Client-side form validation
* Schema validation using **Joi**

---

## 🖥 5. Tech Stack

| Category         | Technologies                              |
| ---------------- | ----------------------------------------- |
| **Frontend**     | HTML, CSS, Bootstrap, JavaScript          |
| **Backend**      | Node.js, Express.js                       |
| **Database**     | MongoDB Atlas                             |
| **Auth**         | Passport.js (Cookies)                     |
| **Integrations** | NodeMailer, Mapbox, Cloudinary, WebSocket |
| **Hosting**      | Render                                    |

---

## 🏗 6. System Architecture

**Workflow:**

1. Client sends requests to the backend
2. Express.js handles requests & communicates with MongoDB
3. Third-party services process specific tasks (maps, image hosting, email)

📌 *\[Architecture Diagram Screenshot Placeholder]*

---

## 📂 7. Database Design

The database for **My Apartment** is built using **MongoDB Atlas** with **Mongoose** as the ODM.
It follows a **document-oriented structure** with relations handled via `ObjectId` references.

---

### 7.1 Entity Relationship Diagram (ERD)

```
[User]───<owns>───[Listing]───<has>───[Review]
   │                      │
   │                      └──<related to>──[Chat]
   │
   └──<participates in>──[Chat]
   
[Otp]───<validates>───[User]
```

📌 *\[Insert Database ERD Image Here]*



### 7.2 Collections Overview

#### **Users Collection** (`User`)

Stores registered user accounts.

| Field      | Type   | Description                             |
| ---------- | ------ | --------------------------------------- |
| `username` | String | Auto-managed by passport-local-mongoose |
| `email`    | String | Unique email for account verification   |
| `hash`     | String | Password hash (auto-managed)            |

---

#### **Listings Collection** (`Listing`)

Stores property details posted by owners.

| Field         | Type       | Description                                |
| ------------- | ---------- | ------------------------------------------ |
| `title`       | String     | Property title                             |
| `description` | String     | Detailed description                       |
| `price`       | Number     | Rental price                               |
| `location`    | String     | Area or street name                        |
| `city`        | String     | City of the property                       |
| `image`       | Object     | `{url, filename}` for Cloudinary storage   |
| `reviews`     | Array\[ID] | References to `Review` documents           |
| `owner`       | ObjectId   | Reference to `User`                        |
| `geometry`    | GeoJSON    | `{type: "Point", coordinates: [lng, lat]}` |

---

#### **Reviews Collection** (`Review`)

Stores ratings and comments for listings.

| Field       | Type     | Description         |
| ----------- | -------- | ------------------- |
| `Comment`   | String   | Review text         |
| `rating`    | Number   | Rating (1–5)        |
| `createdAt` | Date     | Auto-set timestamp  |
| `author`    | ObjectId | Reference to `User` |

---

#### **Chats Collection** (`Chat`)

Stores messages between two users.

| Field       | Type     | Description                    |
| ----------- | -------- | ------------------------------ |
| `sender`    | ObjectId | Reference to sender (`User`)   |
| `receiver`  | ObjectId | Reference to receiver (`User`) |
| `listing`   | ObjectId | Related `Listing` (optional)   |
| `content`   | String   | Message text                   |
| `timestamp` | Date     | Auto-set timestamp             |

---

#### **OTP Collection** (`Otp`)

Stores temporary one-time passwords for email verification.

| Field       | Type   | Description               |
| ----------- | ------ | ------------------------- |
| `email`     | String | Email for verification    |
| `otp`       | String | One-time password         |
| `expiresAt` | Date   | Expiration (auto-deleted) |

---

## ⚙ 8. Installation & Setup

```bash
# Clone repository
git clone https://github.com/yourusername/my-apartment.git

# Enter project directory
cd my-apartment

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 🔑 9. Environment Variables

Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
SESSION_SECRET=your_session_secret
EMAIL_USER=your_email
EMAIL_PASS=your_password
MAPBOX_TOKEN=your_mapbox_token
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🖱 10. Usage Guide

1. **Register/Login** → Verify via OTP email
2. **List a Property** → Enter details + upload images
3. **Search Listings** → Filter by title, city, location
4. **View Property Details** → See map, images, reviews
5. **Chat with Owner** → Real-time messaging

📌 *\[Homepage Screenshot Placeholder]*
📌 *\[Property Listing Screenshot Placeholder]*
📌 *\[Chat Interface Screenshot Placeholder]*

---

## 📸 11. Screenshots
view in documents

## 🚧 12. Future Enhancements

* Price range filter
* Admin dashboard for managing users/listings
* Mobile app version
* Push notifications for chat & listing updates

---

## 📬 13. Contact Information

**Author:** Sonu Kumar
## 14. Live Demo

🏠 **[My Apartment](https://myapartment.onrender.com/listings)** – Full-stack rental property listing platform built with Node.js, Express, MongoDB, and Bootstrap.  

🎵 **[My Music](https://my-music-sss.netlify.app/)** – Responsive music streaming app built with React & React Router.  

💼 **[My Portfolio](https://sonukumarwebsite.netlify.app/)** – Personal portfolio website showcasing my skills and projects, built with React.


---
