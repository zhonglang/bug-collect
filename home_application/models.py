# -*- coding: utf-8 -*-

from django.db import models


#生成数据库的命令
#python manage.py makemigrations
# python manage.py migrate


class BugInfo(models.Model):
    # platform,app,env
    bug_type = models.CharField(max_length=10, default='')
    # running,finish
    bug_state = models.CharField(max_length=10, default='')
    bug_title = models.CharField(max_length=100, default='')
    customer = models.CharField(max_length=100, default='')
    bug_content = models.TextField(default='')
    bug_content_type = models.TextField(default='')
    bug_resolvent = models.TextField(default='')
    when_create = models.CharField(max_length=30, default='')
    create_by = models.CharField(max_length=30, default='')


class Person(models.Model):
    name = models.CharField(max_length=10, default='')
    sex = models.CharField(max_length=10, default='')
    age = models.IntegerField()

#
# class Business(models.Model):
#     app_name = models.CharField(max_length=100, default='')
#     app_id = models.CharField(max_length=10, default='')
#     app_desc = models.CharField(max_length=200, default='')
#     app_admin = models.CharField(max_length=20, default='')
#     when_created = models.CharField(max_length=50, default='')


class Server(models.Model):
    app_id = models.CharField(max_length=100,default='')
    app = models.CharField(max_length=100,default='')
    hostname = models.CharField(max_length=50, default='')
    os_name = models.CharField(max_length=100, default='')
    ip = models.CharField(max_length=100, default='')
    memory = models.CharField(max_length=100, default='')


# class Memory(models.Model):
#     when_created = models.CharField(max_length=50)
#     usage = models.CharField(max_length=50)
#     server = models.ForeignKey(Server)

