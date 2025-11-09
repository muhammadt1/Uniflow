# **UNIFlow**
*REC 2025 – Programming Challenge Submission*

**Team Members:**
* Muhammad Tariq
* Hashir Owais
* Aaron Borja
* Simran Gahra

**GitHub Repository:** [github.com/HashirOwais/Uniflow](https://github.com/HashirOwais/Uniflow)

---

## 1. Introduction

In today's fast-paced academic environment, university students juggle multiple courses, deadlines, and personal responsibilities, often finding it difficult to stay organized.

To address this challenge, our team developed **UNIFlow**, a productivity tool designed to help students efficiently manage their academic schedules and workload. By integrating an intuitive calendar, task manager, and smart reminders, UNIFlow streamlines time management and promotes a balanced, stress-free approach to student life.

---

## 2. Methodology & Solution

UNIFlow is a web application designed to help students efficiently manage their tasks, deadlines, and schedules through a clean, intuitive, and responsive interface.

### Tech Stack
* **Frontend:** React with Shadcn
* **Backend:** Node.js with Express, Prisma ORM
* **Database:** SQLite

### Our Solution
We followed a clear development methodology focused on modularity and agile practices.

* **Component-Based Architecture**
    * Built using React and Shadcn for a fast, modular design.
    * Enables high reusability and easier maintenance of UI components.
* **Incremental Development**
    * Developed one component at a time and refined iteratively.
    * Followed iterative development focused workflow for rapid feedback and MVP completion.
* **Implemented MVC (Model-View-Controller)**
    * **Model:** Prisma ORM managing the SQLite database and all data logic.
    * **View:** The React + Shadcn frontend that handles user interaction and display.
    * **Controller:** Node.js/Express API that routes requests between the frontend (View) and the database (Model).

---

## 3. Prototypes

Initial designs were created using Lofi and Hofi prototypes to map out the user flow, including the main dashboard, task lists, and calendar view.

![Hofi Prototype - Dashboard and Calendar](https://i.imgur.com/gYfIuRk.png)

---

## 4. Features

* **Task Management System:** Create, edit, and organize tasks with ease.
* **Intuitive Calendar Integration:** View deadlines, events, and schedules in one centralized view.
* **Priority Labels and Dark Mode:** Customize the user experience for accessibility and convenience.
* **Categorization:** Group tasks by subject or type for better organization.

---

## 5. Issues Encountered

* **UI Component Integration:** Faced challenges ensuring consistent styling and responsiveness across reusable components.
* **Time Constraints:** Limited development time made it difficult to implement all planned features within the project timeline.
* **Compatibility Issues:** Experienced Node.js version mismatches and environment setup problems across different machines.
* **Database Integration:** Had initial difficulties connecting and syncing Supabase with the backend before switching to SQLite for the MVP.

---

## 6. Future Implementation

* **Authentication**
* **Implementing Supabase**
* **Reminders and Push Notifications**

---

## 7. Demo

See the product demo video here: \[*Link to Demo*]

---

## 8. Installation & Setup

### Prerequisites
Ensure the following are installed:
* Node.js (v18 or later)
* npm or yarn

### Steps
1.  Clone the repository:
    ```bash
    git clone [https://github.com/HashirOwais/Uniflow.git](https://github.com/HashirOwais/Uniflow.git)
    cd Uniflow
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure the `.env` file. (Prisma will automatically create the SQLite file based on the schema).
    ```env
    # This URL points to the SQLite file that will be created
    DATABASE_URL="file:./dev.db"
    ```
4.  Run database migrations:
    ```bash
    npx prisma migrate dev
    ```
5.  Start the server:
    ```bash
    npm run dev
    ```
6.  Access the web app locally at `http://localhost:3000/`.

---

## 9. Credits
**Developed by Team UNIFlow** for the **REC 2025 Programming Challenge.**
All team members (Muhammad Tariq, Hashir Owais, Aaron Borja, Simran Gahra) contributed to ideation, coding, design, and testing.