
# 🤝 Contributing to Form Filler

Thank you for considering contributing to this open-source project!  
We welcome all forms of contributions — bug reports, feature suggestions, code improvements, or documentation help.

Please take a moment to review the following guidelines to help us maintain a high standard for this project.

---

## 📌 How to Contribute

1. Fork the repository
2. Clone your fork locally
3. Create a new branch for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. Make your changes (see Development Setup below)
5. Commit with clear messages:
   ```bash
   git commit -m "feat: add feature X"
   ```
6. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
7. Submit a pull request (PR) on the main repository

---

## 🛠 Development Setup

Frontend:
- Use VS Code + Live Server to test HTML files inside the /frontend directory
- Update JS files only after testing cross-browser behavior

Backend:
- Python 3.12+, Django 4.2
- Setup using instructions from backend/README_backend.md
- Ensure Razorpay credentials are provided in local.json or environment variables

Before making a pull request:
- Run tests (if available)
- Validate frontend behavior (forms, preview, Razorpay integration)
- Ensure code is readable and cleanly structured

---

## 🧪 Reporting Issues

If you encounter bugs or unexpected behavior:

- Check open issues first
- Create a new issue with the following template:
  - A short and descriptive title
  - Steps to reproduce
  - Expected and actual results
  - Screenshots or logs (if applicable)

---

## ✍️ Code Style

We prefer:

- Snake_case for Python (backend)
- camelCase for JS variables (frontend)
- Semantic commit messages:
  - feat: new feature
  - fix: bug fix
  - docs: documentation
  - refactor: code cleanup

---

## 🔐 Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md).  
Please be respectful in all interactions and help us keep this a safe, inclusive space for everyone.

---

## 🙌 Thanks!

We appreciate every contribution — whether it's a code snippet, idea, or bug report.

You’re making the Form Filler project better for everyone. 💙
