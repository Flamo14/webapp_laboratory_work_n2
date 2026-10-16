from django.contrib.auth.models import User
from django.test import TestCase
from django.urls import reverse


class AuthenticationFlowTests(TestCase):
    def test_dashboard_requires_login(self):
        response = self.client.get(reverse("dashboard"))
        self.assertRedirects(response, f"{reverse('login')}?next={reverse('dashboard')}")

    def test_signup_creates_user_and_shows_login_link(self):
        response = self.client.post(
            reverse("signup"),
            {
                "username": "newperson",
                "email": "newperson@example.com",
                "password1": "Str0ng-Password-2026!",
                "password2": "Str0ng-Password-2026!",
            },
        )
        self.assertRedirects(response, reverse("login"))
        self.assertTrue(User.objects.filter(username="newperson", email="newperson@example.com").exists())

    def test_empty_signup_shows_required_field_errors(self):
        response = self.client.post(reverse("signup"), {})

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "This field is required.")

    def test_login_and_logout(self):
        User.objects.create_user(username="member", password="Str0ng-Password-2026!")

        response = self.client.post(
            reverse("login"),
            {"username": "member", "password": "Str0ng-Password-2026!"},
        )
        self.assertRedirects(response, reverse("dashboard"))

        response = self.client.get(reverse("dashboard"))
        self.assertContains(response, "Welcome in,")

        response = self.client.post(reverse("logout"))
        self.assertRedirects(response, reverse("login"))
