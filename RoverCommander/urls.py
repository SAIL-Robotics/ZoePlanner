from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'RoverCommander.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^$', 'RoverTool.views.index'),
    url(r'^index/', 'RoverTool.views.index'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^test/', 'RoverTool.views.test'),
    url(r'^jsonData/', 'RoverTool.views.jsonData'),
    url(r'^DBOperation/', 'RoverTool.views.DBOperation'),
    url(r'^config/', 'RoverTool.views.administratorControl'),
    url(r'^results/', 'RoverTool.views.viewResults')
)
