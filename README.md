# ENTNT Dental Hub - Dental Center Management System

ENTNT Dental Hub is a modern, comprehensive web application designed to streamline the management of a dental clinic. It provides a seamless interface for both administrators and patients, simplifying tasks like patient record management, appointment scheduling, and billing. The platform is built with a focus on usability, responsiveness, and a clean, professional aesthetic.

## ✨ Key Features

### General
- **Responsive Design:** A fully responsive interface that works flawlessly on desktops, tablets, and mobile devices.
- **Modern UI/UX:** Built with aesthetically pleasing and functional components from ShadCN UI and styled with Tailwind CSS.
- **Role-Based Access Control:** Separate dashboards and functionalities for `Admin` and `Patient` roles.

### Admin Dashboard
- **Comprehensive Dashboard:** An overview of key metrics, including total revenue, patient count, upcoming appointments, and treatment status summaries.
- **Patient Management:** Admins can add, view, edit, and delete patient records.
- **Advanced Appointment Scheduling:**
    - Create new appointments for any patient.
    - View all appointments in a filterable table.
    - A visual calendar to see scheduled appointments by date or date range.
- **Detailed Incident Management:**
    - After an appointment is marked as "Completed," admins can add post-treatment details.
    - **Fields:** Cost, treatment description, status, and next appointment date.
    - **File Uploads:** Attach multiple files (e.g., invoices, X-rays, treatment plans) to an appointment record.

### Patient Dashboard
- **Personalized Dashboard:** Patients can view their upcoming appointments and review their complete appointment history.
- **Appointment Details:** Access detailed information from past appointments, including treatment descriptions and costs.
- **File Access:** View and download any files attached to their appointment records by the admin.

---

## 🚀 Getting Started

Follow these instructions to set up and run the project locally for development and testing.

### Prerequisites
- [Node.js](https://nodejs.org/en) (v18 or later recommended)
- [npm](https://www.npmjs.com/) or a compatible package manager

### Installation & Setup

1.  **Clone the repository** (if applicable) or ensure you have all the project files.

2.  **Install dependencies:**
    Navigate to the project's root directory and run:
    ```bash
    npm install
    ```

3.  **Run the development server:**
    Once the dependencies are installed, start the Next.js development server:
    ```bash
    npm run dev
    ```

4.  **Access the application:**
    Open your browser and go to [http://localhost:9002](http://localhost:9002).

### Default Login Credentials

You can use these default accounts to test the application's different roles:

-   **Admin User:**
    -   **Email:** `admin@entnt.in`
    -   **Password:** `admin123`

-   **Patient User:**
    -   **Email:** `john@entnt.in`
    -   **Password:** `patient123`

---

## 🛠️ Tech Stack & Architecture

This project is built on a modern, robust, and scalable technology stack.

-   **Framework:** [Next.js](https://nextjs.org/) (with App Router)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **UI Library:** [React](https://react.dev/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Component Library:** [ShadCN UI](https://ui.shadcn.com/)
-   **State Management:** React Context API with `useReducer` and `Immer`
-   **AI Integration:** [Genkit](https://firebase.google.com/docs/genkit) (for potential future AI features)
-   **Form Handling:** [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for schema validation.

### Architectural Decisions

-   **State Management:** `React Context` combined with the `useReducer` hook provides a centralized and predictable state management solution suitable for this application's scale. `Immer` is used within the reducer to simplify immutable state updates, making the code cleaner and less error-prone.
-   **Data Persistence:** For this prototype, `localStorage` is used to persist application data (users, patients, appointments). This allows for a quick setup without requiring a database, but it is **not suitable for a production environment**. In a real-world scenario, this would be replaced with a proper database and a secure backend API.
-   **UI Components:** `ShadCN UI` was chosen for its excellent, accessible, and highly customizable components that can be copied directly into the project, giving full control over their implementation.
-   **Styling:** `Tailwind CSS` is used for its utility-first approach, enabling rapid development of custom, responsive designs without writing custom CSS.
-   **Routing:** The Next.js App Router is used for its benefits in performance, nested layouts, and server-side rendering capabilities.

### Project Structure

The `src` directory is organized as follows:

-   `src/app/`: Contains all the routes and pages of the application, following the Next.js App Router convention.
-   `src/components/`: Shared React components used across the application (e.g., `Logo`, UI components from ShadCN).
-   `src/context/`: Holds the `AppContext.tsx`, which manages the global state of the application.
-   `src/hooks/`: Custom React hooks (e.g., `useApp`, `useToast`).
-   `src/lib/`: Core logic, type definitions, schemas, and data handling functions.
-   `src/ai/`: Reserved for AI-related functionality using Genkit.

---

## Known Issues & Future Improvements

-   The current data persistence method (`localStorage`) is for demonstration purposes only and is not secure or scalable for production use. The next step would be to integrate a backend service and database (like Firebase Firestore).
-   The AI-powered "suggestion" feature in the appointment form is currently a placeholder and can be expanded with a real Genkit flow to provide intelligent treatment recommendations.
