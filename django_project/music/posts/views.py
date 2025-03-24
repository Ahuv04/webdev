from django.shortcuts import render, redirect

from .models import Post
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from . import forms

# Create your views here.

def posts_list(req):
    posts = Post.objects.all().order_by('-date')
    return render(req, 'posts/posts_list.html', {'posts': posts})

def post_page(req, slug):
    post = Post.objects.get(slug=slug)
    return render(req, 'posts/post_page.html', {'post': post})

@login_required(login_url="/users/login/")
def post_new(req):
    if req.method=='POST':
        form = forms.createPost(req.POST, req.FILES)
        if form.is_valid():
            newpost = form.save(commit=False)
            newpost.author = req.user
            newpost.save()
            return redirect('posts:list')
    else:
        form =forms.createPost()
    return render(req, 'posts/post_new.html', {'form':form})