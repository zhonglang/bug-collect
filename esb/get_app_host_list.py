import json
import requests


def get_business_host_list(business_id):
    url = "http://paas.bk.com:80/api/c/compapi/cc/get_app_host_list/"
    body = {
        'app_code': 'study',
        'app_secret': '72854a56-a837-499c-89b8-c5e5fdd7a409',
        'username': 'admin',
        "app_id": business_id
    }

    body = json.dumps(body)
    req_obj = requests.session()
    req_obj.verify = False
    req_obj.headers.update({"Content-Type": "application/json"})
    result = req_obj.post(url, body)
    my_json = json.loads(result.content)
    if my_json["result"]:
        host_business = my_json["data"]
        return host_business
    else:
        get_business_host_list(business_id)