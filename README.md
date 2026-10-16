# Northstar Django login starter

A reusable Django authentication starter with login, signup, logout, a protected dashboard, responsive templates, and small progressive-enhancement interactions.

## Run locally

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Open <http://127.0.0.1:8000/>. The dashboard requires authentication; create an account at `/signup/` or sign in at `/login/`.

## Reuse in another Django app

1. Copy the `accounts/` app, `templates/base.html`, `templates/accounts/`, and `static/` assets into the project.
2. Add `"accounts"` to `INSTALLED_APPS`, include `accounts.urls` in the project URL configuration, and configure the template and static-file settings as needed.
3. Set `LOGIN_URL`, `LOGIN_REDIRECT_URL`, and `LOGOUT_REDIRECT_URL` to the desired route names.
4. Replace the Northstar brand and page content in the templates and update the visual tokens in `static/css/auth.css`.

Authentication, password hashing, CSRF protection, and password validation use Django's built-in facilities. For production, set a unique `DJANGO_SECRET_KEY`, set `DJANGO_DEBUG=0`, configure `DJANGO_ALLOWED_HOSTS`, and use an appropriate production database and HTTPS setup.

## Page interactions

The JavaScript waits for `DOMContentLoaded` before revealing the page, setting the footer year, enabling password visibility controls, and displaying a submission state for valid forms. The forms and authentication remain functional without JavaScript.
