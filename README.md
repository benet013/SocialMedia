# SocialMedia (BookFace)

A full-stack social media application featuring user authentication, profiles, posts, likes, following, and real-time style feeds. The project is split into a Django REST backend and a React (Vite) frontend.

---

## Features

- JWT-based authentication (login & registration)
- Protected routes with automatic token refresh
- User profiles with bio and profile image upload/remove
- Follow / unfollow users
- Create, view, and like posts
- Personal feed and global dashboard feed
- Infinite scrolling for dashboard posts
- User search
- Responsive UI with modal-based interactions

---

## Tech Stack

**Backend:** Django, Django REST Framework, Simple JWT  
**Frontend:** React 19, Vite, React Router, Axios  
**Database:** SQLite / PostgreSQL (configurable)  
**Auth:** JWT (access & refresh tokens)

---

## Repository Structure

.
├── backend
│   ├── manage.py
│   ├── db.sqlite3
│   ├── profile_image
│   └── root
│       ├── api
│       │   ├── migrations
│       │   ├── __init__.py
│       │   ├── admin.py
│       │   ├── apps.py
│       │   ├── models.py
│       │   ├── pagination.py
│       │   ├── serializers.py
│       │   ├── tests.py
│       │   ├── urls.py
│       │   └── views.py
│       ├── user
│       │   ├── migrations
│       │   ├── __init__.py
│       │   ├── admin.py
│       │   ├── apps.py
│       │   ├── models.py
│       │   ├── serializers.py
│       │   ├── tests.py
│       │   ├── urls.py
│       │   └── views.py
│       └── root
│           ├── __init__.py
│           ├── asgi.py
│           ├── settings.py
│           ├── urls.py
│           └── wsgi.py
│
├── frontend
│   └── app
│       ├── public
│       ├── src
│       │   ├── assets
│       │   ├── components
│       │   │   ├── authForm.jsx
│       │   │   ├── card.jsx
│       │   │   ├── createPost.jsx
│       │   │   ├── editForm.jsx
│       │   │   ├── navbar.jsx
│       │   │   ├── protectedRoute.jsx
│       │   │   ├── serachBar.jsx
│       │   │   └── userProfile.jsx
│       │   ├── pages
│       │   │   ├── appLayout.jsx
│       │   │   ├── dashboard.jsx
│       │   │   ├── home.jsx
│       │   │   ├── login.jsx
│       │   │   └── register.jsx
│       │   ├── api.js
│       │   ├── App.css
│       │   ├── App.jsx
│       │   ├── constant.js
│       │   └── main.jsx
│       ├── .env
│       ├── .gitignore
│       ├── eslint.config.js
│       ├── index.html
│       ├── package.json
│       ├── package-lock.json
│       └── vite.config.js
│
└── README.md


---

## Backend Setup (Django)

### Prerequisites
- Python 3.10+
- pip
- virtualenv (recommended)

### Installation

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Environment Variables

This project uses environment variables for both the **Django backend** and the **React (Vite) frontend**.  
Each part has its own `.env` file and configuration.

---

### Backend Environment Variables

**File location:** `backend/.env`

SECRET_KEY=your-django-secret-key  
DEBUG=True  
ALLOWED_HOSTS=127.0.0.1,localhost  
DATABASE_URL=sqlite:///db.sqlite3  

Notes:
- `SECRET_KEY` is required by Django and must be kept secret
- Set `DEBUG=False` in production
- SQLite is used for development by default
- Database configuration can be changed to PostgreSQL in production
- JWT authentication is handled using Simple JWT and configured in Django settings

---

### Frontend Environment Variables

**File location:** `frontend/app/.env`

VITE_API_DEVELOPMENT_URL=http://127.0.0.1:8000  

Notes:
- This URL must point to the running Django backend
- Vite requires all environment variables to be prefixed with `VITE_`
- This value is used as the Axios `baseURL` in `src/api.js`

---

### Token Storage (Frontend)

Authentication tokens are stored in `localStorage` using the following keys:

access_token  
refresh_token  

These constants are defined in `src/constant.js` and are automatically attached to API requests using an Axios interceptor.

---

## Key API Endpoints (Backend)

The backend exposes a RESTful API built with **Django REST Framework**.  
Authentication is handled using **JWT (Simple JWT)**, and most endpoints require a valid access token.

---

### Authentication

POST /api/token/  
- Login endpoint  
- Accepts username and password  
- Returns access and refresh tokens  

POST /api/token/refresh/  
- Refreshes an expired access token  
- Requires a valid refresh token  

POST /user/register/  
- Registers a new user  
- Accepts username, email, and password  

---

### User & Profile

GET /user/profile/self/  
- Fetches the currently authenticated user’s profile  

PATCH /user/profile/self/edit/  
- Updates the authenticated user’s profile  
- Supports multipart form data for profile image upload  
- Fields: username, email, bio, image, remove_image  

GET /user/profile/<id>/  
- Fetches another user’s public profile  

PATCH /user/profile/<id>/follow/  
- Follows or unfollows the specified user  
- Toggles follow state  

GET /user/profile/?search=<query>  
- Searches users by username  

---

### Posts

GET /api/posts/?user=self  
- Fetches posts created by the authenticated user  

GET /api/posts/?user=<id>  
- Fetches posts created by a specific user  

GET /api/posts/?user=dashboard  
- Fetches posts for the global dashboard feed  
- Paginated response  

POST /api/posts/  
- Creates a new post  
- Requires authentication  

PATCH /api/posts/<id>/like/  
- Likes or unlikes a post  
- Toggles like state  

---

### Notes

- All protected endpoints require the `Authorization: Bearer <access_token>` header
- List endpoints use DRF pagination (`results`, `next`, `previous`)
- Like and follow endpoints are toggle-based
- Profile image upload uses `multipart/form-data`

## Future Improvements

The following enhancements can be added to improve scalability, user experience, and feature completeness:

- **Comments System**
  - Allow users to comment on posts
  - Support nested or threaded comments

- **Notifications**
  - Notify users when they receive likes, follows, or comments
  - Real-time or near real-time updates

- **Real-Time Features**
  - Real-time chat between users
  - Live notifications using WebSockets (Django Channels)

- **Post Enhancements**
  - Edit and delete posts
  - Media uploads (images/videos) in posts

- **UI / UX Improvements**
  - Better mobile responsiveness
  - Toast notifications for actions and errors
  - Skeleton loaders for feeds and profiles

- **Performance & Scalability**
  - Switch to PostgreSQL in production
  - Add Redis for caching and rate limiting
  - Optimize queries and indexes

- **Security**
  - Refresh token rotation
  - Better validation and error handling
  - Improved permission checks

- **Testing**
  - Unit tests for serializers and views
  - Integration tests for API endpoints
  - Frontend component and route testing

- **Deployment**
  - Docker and Docker Compose setup
  - CI/CD pipeline
  - Environment-based settings (dev/staging/prod)

These improvements would move the project closer to a production-grade social media platform.

## Conclusion

This project was built to practice and demonstrate real-world full-stack development using Django REST Framework and React. It covers core concepts like authentication, protected routes, relational data modeling, and frontend–backend integration.

While it’s not production-ready yet, the foundation is solid and extensible. With a few improvements and scaling considerations, it can easily grow into a more complete social media platform. Overall, it’s a strong learning project and a good representation of practical backend-focused full-stack skills.
