# ProfileHub

**ProfileHub** is a professional networking platform built with **Spring Boot and React**. It allows users to create professional profiles, share posts, upload media, interact with other users, and manage their professional information.

The project is designed as a full-stack application with a RESTful backend, modern React frontend, authentication, OAuth2 login, and cloud-based media storage.

---

## 🚀 Features

### 🔐 Authentication & Authorization

* User registration and login
* JWT-based authentication
* Google OAuth2 / OpenID Connect login
* Secure password handling
* Protected API endpoints
* Authentication state management on the frontend

### 👤 Profile Management

* Create and update professional profile
* Profile picture upload
* Bio management
* Skills management
* Education details
* Work experience
* Fetch authenticated user's profile using `/api/profile/me`

### 📝 Posts

* Create professional posts
* Add title and post content
* Upload media with posts
* Detect and handle different media types
* View posts in the feed
* Delete posts

### 💬 Comments

* Add comments to posts
* Retrieve comments for a post
* Delete comments

### 🤝 Social Networking

* Connection request system
* Like functionality
* User-to-user networking

> More social features are being added as the project evolves.

### ☁️ Cloud Media Storage

* Profile pictures and post media are uploaded to **Cloudinary**
* Media URLs are stored instead of storing large files directly in the database

---

## 🛠️ Tech Stack

### Frontend

* React.js
* JavaScript
* Axios
* React Router
* Lucide React
* HTML5
* CSS3

### Backend

* Java
* Spring Boot
* Spring Security
* Spring Data JPA
* Hibernate
* REST APIs
* OAuth2 / OpenID Connect
* JWT

### Database & Storage

* MySQL
* Cloudinary

### Development Tools

* IntelliJ IDEA
* VS Code
* Git
* GitHub
* Postman

---

## 🏗️ Project Architecture

```text
                    ┌──────────────────────┐
                    │      React UI        │
                    │      Frontend        │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │    Spring Boot      │
                    │      Backend         │
                    └──────────┬───────────┘
                               │
                 ┌─────────────┼─────────────┐
                 │             │             │
                 ▼             ▼             ▼
             MySQL        Cloudinary     Google OAuth
            Database     Media Storage    Authentication
```

---

## 📂 Project Structure

### Backend

```text
ProfileHubBackend
│
├── src
│   └── main
│       ├── java
│       │   └── in.strikes.ProfileHubBackend
│       │       │
│       │       ├── controller
│       │       ├── service
│       │       ├── repository
│       │       ├── entity
│       │       ├── dto
│       │       ├── security
│       │       ├── config
│       │       └── exception
│       │
│       └── resources
│           └── application.properties
│
└── pom.xml
```

### Frontend

```text
ProfileHubFrontend
│
├── src
│   ├── components
│   ├── pages
│   ├── context
│   ├── services
│   ├── api
│   └── App.jsx
│
├── public
└── package.json
```

---

## 🔑 Authentication Flow

ProfileHub supports both traditional authentication and Google OAuth2 authentication.

### Normal Login

```text
User
  │
  ▼
Login Page
  │
  ▼
Spring Boot API
  │
  ▼
Validate Credentials
  │
  ▼
Generate JWT
  │
  ▼
Frontend stores token
  │
  ▼
Authenticated Requests
```

### Google Login

```text
User
  │
  ▼
Google Login
  │
  ▼
Google OAuth2
  │
  ▼
Spring Boot OAuth2 Callback
  │
  ▼
Create / Find User
  │
  ▼
Generate JWT
  │
  ▼
Redirect to React
  │
  ▼
Authenticated Profile
```

---

## 🗄️ Database Design

The application uses **MySQL** as the primary relational database.

Main entities include:

```text
User
 │
 ├── Profile
 │    ├── Skills
 │    ├── Education
 │    └── Work Experience
 │
 ├── Posts
 │    └── Comments
 │
 └── Connections
```

### Main Entities

* `User`
* `Profile`
* `Education`
* `WorkExperience`
* `Post`
* `Comment`
* `ConnectionRequest`

JPA/Hibernate is used for object-relational mapping and entity relationships.

---

## 📡 Important API Endpoints

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### Profile

```text
GET  /api/profile/me
PUT  /api/profile/bio
PUT  /api/profile/skills
POST /api/profile/education
POST /api/profile/work-experience
POST /api/profile/profile-pic
```

### Posts

```text
POST   /post
GET    /post
DELETE /post/{id}
```

##
