# Personal Website - HTML, CSS & JavaScript

A modern, responsive personal website built with vanilla HTML, CSS, and JavaScript. No frameworks or libraries required!

## 🚀 Features

- **Responsive Design**: Works perfectly on all devices
- **Modern UI/UX**: Clean, professional design with smooth animations
- **Portfolio Showcase**: Filterable project gallery
- **Contact Form**: Functional contact form with validation
- **Smooth Scrolling**: Beautiful scroll animations
- **Mobile Menu**: Responsive navigation
- **Skill Bars**: Animated skill progress bars
- **CV Download**: Easy CV download functionality

## 📁 Files

- `index.html` - Main HTML structure
- `styles.css` - All styling and animations
- `script.js` - JavaScript functionality
- `README.md` - This file

## 🛠️ How to Use

### 1. Open the Website
Simply open `index.html` in your web browser. No server required!

### 2. Customize Content
Edit the following files to personalize your website:

#### Personal Information (`index.html`)
- **Line 7**: Change the title
- **Line 8**: Update meta description
- **Line 9**: Update keywords
- **Line 10**: Update author name
- **Line 25**: Change "YourName" to your actual name
- **Line 30**: Update your title/role
- **Line 36-39**: Update your description
- **Line 47**: Update CV filename

#### About Section (`index.html`)
- **Lines 58-65**: Update your personal bio
- **Lines 70-85**: Update your skills and percentages
- **Lines 95-125**: Update your work experience

#### Portfolio Projects (`script.js`)
- **Lines 2-70**: Replace with your own projects
- Update images, descriptions, technologies, and links

#### Contact Information (`index.html`)
- **Lines 200-220**: Update your contact details
- **Lines 225-240**: Update your social media links

### 3. Customize Styling (`styles.css`)
- **Lines 8-18**: Change primary colors
- **Lines 19-29**: Change secondary colors
- **Line 30**: Change font family
- **Lines 33-45**: Modify animations

## 🎨 Customization Guide

### Colors
The website uses a blue color scheme. To change colors, edit these CSS variables in `styles.css`:

```css
/* Primary Colors */
.btn-primary { background-color: #2563eb; }
.hero-name { color: #2563eb; }

/* Secondary Colors */
.btn-secondary { background-color: #f1f5f9; }
```

### Fonts
The website uses Inter font from Google Fonts. To change:

1. Update the Google Fonts link in `index.html` (line 15)
2. Update the font-family in `styles.css` (line 12)

### Images
Replace the placeholder images in the portfolio section:
1. Add your images to the project folder
2. Update the `image` URLs in `script.js` (portfolioData array)

## 📱 Responsive Design

The website is fully responsive and works on:
- Mobile phones (320px+)
- Tablets (768px+)
- Desktop (1024px+)
- Large screens (1280px+)

## 🌐 Deployment

### Option 1: GitHub Pages (Free)
1. Create a GitHub repository
2. Upload your files
3. Go to Settings → Pages
4. Select source branch
5. Your site will be live at `https://username.github.io/repository-name`

### Option 2: Netlify (Free)
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop your project folder
3. Your site will be live instantly

### Option 3: Vercel (Free)
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Deploy automatically

## 📧 Contact Form

The contact form currently simulates submission. To make it functional:

### Option 1: EmailJS (Free)
1. Sign up at [emailjs.com](https://emailjs.com)
2. Create an email template
3. Add your credentials to the form submission in `script.js`

### Option 2: Netlify Forms
1. Deploy to Netlify
2. Add `data-netlify="true"` to the form tag
3. Forms will be handled automatically

### Option 3: Custom Backend
1. Create a backend API
2. Update the `handleContactForm` function in `script.js`
3. Replace the simulation with actual API calls

## 🔧 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Support

If you need help customizing your website:
1. Check the comments in the code files
2. Look at the customization guide above
3. Test on different browsers and devices

## 🎯 Performance

The website is optimized for:
- Fast loading times
- Smooth animations
- Mobile performance
- SEO best practices

---

**Happy coding! 🚀**
