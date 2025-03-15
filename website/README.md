# RoastMe Website

A website that roasts people based on their Instagram username, with a dark UI similar to BrowserSucks!

## Features

- Modern, dark-themed UI
- Enter an Instagram username to get roasted
- Generates unique, humorous roasts
- Copy results to clipboard
- Mobile-responsive design

## How to Host Locally

1. Make sure you have [Node.js](https://nodejs.org/) installed (version 14 or higher recommended)

2. Clone or download this repository

3. Open a terminal in the project directory and install dependencies:
   ```
   npm install
   ```

4. Start the server:
   ```
   npm start
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## How to Host Online

### Option 1: Netlify (Static Hosting)

1. Create a free account on [Netlify](https://www.netlify.com/)

2. Remove the server.js and package.json files (they're not needed for static hosting)

3. Drag and drop the website folder to Netlify's upload area

4. Your site will be live in seconds with a Netlify subdomain

### Option 2: Vercel

1. Create a free account on [Vercel](https://vercel.com/)

2. Install the Vercel CLI:
   ```
   npm install -g vercel
   ```

3. Navigate to the project directory and run:
   ```
   vercel
   ```

4. Follow the prompts to deploy your site

### Option 3: Heroku

1. Create a free account on [Heroku](https://www.heroku.com/)

2. Install the Heroku CLI and log in

3. In the project directory, initialize a git repository:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   ```

4. Create a Heroku app and deploy:
   ```
   heroku create
   git push heroku master
   ```

5. Open your app:
   ```
   heroku open
   ```

## Customization

- Edit the roast templates in `js/script.js` to customize the roasts
- Modify the CSS in `css/styles.css` to change the appearance
- Add more features like social sharing or user accounts

## License

MIT License - feel free to use, modify, and distribute as you wish! 