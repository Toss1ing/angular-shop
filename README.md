# Project Setup

## Prerequisites

Make sure you have the following installed:

* **Node.js**
* **npm**
* **Angular CLI**

You can check the installed versions with:

```bash
node --version
npm --version
ng version
```

If Angular CLI is not installed, install it globally:

```bash
npm install -g @angular/cli
```

## Installation

### 1. Install dependencies

From the project root directory, run:

```bash
npm install
```

## Running the Application

The project consists of two parts:

1. Angular frontend
2. JSON Server mock backend

### 1. Start the Angular application

Run:

```bash
ng serve
```

The Angular application will be available at:

```text
http://localhost:4200
```

Keep this terminal running.

---

### 2. Start JSON Server

Open a new terminal and navigate to the `data` directory:

```bash
cd data
```

Then start JSON Server:

```bash
json-server db.json
```

JSON Server will run on:

```text
http://localhost:3000
```

## Running the Project

After completing the setup, you should have two running processes:

```text
Angular application
http://localhost:4200

JSON Server
http://localhost:3000
```

## Troubleshooting

### JSON Server command not found

If you see:

```text
json-server: command not found
```

install JSON Server:

```bash
npm install -g json-server
```

Then run:

```bash
cd data
json-server db.json
```

### Angular CLI command not found

If you see:

```text
ng: command not found
```

install Angular CLI:

```bash
npm install -g @angular/cli
```

Then run:

```bash
ng serve
```
