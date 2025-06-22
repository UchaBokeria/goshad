# Gotth-core

This project utilizes the **Gotth stack** – a combination of Golang, Tailwind CSS, Templ, htmx, and additional libraries and tools for a fast web development experience. Here's a breakdown of the key components and technologies used:

## Technologies and Libraries Used:

- **Golang**: A powerful programming language used for backend development.
- **Tailwind**: A utility-first CSS framework for building custom designs quickly.
- **Templ**: A templating engine used for generating dynamic HTML content.
- **htmx**: A library for creating modern web applications with server-side logic.
- **GORM**: An ORM (Object-Relational Mapping) library for database interactions in Golang.
- **Echo**: A lightweight and fast Go web framework for building web applications.
- **Air**: A live-reloading tool by Cosmtrek for enhancing development productivity.
- **Animate.css**: A library for adding animations to web elements.
- **PostgreSQL**: A powerful, open-source relational database system.

## Project Structure:

- **Server Folder**: Contains all the project files.
  - **server.go**: Entry point for the server.
  - **server.routes.go**: Global router file defining HTTP routes.
  - **Model, Controller, View folders**: Follow the MVC (Model-View-Controller) structure.
    - **Controllers**: Handle HTTP routes.
    - **Middleware**: Reuseable middlewares for routes.
    - **Models**: Interact with the database using GORM.
    - **View**: Contains template files.
    - **Common Folder**: Houses important helper packages for the project.
  - **Static Files**: All static files such as CSS, fonts, icons, scripts (JavaScript), and images are stored in the `public` folder.
  - **Documents Folder**: A folder dedicated to storing document files related to the project.
  - **Uploads Folder**: A folder utilized for uploading system functionality during development.

## Development Workflow:

- **Running the Project**: Use the `make run` command to start the development server. This command automates tasks such as moving Go files to the build folder and setting up live reloads.
- **Building for Production**: The `make prod` command generates the necessary files for production deployment in bin directory.
- **Migrations**: Database migrations can be executed using the `make migrate` command.
- **Seeding Data**: Populate the database with initial data using the `make seed` command.
- **Testing**: Run tests with the `make test` command.
- **Static Analysis**: Static analysis is performed using tools like Vet and Staticcheck, triggered by the `make vet` and `make staticcheck` commands, respectively.

## Example Commands from Makefile:

```bash
make run                # Start the development server
make reload             # Run reload script
make prod               # Build for production
make build              # Build the project
make migrate            # Run database migrations
make seed               # Seed the database with initial data
make tailwind           # Generate Tailwind CSS
make tailwind-watch     # Watch Tailwind CSS changes
make templ              # Generate templ files
make templ-watch        # Watch templ file changes
make templ-clean        # Clean up generated templ files
make vet                # Run go vet
make runAir             # Start Air for live reloading
make test               # Run tests
make staticcheck        # Perform static analysis
