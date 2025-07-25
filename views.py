from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from .forms import QuestionForm
from .models import StudentScore


# Landing page
def index_page(request):
    return render(request, 'index.html')

# Student Registration
def register_page(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        if User.objects.filter(username=username).exists():
            return render(request, 'registration.html', {'error': 'Username already exists'})
        User.objects.create_user(username=username, password=password)
        return redirect('login')
    return render(request, 'registration.html')

# Student Login
def login_page(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            return redirect('welcome')
        else:
            return render(request, 'login.html', {'error': 'Invalid credentials'})
    return render(request, 'login.html')

# Logout
def logout_user(request):
    logout(request)
    return redirect('landing')

# Welcome page after login
@login_required(login_url='login')
def welcome_page(request):
    return render(request, 'welcome.html')

# Name entry page
def name_entry_page(request):
    if request.method == 'POST':
        name = request.POST.get('studentName')
        request.session['student_name'] = name
        return redirect('subject_selection')  # Redirect to subject selection
    return render(request, 'name_entry.html')


# Subject selection page
@login_required(login_url='login')
def subject_selection_page(request):
    return render(request, 'subject_selection.html')

# Math exam
@login_required(login_url='login')
def math_exam(request):
    return render(request, 'math.html')

# English exam
@login_required(login_url='login')
def english_exam(request):
    return render(request, 'english.html')

# Science exam
@login_required(login_url='login')
def science_exam(request):
    return render(request, 'science.html')

# History exam
@login_required(login_url='login')
def history_exam(request):
    return render(request, 'history.html')

# Teacher Register
def teacher_register(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')  # optional
        password = request.POST.get('password1')
        password2 = request.POST.get('password2')

        if password != password2:
            return render(request, 'teacher_register.html', {'error': 'Passwords do not match'})

        if User.objects.filter(username=username).exists():
            return render(request, 'teacher_register.html', {'error': 'Username already exists'})

        user = User.objects.create_user(username=username, email=email, password=password)

        login(request, user)  # Automatically log in after registration

        return redirect('teacher_dashboard')

    return render(request, 'teacher_register.html')

def teacher_login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            return redirect('teacher_dashboard')  # Redirects here after successful login
        else:
            return render(request, 'teacher_login.html', {'error': 'Invalid credentials'})
    return render(request, 'teacher_login.html')

@login_required(login_url='teacher_login')
def teacher_dashboard(request):
    return render(request, 'teacher_dashboard.html')

@login_required(login_url='teacher_login')
def add_question(request):
    if request.method == 'POST':
        form = QuestionForm(request.POST)
        if form.is_valid():
            question = form.save(commit=False)
            question.created_by = request.user
            question.save()
            return redirect('add_question')  
    else:
        form = QuestionForm()
    return render(request, 'add_question.html', {'form': form})

@login_required(login_url='teacher_login')
def view_student_scores(request):
    scores = StudentScore.objects.select_related('student', 'subject').order_by('-taken_at')
    return render(request, 'view_scores.html', {'scores': scores})
