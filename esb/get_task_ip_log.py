# -*- coding: utf-8 -*-

import requests
import json
import time


def get_task_result(task_instance_id,i=1):
    url = "http://paas.bk.com:80/api/c/compapi/job/get_task_ip_log/"
    body ={
        'app_code': 'study',
        'app_secret': '72854a56-a837-499c-89b8-c5e5fdd7a409',
        'username': 'admin',
        "task_instance_id": task_instance_id
    }

    body = json.dumps(body)
    req_obj = requests.session()
    req_obj.verify = False
    req_obj.headers.update({"Content-Type": "application/json"})
    result = req_obj.post(url, body)
    memory_content = json.loads(result.content)

    if memory_content["result"]:
        if memory_content["data"][0]["isFinished"]:
            memory_info = memory_content["data"][0]["stepAnalyseResult"][0]["ipLogContent"][0]["logContent"]
            return {"result": True, "data": memory_info}
        else:
            time.sleep(1)
            return get_task_result(task_instance_id,i=1)
    else:
        i += 1
        if i < 5:
            time.sleep(1)
            return get_task_result(task_instance_id,i=1)
        else:
            err_msg = "get_logContent_timeout;task_id:%s;err_msg:%s" % (task_instance_id, result["message"])
            return {"result": False, "data": err_msg}






