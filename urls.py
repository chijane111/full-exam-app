"""
URL configuration for myapp project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from myapp import views



from django.urls import path
from . import views

urlpatterns = [
    path('', views.index_page, name='landing'),
    path('registration/', views.register_page, name='registration'),
    path('login/', views.login_page, name='login'),
    path('logout/', views.logout_user, name='logout'),
    path('welcome/', views.welcome_page, name='welcome'),
    path('name_entry/', views.name_entry_page, name='name_entry'),  # This handles name entry form
    path('subject_selection/', views.subject_selection_page, name='subject_selection'),  # Must match view redirect
    path('exam/math/', views.math_exam, name='math_exam'),
    path('exam/english/', views.english_exam, name='english_exam'),
    path('exam/science/', views.science_exam, name='science_exam'),
    path('exam/history/', views.history_exam, name='history_exam'),

    path('teacher/register/', views.teacher_register, name='teacher_register'),
    path('teacher/login/', views.teacher_login, name='teacher_login'),
    path('teacher/dashboard/', views.teacher_dashboard, name='teacher_dashboard'),
    path('add_question/', views.add_question, name='add_question'),
    path('view_scores/', views.view_student_scores, name='view_scores'),
]
