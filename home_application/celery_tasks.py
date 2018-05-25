# -*- coding: utf-8 -*-
from celery import task
from celery.schedules import crontab
from celery.task import periodic_task
from home_application.models import *
from common.log import logger
from esb.client import get_esb_client
from celery import Celery
from esb.get_app_by_user import get_business_by_user
from esb.get_app_host_list import get_business_host_list
from esb.fast_execute_script import execute_script
from esb.get_task_ip_log import get_task_result

import time
import sys
import datetime
reload(sys)
sys.setdefaultencoding("utf-8")

# RabbitMQ和Celery最大区别就是，RabbitMQ提供了一种可靠的消息存取的服务，而Celery负责高效的分发这些消息。
# brokers 中文意思为中间人，在这里就是指任务队列本身，
# Celery 扮演生产者和消费者的角色，brokers 就是生产者和消费者存放/拿取产品的地方(队列)
# """
# celery 任务示例
#
# 本地启动celery命令: python  manage.py  celery  worker  --settings=settings
# 周期性任务还需要启动celery调度命令：python  manage.py  celerybeat --settings=settings
# """


# @periodic_task(run_every=crontab(minute=0, hour=0))
# def delete_report():
#     pass

#定时任务的装饰器
# @task
# def demo(a):
#     time.sleep(10)
#     logger.error(a)


#周期任务的装饰器
@periodic_task(run_every=crontab(minute='*/10', hour='*', day_of_week="*"))
def asyn_get_memory_info():
    ip_list = []
    business_list = get_business_by_user()
    print business_list
    for business in business_list:
        business_id = business.get("ApplicationID")
        business_name = business.get("ApplicationName")

        host_list = get_business_host_list(business_id)
        for host in host_list:
            host_name = host.get("HostName")
            osname = host.get("OSName")
            host_ip = host.get("InnerIP")
            ip_list.append(host_ip)

            task_instance_id = execute_script(business_id, host_ip)
            print task_instance_id
            memory_info = get_task_result(task_instance_id)

            if len(memory_info["data"]) > 200:

                mem_list = memory_info["data"].split()
                total_memory = float(mem_list[7])
                used_memory = float(mem_list[8])
                data = {"total_memory": total_memory, "used_memory": used_memory}
                memory_used_rate = "%.2f%%" % (used_memory / total_memory * 100)

                Server.objects.create(app_id=business_id, app=business_name, hostname=host_name, os_name=osname,
                                      ip=host_ip, memory=memory_used_rate)

            else:
                Server.objects.create(app_id=business_id, app=business_name, hostname=host_name, os_name=osname,
                ip=host_ip, memory="信息错误！")

























# # 每天1点30执行
# @periodic_task(run_every=crontab(minute='30', hour='1', day_of_week="*"))
# def send_msg():
#     now = datetime.datetime.now()
#     logger.info(u"发送邮件成功，当前时间：{}".format(now))


