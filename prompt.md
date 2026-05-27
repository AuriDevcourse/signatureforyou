# Project: Email Signature Generator
This project allows users to generate styled email signatures and preview them in desktop and mobile formats. It is fully built with HTML, CSS, and JavaScript.

## 💡 Overview
The generator takes user input (name, job title, contact info, photo, and optional message), and dynamically creates a copyable email signature styled with modern design techniques like glassmorphism and responsive layout.

## ✅ Core Features
- Responsive previews: Desktop and mobile versions side by side
- Custom input fields: Name, job, email, phone, website, LinkedIn, image, and extra message
- Smart formatting: Handles long names and messages by auto-wrapping
- Copy to clipboard: One-click copy feature
- Design consistency with **glassmorphism** effect
- Clear, minimalist layout and structure

## 📂 File Structure
- `index.html` — main form and preview structure
- `styles.css` — form layout, glassmorphism styling, responsiveness
- `script.js` — generates the signature HTML, handles preview + copy logic

## 🎨 Styling Notes
- Glassmorphism: subtle transparent background with blur (`backdrop-filter`) and light shadowing
- Primary Color: `#ed634c` (TechBBQ brand)
- Font: `Verdana` for signature content, `Arial` for UI
- Mobile preview uses dark background (`#111`) with light text
- Social icons use fixed URLs (Facebook, LinkedIn, Instagram)
- Uses `img` tags for icons and user's uploaded photo

## 🖌️ UX/UI Enhancements
- Smooth transitions and spacing for readability
- Signature photo is 80px wide and styled per platform
- Long names and long extra text are auto-handled to avoid layout breaks
- The LinkedIn link under the photo only appears if a LinkedIn URL is provided

## 🔧 Planned Improvements (optional to implement)
- Allow real-time preview updates while typing
- Switch photo input from URL to file upload (with WordPress Media upload via token)
- Enable customization for fonts and colors for authenticated users
- Export signature as standalone `.html` file
- Add tooltips and validation messages for inputs

## 👨‍🎨 Credits
Created by **Aurimas** using **Windsurf Editor**.
Initial version styled with **glassmorphism** to match other projects.
