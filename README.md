# ADMIN SERVER FOR BOOK STORE WEB

This is a Node.js API application that uses Yarn as the package manager. This README provides instructions on how to set up, run, and use the application.

## Prerequisites

Before you begin, make sure you have the following prerequisites installed on your system:

1. [Node.js](https://nodejs.org/): You'll need Node.js to run this application. You can download it from the official website.

2. [Yarn](https://yarnpkg.com/): Yarn is used as the package manager for this project. You can install Yarn by following the instructions on their website.

3. A code editor of your choice. Visual Studio Code, Sublime Text, and Atom are popular choices.

## Getting Started

Follow these steps to set up and run the Node API application:

1. Clone the repository:

```bash
git clone https://github.com/hualocson/bookstore-admin-server server
```

2. Install project dependencies using Yarn:

```bash
yarn install
```

3. Create a `.env` file in the project root and configure your environment variables. You can use the `.env.example` file as a template.

4. Start the application:

```bash
yarn run dev
```

This command will initiate the Node.js server, and upon successful startup, you will receive a message indicating that the server is now listening on the **port** specified in your `.env` file.
