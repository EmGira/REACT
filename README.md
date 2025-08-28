# 🩺 Medical Management App

**Medical Management App** is a **React** application wich allows interactions between **doctors** and **patients**, focusing on:

- Medication management  
- Appointments  
- Treatment plans  
- Notifications  

The app uses **Firebase** for:  
- User authentication  
- Data management with **Firestore**  

A **general service layer** was also implemented to simplify database calls and provide global data availability across the application.  

---

## 🚀 How It Works

### 🔑 Login & Registration
- New users can register as either a **doctor** or a **patient**.  
- After logging in, the user is redirected to a **different home page** depending on their role.  

---

### 👨‍⚕️ Doctor Home
Doctors can:  
- 📋 View and manage their patients  
- 💊 Add and edit medications  
- 📅 Create appointments using an **interactive calendar**  
- 📝 Assign treatment plans to patients  
- 🔄 Manage active plans (update, modify, suspend, etc.)  
- ✏️ Edit patient details if needed  

---

### 🧑‍🤝‍🧑 Patient Home
Patients can:  
- 📅 Access their appointment calendar  
- 💊 Mark whether they have taken or missed a medication  
- 📝 View treatment plans assigned by their doctor  

---

### 🔔 Notification System
- Both doctors and patients have a **notification icon** in the header (top-right).  
- Notifications highlight important events such as:  
  - New appointments  
  - Treatment changes  
  - Updates to active plans  

---

## 🛠️ Project Structure
The project is organized into:  
- **Reusable React components**  
- **Main pages** (login, doctor home, patient home, etc.)  
- **Service layer** for Firebase and backend communication  

---

## 📌 Technologies Used
- React
- Firebase Authentication
- Firestore (Database)
- React Router (for navigation)

## ▶️ Getting Started

Run the project locally:

```bash
# Clone the repository
git clone https://github.com/EmGira/REACT.git

# Navigate into the project folder
cd REACT

# Install dependencies
npm install

# Start the development server
npm start
