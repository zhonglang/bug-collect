# -*- coding: utf-8 -*-

from common.mymako import render_mako_context
from common.mymako import render_json
from home_application.celery_tasks import *
import json
from home_application.models import *
from esb.get_app_by_user import get_business_by_user
import time
from django.db.models import Q
import StringIO
import xlsxwriter
from django.http import HttpResponse
import requests
import json
from home_application.celery_tasks import *
import datetime


def home(request):
    """
    首页
    """
    return render_mako_context(request, '/home_application/js_factory.html')


def get_bug_list(request):
    try:
        get_data = json.loads(request.body)
        ret = [i for i in BugInfo.objects.filter(
            bug_type__contains=get_data['bug_type'],
            bug_state__contains=get_data['bug_state'],
            create_by__contains=get_data['create_by'],
            when_create__range=(str(get_data['whenStart']), str(get_data['whenEnd']))
        ).filter(Q(bug_resolvent__contains=get_data['bug_key']) | Q(bug_title__contains=get_data['bug_key']) | Q(
            bug_content__contains=get_data['bug_key'])).order_by('-when_create').values()]
        return render_json({'result': True, 'data': ret})
    except Exception, e:
        return render_json({'result': False, 'error': str(e)})


def up_bug(request):
    try:
        get_data = json.loads(request.body)
        get_data['when_create'] = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))
        get_data['create_by'] = request.user.username
        BugInfo.objects.create(**get_data)
        return render_json({'result': True})
    except Exception, e:
        return render_json({'result': False, 'error': str(e)})


def modify_bug(request):
    try:
        get_data = json.loads(request.body)
        BugInfo.objects.filter(id=get_data['id']).update(**get_data)
        return render_json({'result': True})
    except Exception, e:
        return render_json({'result': False, 'error': str(e)})


def search_bug(request):
    try:
        get_data = json.loads(request.body)
        ret = [i for i in BugInfo.objects.filter(id=get_data['id']).values()]
        return render_json({'result': True, 'data': ret[0]})
    except Exception, e:
        return render_json({'result': False, 'error': str(e)})


def make_excel(get_data, data_key):
    sio = StringIO.StringIO()
    workbook = xlsxwriter.Workbook(sio)
    worksheet = workbook.add_worksheet()
    header_format = workbook.add_format({
        'num_format': '@',
        # 'border': 1,
        # 'bold': True,
        'text_wrap': True,
        'valign': 'vcenter',
        'indent': 1,
    })
    cols_num = get_data.__len__()
    rows_num = get_data[0].keys().__len__()
    itemlist = data_key
    for col in range(cols_num):
        for row in range(rows_num):
            data = get_data[col][itemlist[row]]
            if row == 0:
                with_op = 10
            else:
                with_op = 20
            worksheet.set_column(col, row, with_op)
            if type(data) == dict:
                worksheet.write(col, row, data['name'], header_format)
                worksheet.data_validation(col, row, col, row, {'validate': 'list', 'source': data['list']})
            else:
                if itemlist[row] == 'vm_expired_time':
                    if data == '0':
                        worksheet.write(col, row, '', header_format)
                    else:
                        worksheet.write(col, row, data, header_format)
                else:
                    worksheet.write(col, row, data, header_format)
                    # worksheet.write(col, row, str(get_data[col][itemlist[row]]), header_format)
                    # worksheet.data_validation(col, row,col, row, {'validate': 'list',
                    #                                                                     'source': ['open', 'high', 'close']})
    # Set up layout of the worksheet.
    # worksheet.set_column('A:A', 68)
    # worksheet.set_column('B:B', 15)
    # worksheet.set_column('D:D', 15)
    # worksheet.set_row(0, 36)

    #
    # worksheet.write('B13', 'open')
    # worksheet.data_validation('B13', {'validate': 'list',
    #                                   'source': ['open', 'high', 'close'],'show_input':'open'}
    #                           )
    workbook.close()
    sio.seek(0)
    response = HttpResponse(sio.getvalue(), content_type='APPLICATION/OCTET-STREAM')
    response['Content-Disposition'] = 'attachment; filename=data_validate.xlsx'
    return response


def down_excel(request):
    get_data = {}
    get_data['bug_type'] = request.GET.get('bug_type')
    get_data['bug_state'] = request.GET.get('bug_state')
    get_data['create_by'] = request.GET.get('create_by')
    get_data['whenStart'] = request.GET.get('whenStart')
    get_data['whenEnd'] = request.GET.get('whenEnd')
    get_data['bug_key'] = request.GET.get('bug_key')
    get_data['when_create'] = request.GET.get('when_create')
    ret = [i for i in BugInfo.objects.filter(
        bug_type__contains=get_data['bug_type'],
        bug_state__contains=get_data['bug_state'],
        create_by__contains=get_data['create_by'],
        when_create__range=(str(get_data['whenStart']), str(get_data['whenEnd']))
    ).filter(Q(bug_resolvent__contains=get_data['bug_key']) | Q(bug_title__contains=get_data['bug_key']) | Q(
        bug_content__contains=get_data['bug_key'])).order_by('-when_create').values()]

    data = {'id': u'序号', 'bug_type': u'类型', 'customer': u'客户', 'bug_title': u'问题标题',
            'bug_content': u'问题内容',
            'bug_content_type': u'类型说明',
            'bug_state': u'状态',
            'bug_resolvent': u'解决方法',
            'create_by': u'创建者',
            'when_create': u'提交时间',
            }
    ret.insert(0, data)
    data_key = ['id', 'bug_type', 'customer', 'bug_title', 'bug_content', 'bug_content_type', 'bug_state',
                'bug_resolvent',
                'create_by', 'when_create']
    return make_excel(ret, data_key)


def test(request):
    # demo.delay("zzl")普通异步任务
    # time=datetime.datetime.now()+datetime.timedelta(seconds=60)
    # demo.apply_async(args=["zzl"], etc=time)
    # time="2018-5-19 10:10"
    # time=datetime.datetime.strftime(time,"%Y-%m-%d %H:%M")
    # demo.apply_async(args=["zzl"], etc=time)

    try:
        user_list = list(Person.objects.filter().values())
    except Exception as e:
        return render_json({"result": False, "user": e})
    return render_json({"result": True, "user": user_list})


def add_user(request):
    user = json.loads(request.body)
    Person.objects.create(name=user['name'], sex=user['sex'], age=user['age'])

    return render_json({"result": True})
# 删除数据


def del_by_id(request):
    # get_data ={"id":4}是一个字典
    try:
        get_data=json.loads(request.body)
        Person.objects.get(id=get_data["id"]).delete()
    except:
        return render_json({"result": False})
    return render_json({"result": True})


def change_user(request):
    try:
        modify_user = json.loads(request.body)
        Person.objects.filter(id=modify_user["id"]).update(**modify_user)
    except:
        return render_json({"result": False})
    return render_json({"result": True})

# 将内容显示在弹框上


def get_detail(request):
    try:
        get_user=json.loads(request.body)
        # print(get_user)返回一个词典
        # {u'id': 1}
        person = Person.objects.filter(id=get_user["id"]).values()[0]
    except:
        return render_json({"result": False})
    return render_json({"result": True,"person": person})


# 显示蓝鲸平台下的业务
def show_business(request):
    try:
        # 这里开启了异步任务
        asyn_get_memory_info.apply_async()
        business = get_business_by_user()
    except Exception as e:
        return render_json({"result": False, "business_list": e})
    return render_json({"result": True, "business_list": business})


# 获取业务下的主机
def search_host(request):
    listinfo = []
    host_dict = {}
    try:
        get_data = json.loads(request.body)
        business_id = get_data["h_id"]
        # host_list = Server.objects.filter(app_id=business_id).last()
        host_list = get_business_host_list(business_id)
        print host_list
        for host in host_list:
            host_ip = host["InnerIP"]
            print host_ip
            info_fromdb = Server.objects.filter(ip=host_ip).last()
            host_dict["app_id"] = info_fromdb.app_id
            host_dict["app"] = info_fromdb.app
            host_dict["hostname"] = info_fromdb.hostname
            host_dict["os_name"] = info_fromdb.os_name
            host_dict["ip"] = info_fromdb.ip
            host_dict["memory"] = info_fromdb.memory
            print host_dict


            listinfo.append(host_dict)
            host_dict = {}

        print listinfo

    except Exception as e:
        return render_json({"result": True, "host_list": e})
    return render_json({"result": True, "host_list": listinfo})


# 获取从前端传来的业务ID和IP
def get_mem_info(request):
    try:
        info = json.loads(request.body)
        app_id = info["id"]
        ip = info["ip"]
        task_id = execute_script(app_id,ip)
        # print task_id
        memory_info = get_task_result(str(task_id))
        # print memory_info
        # print memory_info["data"]

        mem_list = memory_info["data"].split()
        total_memory = float(mem_list[7])
        used_memory = float(mem_list[8])
        data = {"total_memory": total_memory,"used_memory": used_memory}
        memory_used_rate = "%.2f%%" %(used_memory/total_memory*100)

    except Exception as e:
        return render_json({"result": False, "memory_info": e})
    return render_json({"result": True, "memory_info": memory_used_rate})






