
# 🛠️ Form Filler Backend (Django REST API)

This is the backend service for the Form Filler web application. Built using Django and Django REST Framework, it handles template processing, form preview generation, and secure payment processing via Razorpay.

---

## 📚 Table of Contents

- [Project Description](#project-description)
- [Technical Stack](#technical-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Running the Server](#running-the-server)
- [Environment Configuration](#environment-configuration)
- [API Endpoints](#api-endpoints)
- [Security & Permissions](#security--permissions)
- [Testing & Admin](#testing--admin)
- [Deployment Guide](#deployment-guide)
- [License & Contributions](#license--contributions)

---

## 📄 Project Description

The Form Filler Backend is a Django REST API service that powers a secure and dynamic form-filling web application. Its core purpose is to manage the lifecycle of user-submitted form data — from template selection to live preview, payment integration, and secure delivery of completed forms.

This backend works in tandem with a JavaScript-based frontend and is built around a streamlined workflow:

1. 🔍 The user selects a form template from the frontend, which sends a request to fetch the field structure from the backend.
2. 🧾 The user fills in the form, and the frontend submits their data to the backend, which dynamically merges it with the HTML version of the template (originally converted from a PDF/DOCX).
3. 👁 The backend stores the preview result and sends back a URL for the user to review their filled form securely.
4. 💳 Once the user approves the content, Razorpay APIs are used to create and capture the payment order.
5. 📥 After successful payment, the user is allowed to download the filled form.
6. 🧼 Once the download is confirmed, the backend automatically deletes the filled form to preserve security and reduce storage overhead.

Additional capabilities include:

- Admin panel to manage templates and promo codes
- Field-level template metadata management
- Razorpay webhook handling for payment status verification
- Secure form delivery through tokenless download and one-time access
- Protection against unauthorized preview capture or form data leakage

The backend is modular and scalable, making it suitable for integration with any frontend via RESTful APIs.


---

## ⚙️ Technical Stack

The backend is built using modern and scalable Python tools with integrations for secure payment handling and dynamic file generation:

### 🐍 Core Backend

- Python 3.12.3 
- Django 4.2.11  
- Django REST Framework 

### 💳 Payments & Transactions

- Razorpay Python SDK – Used for generating payment orders and processing webhooks  
- Promo Code Engine – Custom model for applying and tracking discounts  

### 📁 File Handling & Media

- Django Media Storage – Used to handle uploaded and generated HTML files  
- Custom HTML Form Renderer – Injects user data into HTML templates using tag-based mapping  
- CloudConvert (manual, external tool) – Used manually to convert PDF/DOCX templates to HTML before they are added to the frontend's template directory 

### 🔐 Security & Middleware

- CORS Headers – Enables secure frontend-backend communication across domains  
- CSRF & Middleware – Standard Django protections with optional middleware customization  
- Auto-deletion of files post-download for secure one-time delivery  

### 🛠 Utilities & Supporting Libraries

- json, os – Core utilities for environment and file handling  
- python-decouple (optional) – For environment variable management in production  
- SQLite (default) or PostgreSQL – As the project database  

This stack is lightweight yet extendable—ideal for production or educational projects requiring secure dynamic form generation and payment handling.


---

## 📁 Project Structure

```
form-filler-backend/
├── api/
│   ├── views.py
│   ├── models.py
│   ├── signals.py
│   ├── helpers.py
│   ├── serialisers.py
│   └── admin.py
├── billing/
│   ├── views.py
│   ├── models.py
│   ├── helpers.py
│   └── admin.py
├── server/
│   ├── settings.py
│   ├── urls.py
│   ├── middleware.py
│   ├── wsgi.py
│   └── asgi.py
├── media/
│   ├── Empty_template/
│   ├── Filled_template/
│   └── Images/
├── local.json
├── local.vars
├── requirements.txt
├── db.sqlite3
└── manage.py
```

---

## 🚀 Setup Instructions

Follow the steps below to get the backend running locally for development or testing.

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/form-filler-backend.git
cd form-filler-backend
```

### 2️⃣ Set Up a Virtual Environment

Recommended but optional:

```bash
python -m venv env
source env/bin/activate  # Windows: env\Scripts\activate
```

### 3️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

Make sure your pip and Python versions match the ones supported (Python 3.12+ recommended).

### 4️⃣ Create local.json for Razorpay Keys

In the root directory, create a local.json file to store your Razorpay credentials:

local.json:

```json
{
  "RAZORPAY_KEY_ID": "your_razorpay_key_id",
  "RAZORPAY_KEY_SECRET": "your_razorpay_secret"
}
```

Alternatively, you can define these variables in a local.vars or .env file and load them via a custom settings script.

> ⚠️ Both local.json and local.vars must include RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET for the project to run successfully. These values are required to initialize Razorpay’s API client during runtime.


Alternatively, you can use environment variables via a .env file or system exports.

### 5️⃣ Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

❗ If makemigrations doesn't detect changes, run it manually for both apps:

```bash
python manage.py makemigrations api
python manage.py makemigrations billing
python manage.py migrate
```

### 6️⃣ Create a Superuser (for admin access)

```bash
python manage.py createsuperuser
```

Follow the prompt to set up your username, email, and password.

### 7️⃣ Collect Static Files (for production)

```bash
python manage.py collectstatic
```

This step is optional during development but recommended before deployment.

---

You can now run the development server using:

```bash
python manage.py runserver
```

Visit http://127.0.0.1:8000/admin/ to access the admin panel.



---

## ⚙️ Running the Server & Environment Configuration

Once dependencies and migrations are complete, follow these steps to ensure your environment is properly configured and the server runs smoothly.

---

### 🔑 Environment Configuration

The project uses Razorpay for secure payments. You must provide the following environment variables:

- RAZORPAY_KEY_ID
- RAZORPAY_KEY_SECRET

There are two ways to provide them:

✅ Option 1 – Using local.json  
Place a local.json file in the root directory:

```json
{
  "RAZORPAY_KEY_ID": "your_razorpay_key_id",
  "RAZORPAY_KEY_SECRET": "your_razorpay_secret"
}
```

✅ Option 2 – Using local.vars or .env (optional advanced usage)  
You may also store credentials in a local.vars file or use a .env file with dotenv or django-environ. Example local.vars:

```env
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

> ⚠️ Both local.json and local.vars must include RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET for the project to run successfully. These are critical for initializing the Razorpay client in billing/views.py.

---

### 🚀 Running the Development Server

Once the environment is set:

1. Apply any remaining migrations (if not already done):

```bash
python manage.py migrate
```

2. (Optional) Collect static files for admin/assets:

```bash
python manage.py collectstatic
```

3. Run the server locally:

```bash
python manage.py runserver
```

The server will start at:

http://127.0.0.1:8000/

---

### 🔐 Admin Access

To use the Django Admin Panel:

1. Ensure you've created a superuser:
```bash
python manage.py createsuperuser
```

2. Login at:
http://127.0.0.1:8000/admin/

You can now manage templates, promo codes, transactions, and user-filled forms via the admin interface.


---

## 🔗 API Endpoints

Below is the list of available RESTful API endpoints provided by the backend. All endpoints return JSON responses and are intended to be consumed by the Form Filler frontend.

---

### 📁 Template APIs

| Method | Endpoint                   | Description                              |
|--------|----------------------------|------------------------------------------|
| GET    | /api/get_field_list/       | Returns a list of available templates with their fields and metadata. |
| GET    | /api/template/list/?template_id=<id> | Returns metadata for a specific template based on template_id. |

---

### 📝 Form Processing APIs

| Method | Endpoint                   | Description                              |
|--------|----------------------------|------------------------------------------|
| POST   | /api/preview_file/         | Accepts form data and returns a filled template preview URL. Requires multipart/form-data with template_id, phone, image (optional), and template_input as JSON. |
| DELETE | /api/filled_doc/delete/<id>/ | Deletes a filled template after successful download or session expiry. |

---

### 💳 Payment & Billing APIs

| Method | Endpoint                   | Description                              |
|--------|----------------------------|------------------------------------------|
| POST   | /billing/create_order/     | Creates a Razorpay order using user phone and optional promo code. Returns Razorpay key and order ID. |
| POST   | /billing/webhook/          | Razorpay webhook endpoint for payment status updates (success/failure). Processes and logs transaction history. |



Each endpoint is unauthenticated but designed to be securely called from the frontend only. Ensure proper CORS configuration in production to avoid misuse.

---
## 📦 API Usage Examples

---

### 1️⃣ GET /api/get_field_list/

Returns all available templates with field definitions.

📤 Request:

```bash
curl -X GET http://localhost:8000/api/get_field_list/
```

📥 Response:

```json
{
  "data": [
    {
      "template_id": "TEMPLATE123",
      "field": "Name, DOB, Address",
      "template_desc": "Form for Specialized Training"
    },
    ...
  ]
}
```

---

### 2️⃣ GET /api/template/list/?template_id=TEMPLATE123

Returns metadata for a specific template.

📤 Request:

```bash
curl -X GET "http://localhost:8000/api/template/list/?template_id=TEMPLATE123"
```

📥 Response:

```json
{
  "data": {
    "template_id": "TEMPLATE123",
    "template_name": "Specialized Training Form"
  }
}
```

---

### 3️⃣ POST /api/preview_file/

Generates a filled template preview. Use multipart/form-data.

📤 Request (using cURL):

```bash
curl -X POST http://localhost:8000/api/preview_file/ \
  -F "template_id=TEMPLATE123" \
  -F "phone=9876543210" \
  -F "template_input={\"fullName\": \"John Doe\", \"dob\": \"2000-01-01\"}" \
  -F "image=@path/to/photo.jpg" \
  -F "image_id=photoPlaceholder"
```

📥 Response:

```json
{
  "data": {
    "file_url": "http://localhost:8000/media/Filled_template/generated.html",
    "template_id": 42
  }
}
```

---

### 4️⃣ DELETE /api/filled_doc/delete/<id>/

Deletes a filled document after use.

📤 Request:

```bash
curl -X DELETE http://localhost:8000/api/filled_doc/delete/42/
```

📥 Response:

```json
{
  "message": "success"
}
```

---

### 5️⃣ POST /billing/create_order/

Creates a Razorpay order. Accepts JSON payload.

📤 Request:

```bash
curl -X POST http://localhost:8000/billing/create_order/ \
  -H "Content-Type: application/json" \
  -d '{"phone": "9876543210", "promocode": "SUMMER2025"}'
```

📥 Response:

```json
{
  "order_id": "order_LPz1t5c8B9xqAa",
  "amount": 3000,
  "currency": "INR",
  "key_id": "rzp_test_abc123"
}
```

---

### 6️⃣ POST /billing/webhook/

Webhook endpoint for Razorpay to notify payment success/failure. (No manual call needed.)

📤 Expected Payload (sent by Razorpay):

```json
{
  "event": "payment.captured",
  "payload": {
    "payment": {
      "entity": {
        "id": "pay_29QQoUBi66xm2f",
        "order_id": "order_LPz1t5c8B9xqAa",
        "amount": 3000,
        "notes": {
          "phone": "9876543210"
        }
      }
    }
  }
}
```

📥 Response:

```json
{
  "status": "payment captured"
}
```


These examples can be tested using Postman, curl, or directly from your frontend. Ensure Razorpay webhook URL is registered in your Razorpay dashboard.

---

## 🔐 Security & Permissions

This backend is designed to prioritize data protection, document security, and controlled access to user-generated content.

---

### 🔒 Form Security

- Filled templates are never directly exposed before payment confirmation.
- Form preview and final files are stored temporarily and removed automatically after download.
- File access is sessionless and one-time — there's no public listing or reuse of completed files.

---

### 🚫 Preview Protection (Handled by Frontend)

While not enforced by the backend directly, frontend pages implement the following controls to protect content:

- Screenshot blocking via JavaScript (limited)
- Right-click, dev tools, and copy-paste prevention
- View-source prevention and keyboard lock for inspection tools

These controls are designed to enforce a paywall and prevent stealing filled forms without payment.

---

### 🔐 Razorpay Payment Validation

- All payment initiation happens through /billing/create_order/ with a verified Razorpay key_id.
- Only successful webhook confirmations (/billing/webhook/) result in a transaction log and user file access.
- Promo codes are securely checked and usage tracked in the database.

---

### 🔑 Admin Panel Permissions

- Only Django superusers can access the /admin/ interface.
- Admins can manage:
  - Templates and their HTML metadata
  - Promo codes and their usage counts
  - Transaction logs for every successful/failed payment

---

### 🔗 CORS & API Access

- APIs are open for frontend access; ensure your production server has proper CORS headers configured.
- Recommend using django-cors-headers in production:

```python
# settings.py
INSTALLED_APPS = [
    ...
    "corsheaders",
    ...
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    ...
]

CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = [
    "https://your-frontend-domain.com",
]
```

---

Future enhancements (optional):

- JWT or token-based authentication (for file access or downloads)
- Rate limiting or IP throttling to prevent abuse
- Expiry on filled document URLs or download links



---

## 🧪 Testing & Admin

This section outlines how to access the Django Admin panel, perform basic testing, and verify that your backend is running properly.

---

### 🧪 Testing the API Locally

After starting your development server:

```bash
python manage.py runserver
```

Test endpoints using:

- Postman
- curl (see examples above)
- Frontend integration

You can also directly check database changes by using Django shell:

```bash
python manage.py shell
```

---

### 🔐 Admin Panel Access

Django's built-in admin site allows you to manage:

- HTML templates and field metadata
- Promo codes and their usage
- User transaction logs and payment statuses
- Uploaded/generated filled forms (for monitoring or removal)

Access it at:

```plaintext
http://127.0.0.1:8000/admin/
```

Login credentials:

- You must first create a superuser:

```bash
python manage.py createsuperuser
```

Follow the prompts for username, email, and password.

---

### 🧼 Cleanup Note

For production:

- Run collectstatic before serving with a real web server:

```bash
python manage.py collectstatic
```

- Periodically clean up media/Filled_template/ directory if automatic deletion fails for any reason.

---

Optional Enhancements:

- Add unit tests in api/tests.py or billing/tests.py
- Use Django Debug Toolbar or logging for inspecting requests during development


---

## 🚀 Deployment Guide (Optional)

Here are a few ways you can deploy your Django backend:

### Option 1: Railway / Render / Fly.io (No Docker)

1. Set environment variables for:
   - RAZORPAY_KEY_ID
   - RAZORPAY_KEY_SECRET

2. Use PostgreSQL or SQLite (check with platform compatibility)

3. Run Django setup commands:
   ```bash
   python manage.py migrate
   python manage.py collectstatic --noinput
   ```

4. Point your platform’s web service to:
   ```
   python manage.py runserver 0.0.0.0:$PORT
   ```

---

### Option 2: Docker Deployment

Create a Dockerfile:
```dockerfile
FROM python:3.12

WORKDIR /app

COPY . /app

RUN pip install -r requirements.txt

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
```

Run with:
```bash
docker build -t form-filler-backend .
docker run -d -p 8000:8000 form-filler-backend
```

You can add a docker-compose.yml for database configuration if using PostgreSQL or MySQL.

---

## 📄 License & Contributions

This project is open source.

Contributions welcome!

To contribute:

1. Fork the repo
2. Create a new branch: git checkout -b feature-name
3. Commit your changes: git commit -m "feat: add feature"
4. Push the branch: git push origin feature-name
5. Create a Pull Request

---
