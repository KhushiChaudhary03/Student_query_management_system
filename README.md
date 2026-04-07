# 📱 CampusQuery

**CampusQuery** is a modern student community platform where users can **ask questions, share knowledge, and collaborate with peers** within their campus.

It provides a clean, intuitive interface for managing academic and campus-related queries with real-time updates and personalized user experience.

---

## ✨ Tagline

**Ask. Connect. Resolve.**

---

## 🚀 Key Features

### 🔐 Authentication & User System

* Secure **email & password authentication**
* 📧 Email verification support
* User profile with:

  * Name, college, department
  * Activity stats (questions, answers, saved)

---

### ❓ Query Management

* Create detailed queries with:

  * Title
  * Subject/category selection
  * Description
* View all queries in **community feed**
* Filter queries by subjects
* Search queries by keywords/tags

---

### 💬 Interaction System

* Answer questions
* View responses in real-time
* Community-driven knowledge sharing

---

### 🔔 Notification System

* Get notified when:

  * Someone answers your question
  * Activity happens on your posts
* Dedicated **Alerts screen**
* Smart empty state UI

---

### 📂 Personal Dashboard

* Track:

  * My Questions
  * My Answers
  * Saved Queries
* Clean profile overview with stats

---

### ⚙️ Settings & Personalization

* Toggle:

  * Push notifications
  * Compact mode
  * Hide solved questions
* Save user preferences

---

### 🎨 UI/UX Highlights

* Dark modern UI with gradients
* Clean card-based design
* Smooth navigation (tab-based)
* Thoughtful empty states
* Consistent design system

---

## 🛠️ Tech Stack

### 📱 Frontend

* React Native (Expo)
* Expo Router (File-based navigation)
* TypeScript

### 🎨 Styling

* NativeWind (Tailwind CSS for React Native)

### 🔥 Backend

* Firebase Authentication
* Firebase Firestore (Real-time database)

### 📦 Utilities

* AsyncStorage
* Custom state management

---

## 📂 Project Structure

```
CampusQuery/
│
├── app/
│   ├── (auth)/          # Login & Signup
│   ├── (tabs)/          # Bottom tab navigation
│   ├── query/           # Query screens
│   ├── _layout.tsx
│   └── index.tsx
│
├── components/          # Reusable UI
├── firebase/
│   ├── auth.ts
│   ├── config.ts
│   ├── questions.ts
│   ├── notifications.ts
│
├── store/
├── assets/
│
└── config files
```

---

## ⚙️ Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/KhushiChaudhary03/Student_query_management_system.git
cd Student_query_management_system
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add environment variables

Create `.env` file:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Run the app

```bash
npx expo start
```

---


## 🚀 Future Improvements

* 📷 Image upload in queries
* 👍 Upvote / like system
* 🧠 AI-based answer suggestions
* 🔍 Advanced search & filters
* 🌙 Dark/Light mode toggle

---

## 👩‍💻 Author

**Khushi**
GitHub: https://github.com/KhushiChaudhary03


