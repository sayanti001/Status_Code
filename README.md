# StatusCode - Service Status Page Platform

StatusCode.fun is a comprehensive service status page application that enables organizations to effectively communicate service health and incidents to their users. Built with modern web technologies, it provides real-time service status monitoring and incident management capabilities in a clean, intuitive interface.

## StatusCode
![image](https://github.com/user-attachments/assets/ba6fda80-e177-4d46-9b70-d0a1ba8f5223)
![Screenshot 2025-04-14 030851](https://github.com/user-attachments/assets/2875b25e-6c57-40d6-8564-74b15eb978ae)
![Screenshot 2025-04-14 030927](https://github.com/user-attachments/assets/072713a6-7c70-474c-99f0-8997447a066b)
![Screenshot 2025-04-14 030927](https://github.com/user-attachments/assets/05962296-1ca7-4c5d-88ee-119360449f3a)

## StatusPage
![Screenshot 2025-04-14 032421](https://github.com/user-attachments/assets/b4c12414-eae3-4444-9e38-c4175e07490f)


## About

StatusCode.fun provides a powerful yet simple solution for transparent service status communication. Organizations can create custom status pages for their services, manage incidents, and keep users informed about service health in real-time. The platform where multiple organizations can maintain their own status pages.

## Features

### User & Organization Management
- **Auth0 Authentication**: Secure user authentication and authorization
- **Multi-tenant Architecture**: Support for multiple organizations with isolated data

### Service Management
- **CRUD Operations**: Create, read, update, and delete services
- **Status Configuration**: Set and update service statuses (Operational, Degraded, Partial Outage, Major Outage)

### Public Status Page
- **Real-time Updates**: Provides instant status changes
- **Status Timeline**: Chronological display of services and their status
- **Historical Data**: View past status of services

### Monitoring & Metrics
- **Uptime Tracking**: Monitor and display service uptime percentages
- **Performance Metrics**: Track and visualize service performance over time

## Prerequisites

Before setting up the project, ensure you have the following:

- Node.js (v16+)
- Yarn package manager
- MongoDB (local or Atlas)
- Auth0 account with configured application

## Setup

### 1. Clone the repository

```bash
git clone [https://github.com/yourusername/statuscode-fun.git](https://github.com/Sanika-m-k/StatusCode)
cd statuscode
```


### 2. Install Dependencies

Install server dependencies:
```bash
cd backend
yarn install
```

Install client dependencies:
```bash
cd frontend
yarn install
```

### 3. Start the Application

Start the backend server:
```bash
cd backend
node server.js
```

Start the frontend development server:
```bash
cd frontend
yarn start
```

## Available At

- **Main Application**: [https://statuscode.fun](https://statuscode.fun)
- **Public Status Pages**: [https://status.statuscode.fun](https://status.statuscode.fun)


## Tech Stack

- **Frontend**: React, ShadcnUI, TailwindCSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: Auth0

