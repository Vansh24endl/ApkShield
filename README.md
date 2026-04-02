# APK Shield Workspace

This repository contains both the frontend (Next.js) and backend (Node.js/Express) of the project.

## Project Structure
- **/frontend**: contains all Next.js code, React components, and frontend dependencies.
- **/backend**: contains the Express server, MongoDB models, and all backend logic.

## Getting Started

### 1. Install Dependencies
To install dependencies for the root workspace, the frontend, and the backend all at once, run:
```bash
npm run install:all
```

### 2. Run Both Frontend and Backend simultaneously
From the root folder (`apksheld/`), simply run:
```bash
npm run dev
```
This will start both your Next.js application (localhost:3000) and your Express server (localhost:5000) using `concurrently`.

Alternatively, you can start them individually by navigating into their respective folders.
