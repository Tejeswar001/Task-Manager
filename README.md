# Smart Todo Application

This is a simple **Smart Todo Application** built using **Next.js**, **MongoDB**, and **JWT-based authentication**. It allows users to create, update, delete, and mark tasks as completed, with a backend powered by MongoDB and authentication based on JWT tokens.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Features](#features)
- [Setup](#setup)
  - [Prerequisites](#prerequisites)
  - [Install Dependencies](#install-dependencies)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
  - [POST /api/tasks](#post-apitasks)
  - [GET /api/tasks](#get-apitasks)
  - [PATCH /api/tasks](#patch-apitasks)
  - [DELETE /api/tasks](#delete-apitasks)
- [Frontend Logic](#frontend-logic)
  - [State Management](#state-management)
  - [Task Completion Toggle](#task-completion-toggle)
- [License](#license)

---

## Technologies Used

- **Next.js**: A React framework for building server-rendered React applications.
- **MongoDB**: A NoSQL database for storing user and task data.
- **JWT (JSON Web Tokens)**: For handling user authentication securely.
- **React**: For building the user interface components.
- **Fetch API**: For making HTTP requests to the backend.
- **MongoDB Client**: For database interactions.

---

## Features

- **User Authentication**: JWT-based authentication system for secure access.
- **Task Management**: Users can create, update, delete, and toggle the completion status of tasks.
- **Database Integration**: MongoDB is used to store user and task data.
- **Real-Time Updates**: The UI dynamically updates when tasks are added, updated, or deleted.
- **State Management**: Efficient management of task data using React state.

---

## Setup

### Prerequisites

- **Node.js** and **npm** (or **yarn**) installed.
- **MongoDB** running locally or using a cloud service like **MongoDB Atlas**.
- A **JWT_SECRET** for token generation (this should be kept secure).

---

### Install Dependencies

Clone the repository:

```bash
git clone https://github.com/Tejeswar001/Task-Manager
cd <repository-directory>
```

Install the required dependencies:

```bash
npm install
```

---

### Environment Variables

Create a `.env.local` file at the root of the project and add the following environment variables:

```env
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-secret-key-for-jwt>
```

Make sure to replace `<your-mongodb-connection-string>` with your actual MongoDB connection string and `<your-secret-key-for-jwt>` with a secure string used for JWT signing.

---

### Database Setup

1. **Local MongoDB**: If you're using a local MongoDB instance, make sure it is running on the default port (`27017`).
2. **MongoDB Atlas**: For cloud-based MongoDB, create a free account on MongoDB Atlas and generate a connection string.

---

### Running the Application

To start the application locally:

```bash
npm run dev
```

This will start the Next.js server at `http://localhost:3000`.

---

## API Endpoints

### POST /api/tasks

- **Description**: Creates a new task.
- **Request Body**:
  ```json
  {
    "title": "Task Title",
    "deadline": "2025-04-10",
    "priority": "High"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "taskId": "task-id"
  }
  ```

### GET /api/tasks

- **Description**: Retrieves all tasks for the authenticated user.
- **Response**:
  ```json
  {
    "tasks": [
      {
        "id": "task-id",
        "title": "Task Title",
        "completed": false,
        "deadline": "2025-04-10",
        "priority": "High",
        "createdAt": "2025-04-05T12:00:00Z"
      }
    ]
  }
  ```

### PATCH /api/tasks

- **Description**: Updates an existing task. Can be used to update the task’s title, deadline, priority, or completion status.
- **Request Body**:
  ```json
  {
    "id": "task-id",
    "title": "Updated Title",
    "deadline": "2025-04-12",
    "priority": "Medium",
    "completed": true
  }
  ```
- **Response**:
  ```json
  {
    "success": true
  }
  ```

### DELETE /api/tasks

- **Description**: Deletes a task by its ID.
- **Request Body**:
  ```json
  {
    "id": "task-id"
  }
  ```
- **Response**:
  ```json
  {
    "success": true
  }
  ```

---

## Frontend Logic

### State Management

The state of the application is managed using React’s `useState` hook. Tasks are stored in an array of objects, each representing a task. The `setTasks` function is used to update the state whenever tasks are added, updated, or deleted.

```tsx
const [tasks, setTasks] = useState<Task[]>([]); // State for tasks
```

### Task Completion Toggle

The completion status of a task is toggled when the user clicks on a task. This updates the task both in the frontend state and sends a `PATCH` request to the backend to persist the change.

```tsx
const toggleTaskCompletion = async (id: string) => {
  const taskToUpdate = tasks.find((task) => task.id === id);
  if (!taskToUpdate) return;

  const updatedTask = { ...taskToUpdate, completed: !taskToUpdate.completed };

  try {
    const res = await fetch("/api/tasks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    });

    const data = await res.json();

    if (data.success) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? updatedTask : task
        )
      );
    } else {
      console.error("Update failed", data.error);
    }
  } catch (err) {
    console.error("Error updating task:", err);
  }
};
```

---

### Notes

- Ensure that you have a MongoDB instance running for the database connection to work.
- JWT tokens are used to manage authentication; make sure that the token is sent with each request that requires user authentication.
