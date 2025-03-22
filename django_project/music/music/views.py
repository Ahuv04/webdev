# from django.http import HttpResponse
from django.shortcuts import render


def homePage(req):
    return render(req, 'home.html')
    # return HttpResponse("Hello Django")

def aboutPage(req):
    return render(req, 'about.html')
    # return HttpResponse("About Page")