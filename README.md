# CLOUD-BASED WEB APPLICATION [Harman]

A modern, responsive web application designed for cloud-based deployment, developed as part of an LTU coursework.  
This application includes front-end designs, interactive UI components, and theme customization using Next.js and TypeScript (With technologies such as Tailwind, CSS transform, Prisma, Jest, Playwrite testing, and UseTheme.

---

## Overview

This web application provides a tabs page, which allows users to generate clean HTML5 code with JS and inline CSS, all with no use of external stylesheets or CSS classes.  
With further additions for assignment 2, we have an escape room page, wherein users can take upon the escape room challenges which consists of 3 timed stages, which will then get recorded in a cloud database. There is also a leaderboard wherein the top 5 scores will be shown. If the user achieves top 5, they'll have an option to delete the record or edit notes. With the addition of this page, the project introduces a proper backend structure with prisma logics to connect to our cloud database, and also has 2 automation testing methods including Jest and PlayWrite testing. Furthermore, the project is now dockerized. 

The design of the application was made with simplicity in mind, making it easier to implement client-side code generation from the browser.

---

## Current Features

### Pages
- **Home Page/Tabs Page**  
  A dynamic code generator that outputs HTML5 code with the use of JS and inline CSS.  
  Built for students accessing the LTU LMS to experiment with tab layouts and see real-time results.

- **About Page**  
  Includes:
  - Student Name and Student Number  
  - A video tutorial on how to use the web application

 - **Escape Room**
     This is an escape room challenge for students or leaners to enhance their JS knowledge.
     It consists of multiple stages with a timer to record their completion time, along with a leaderboard showing the top
     5 quickest times of users, wherein if owned, user can edit notes or delete the record. 
    Includes:
    - Escape room intro with start button
    - Multiple stages consisting of JS challenges
    - Feature to give up and quit the escape room
    - A completion stage wherein users are able to save their time to the database and go back to the home screen
    - Leaderboards showing top 5 quickest achieved times, with edit note and delete record button (if record owned by user)
   



---

### UI Structure
Each page contains the following elements:

- **Top Bar**  
  Displaying the student number in the top-left corner. (FYI, the student number, name, as well as the copyright is all stored in the variable in "config.ts" under src folder.)

- **Header**  
  A responsive navigation menu with a **Kebab Menu (☰)** that shows us the About page option for PC. As for mobile, it shows options for all the available navigation pages.  
  Uses CSS transform to indicate when selected.

- **Theme Toggle**  
  A switch that changes the page appearance to either **Dark Mode** or **Light Mode**.  
  The theme is automatically saved using cookies for persistent experience.

- **Footer**  
  Displays:
  - Copyright  
  - Student Name  
  - Student Number  
  - Current Date  

---

### Cookies
- The application **remembers the last visitied page** using browser cookies/local storage.  
- When returned, the same page/tab automatically loads. Convenient. 

---

## Setting Up & Running the Application (Docker)

This project is fully dockerized, making it easy to run on Windows without installing Node.js or other dependencies directly on your machine.

Follow these steps to get the application running from start to finish.

### 1. Prerequisites
Before starting, ensure you have the following installed on your Windows machine:
- **Git** (for downloading the code).
- **Docker Desktop** (This includes Docker Compose).
  > **Note:** Ensure Docker Desktop is running before proceeding.

### 2. Clone the Repository or Download as ZIP
  Either clone the repositroy and have it in your code editor, or download it directly and extract it and then open in your code editor.

### 3. Configure the Environment
The application needs to know how to connect to database.

1. In the root folder of the project (where `docker-compose.yml` is located), create a new file named `.env.docker`.
2. Open this file in a text editor.
3. Paste database connection string into the file, example looks as such:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
```
### 4. Setup the Database
Before the app can run, we need to sync your cloud database with the project's schema using Prisma.

Run the following command in your terminal:

```bash
docker compose run --rm web npx prisma db push
```

### 5. Build and Start the App
Application is now ready to be launched. Run:

```bash
docker compose up
```

### 6. Access the Webapp
Follow what the terminal says its hosted by, most likely it says http://localhost:3000, paste that in the browser to access the webapp.

### 7. Close the App
To stop the application:
1. Go to the terminal where the app is running.
2. Press `Ctrl + C`.
3. To remove the docker containers completely, run:
   ```bash
   docker compose down


---
## Some Screenshots of the Application

<img width="1919" height="876" alt="image" src="https://github.com/user-attachments/assets/065081ab-806a-47a3-bfc9-34856d2440fe" />
<br>
<br>
<img width="1919" height="875" alt="image" src="https://github.com/user-attachments/assets/89039433-364d-44aa-8fd6-b17767aa1bee" />
<br>
<br>
<img width="1919" height="878" alt="image" src="https://github.com/user-attachments/assets/b09a36fe-cb31-45e1-aa00-6d4af4a8a03c" />
<br>
<br>
<img width="1919" height="877" alt="image" src="https://github.com/user-attachments/assets/40d73bd3-95ef-4db5-91d8-dea09bf54cb1" />
<br>
<br>
<img width="1919" height="880" alt="image" src="https://github.com/user-attachments/assets/493aeccc-3df8-470a-9e18-0682eab9e645" />
<br>
<br>
<img width="1919" height="878" alt="image" src="https://github.com/user-attachments/assets/ccd7feb6-bf94-4086-9020-672c6d5107e2" />
<br>
<br>
<img width="1919" height="983" alt="image" src="https://github.com/user-attachments/assets/e115aced-ed85-48a8-ab59-dbb74e252f08" />
<br>
<br>
<img width="561" height="485" alt="image" src="https://github.com/user-attachments/assets/deecb9ae-b017-4408-86aa-da3eacf3baa7" />







