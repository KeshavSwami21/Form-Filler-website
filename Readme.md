# 📝 Form Filler – Fullstack Form Automation Platform

Form Filler is a dynamic, fullstack web application that allows users to fill out document-based forms using live HTML previews, then securely download their personalized files after payment. It consists of a JavaScript-based frontend and a Django REST backend with Razorpay integration.

This project is ideal for services that offer form assistance, document customization, or PDF automation workflows.

---

## 📚 Table of Contents

- [Features](#features)
- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Quick Start Guide](#quick-start-guide)
- [Frontend Setup](#frontend-setup)
- [Backend Setup](#backend-setup)
- [API Reference](#api-reference)
- [Security & Permissions](#security--permissions)
- [Deployment](#deployment)
- [License](#license)

---

## 🚀 Features

- 🧾 Form template selection with live preview
- 🧠 Real-time data binding using data-target attributes
- 📤 Filled form preview before final submission
- 💳 Razorpay integration for secure payments
- 📥 Downloadable HTML-based filled document
- 🧼 Post-download cleanup of sensitive data
- 🔐 Frontend protection from copy/screenshot/dev tools

---

## 🏗 Architecture Overview

```text
[Frontend] (HTML, CSS, JS)
    ⬇️ select template
    ⬇️ fill + preview
    ⬇️ payment
    ⬇️ download file
    ⬇️ triggers backend delete

[Backend] (Django REST)
    ⬅️ Serves template list & fields
    ⬅️ Generates preview file
    ⬅️ Processes payment order
    ⬅️ Webhook for transaction record
    ⬅️ Sends filled form back to frontend
    ⬅️ Deletes file post-download
```

---

## ⚙️ Tech Stack

- Frontend: HTML, CSS, JavaScript (Vanilla), AJAX
- Backend: Python 3.12, Django 4.2, Django REST Framework
- Payment: Razorpay API
- File Handling: HTML templates (manually converted from PDF/DOCX via CloudConvert)
- Security: JavaScript-based protections, one-time file access, auto-deletion

---

## 📁 Folder Structure

```
form-filler/
├── frontend/      # Contains HTML, CSS, JS, and form templates
│   └── index.html, form.js, preview.html, ...
├── backend/       # Django project with API & billing logic
│   └── manage.py, api/, billing/, server/, ...
├── README.md      # General project overview (this file)
├── README_frontend.md
├── README_backend.md
```

---

## 🧪 Quick Start Guide

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/form-filler.git
   cd form-filler
   ```

2. Open two terminals—one for frontend and one for backend.

---

## 🌐 Frontend Setup

Navigate to frontend directory:

```bash
cd frontend
```

Option A – Recommended via Live Server (VS Code):

- Install the Live Server extension
- Right-click index.html → “Open with Live Server”

Option B – Manual:

- Open index.html in your browser directly

Ensure all backend API URLs in JS files (form.js, index.js, preview.js, payment.js) point to the correct domain.

---

## 🛠 Backend Setup

Navigate to backend directory:

```bash
cd backend
```

Follow the steps below (summarized):

- Create virtual environment and install requirements
- Add Razorpay credentials to local.json
- Run:
  ```bash
  python manage.py makemigrations
  python manage.py migrate
  python manage.py createsuperuser
  python manage.py runserver
  ```

Full instructions are available in backend/README_backend.md.

---

## 📡 API Reference

The frontend communicates with these core endpoints:

| Method | Endpoint                         | Purpose                             |
|--------|----------------------------------|-------------------------------------|
| GET    | /api/get_field_list/             | Get available form templates        |
| GET    | /api/template/list/?template_id= | Get metadata for one template       |
| POST   | /api/preview_file/               | Preview filled template             |
| DELETE | /api/filled_doc/delete/<id>/     | Delete file after download          |
| POST   | /billing/create_order/           | Create Razorpay order               |
| POST   | /billing/webhook/                | Process Razorpay success/failure    |

---

## 🔐 Security & Permissions

- No file access before payment
- Preview is protected from copy/screenshot/dev tools
- Admin access restricted via Django superuser
- API open to frontend only (set CORS origins)
- Files deleted after download to prevent leaks

---

## 🚀 Deployment

- Backend: Can be deployed via Railway, Render, or Docker
- Frontend: Can be hosted on GitHub Pages, Netlify, or any static server
- See deployment instructions in backend/README_backend.md

---

## 📄 License

This project is open source.  
Feel free to fork, modify, and contribute!

---

## 📜 Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md).  
By participating, you are expected to uphold this code. If you observe any violations, please report them to keshavswami2112@gmail.com.
---

👋 For questions, raise an issue or reach out via GitHub Discussions.
