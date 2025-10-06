# CLOUD-BASED WEB APPLICATION [Harman]

A modern, responsive web application designed for cloud-based deployment, developed as part of an LTU coursework.  
This application includes front-end designs, interactive UI components, and theme customization using Next.js and TypeScript (With technologies such as Tailwind, CSS transform, and UseTheme.

---

## Overview

So far, this web application provides a tabs page as the main feature, which allows users to generate clean HTML5 code with JS and inline CSS, all with no use of external stylesheets or CSS classes.  

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

More coming in the next assignment?
