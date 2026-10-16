from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect, render

from .forms import SignUpForm


@login_required
def dashboard(request):
    return render(request, "accounts/dashboard.html")


def signup(request):
    if request.user.is_authenticated:
        return redirect("dashboard")

    form = SignUpForm(request.POST if request.method == "POST" else None)
    if request.method == "POST" and form.is_valid():
        form.save()
        messages.success(request, "Your account is ready. Sign in to continue.")
        return redirect("login")

    return render(request, "accounts/signup.html", {"form": form})
