from django.shortcuts import render, redirect

from django.http import HttpResponse
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm

from django.contrib.auth import login, logout

# Create your views here.
def registerUser(req):
    if req.method=="POST":
        form = UserCreationForm(req.POST)
        if form.is_valid():
            #form.save() also returns a user value
            login(req, form.save())
            return redirect("posts:list")
    else:
        form = UserCreationForm()
    return render(req, 'register_user.html', {"form":form})

def loginUser(req):
    if req.method=="POST":
        form = AuthenticationForm(data=req.POST)
        if form.is_valid():
            #login here
            login(req, form.get_user())
            if 'next' in req.POST:
                return redirect(req.POST.get('next'))
            return redirect("posts:list")
    else:
        form = AuthenticationForm()
    return render(req, 'login.html', {"form":form})


def logoutUser(req):
    if req.method=="POST":
        logout(req)
        return redirect("posts:list")
