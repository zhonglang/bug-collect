# -*- coding: utf-8 -*-

from django.conf.urls import patterns

urlpatterns = patterns(
    'home_application.views',
    # 首页--your index
    (r'^$', 'home'),
    (r'^get_bug_list$', 'get_bug_list'),
    (r'^up_bug$', 'up_bug'),
    (r'^modify_bug$', 'modify_bug'),
    (r'^search_bug$', 'search_bug'),
    (r'^down_excel$', 'down_excel'),
    (r'^test3', 'test'),
    (r'^add', 'add_user'),
    (r'^change_user$', 'change_user'),
    (r'^delete_user1$', 'delete_user'),
    (r'^search_user$', 'search_user'),
    (r'^del_by_id$', 'del_by_id'),
    (r'^get_detail$', 'get_detail'),
    (r'^change_user', 'change_user'),

    (r'^show_business', 'show_business'),
    (r'^search_host', 'search_host'),
    (r'^get_mem_info', 'get_mem_info'),
)
