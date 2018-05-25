# -*- coding: utf-8 -*-

import requests
import json
import base64


def execute_script(app_id, ip):
    url = "http://paas.bk.com:80/api/c/compapi/job/fast_execute_script/"
    content = "free -m"
    content = base64.b64encode(content.encode('utf-8'))
    body = {
        "app_code": "study",
        "app_secret": "72854a56-a837-499c-89b8-c5e5fdd7a409",
        "username": "admin",
        "app_id": app_id,
        "content": content,
        "ip_list": [
            {
                "ip": ip,
                "source": 0
            }
        ],
        "type": 1,
        "account": "root",
    }
    body = json.dumps(body)
    req_obj = requests.session()
    req_obj.verify = False
    req_obj.headers.update({"Content-Type": "application/json"})
    result = req_obj.post(url, body)
    # print(result.content)
    my_json = json.loads(result.content)
    task_id = my_json["data"]["taskInstanceId"]
    return task_id




