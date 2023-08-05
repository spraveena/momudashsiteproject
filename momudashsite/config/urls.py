"""momudashsite URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
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
# from django.conf.urls import  url
from django.urls import path, re_path
from django.views.generic.base import RedirectView, TemplateView
from apps.patients import views as patient_views
from apps.mocap import views as mocap_views
#from apps.patients.views import displacement_data,index,session_overview

urlpatterns = [
    path('admin/', admin.site.urls),
    path("", patient_views.index, name="home"),
    path('disp_data/', mocap_views.displacement,name="disp_data"),
    path('vel_data/', mocap_views.velocity,name="vel_data"),
    path('autocorr_data/', mocap_views.autocorr,name="autocorr_data"),
    path('prec_data/', mocap_views.precision,name="prec_data"),
    path('session_id/', patient_views.session_overview ,name="session_overview"),
    path('patient_change/', patient_views.index,name="home"),
    path('leaderboard/',patient_views.leaderboard, name="leaderboard")

]
