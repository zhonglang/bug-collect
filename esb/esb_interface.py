# -*- coding: utf-8 -*-
from blueking.component.shortcuts import get_client_by_user
import time
from conf.default import *
import base64
from Crypto.Cipher import AES
from binascii import b2a_hex, a2b_hex

def get_business_by_user(username):
    '''传入用户名，获取该用户有权限的业务列表'''
    client = get_client_by_user(username)
    kwargs = {}
    result = client.cc.get_app_by_user(kwargs)
    business_list = []
    if result["result"]:
        mid_data = result["data"]
        business_list = [{"name": data["ApplicationName"], "id": data["ApplicationID"]} for data in mid_data]
    return business_list



def get_host_by_business(business_id,username):
    '''传入业务id，和用户名，获取该业务下的主机'''
    client = get_client_by_user(username)
    kwargs = {
        "app_id": business_id
    }
    result = client.cc.get_app_host_list(kwargs)
    host_list = []
    if result['result']:
        mid_data = result['data']
        host_list = [{"ip": data["InnerIP"], "Sourc": data["Source"]} for data in mid_data]
        print host_list
    return host_list




def fast_script(username, server, script_content, script_type=1, script_timeout=3600):
    '''
    :param username: 用户名
    :param server: {'app_id': 业务id,
                            'ip_list': [{'ip': 主机ip, 'source': 主机source}],
                            'account': 执行账号（root,administrator）}
    :param script_content:脚本内容
    :param script_type:脚本类型 1(shell脚本)、2(bat脚本)、3(perl脚本)、4(python脚本)、5(Powershell脚本)
    :param script_timeout:超时时间
    :return:
    '''
    client = get_client_by_user(username)
    kwargs = {
        "app_code": APP_ID,
        "app_secret": APP_TOKEN,
        "app_id": server["app_id"],
        "username": username,
        "content": base64.b64encode(script_content),
        "ip_list": server["ip_list"],
        "type": script_type,
        "account": server["account"],
        "script_timeout": script_timeout
    }
    result = client.job.fast_execute_script(kwargs)
    if result["result"]:
        task_id = result["data"]["taskInstanceId"]
        time.sleep(2)
        return get_ip_log_content(client, username, task_id)
    else:
        return {"result": False, "data": result["message"]}
# 获取脚本任务Log
def get_ip_log_content(client, username, task_id, i=1):
    kwargs = {
        "app_code": APP_ID,
        "app_secret": APP_TOKEN,
        "username": username,
        "task_instance_id": task_id
    }
    result = client.job.get_task_ip_log(kwargs)
    if result["result"]:
        if result["data"][0]["isFinished"]:
            ip_log_content = []
            for i in result["data"][0]["stepAnalyseResult"]:
                if i["resultType"] == 9:
                    ip_log_content.extend([{"result": True, "ip": str(j["ip"]), "logContent": j["logContent"]} for j in i["ipLogContent"]])
                else:
                    ip_log_content.extend([{"result": False, "ip": str(j["ip"]), "logContent": j["logContent"]} for j in i["ipLogContent"]])
            return {"result": True, "data": ip_log_content}
        else:
            time.sleep(1)
            return get_ip_log_content(client, username, task_id)
    else:
        i += 1
        if i < 10:
            time.sleep(1)
            return get_ip_log_content(client, username, task_id, i)
        else:
            err_msg = "get_logContent_timeout;task_id:%s;err_msg:%s" % (task_id, result["message"])
            return {"result": False, "data": err_msg}



key = "wusnxhdyshdksiwy"
mode = AES.MODE_ECB
encryptor = AES.new(key, mode)


def encrypt(plaintext):
    '''加密'''
    while len(plaintext) % 16 != 0:
        n = 0
        n += 1
        plaintext += "\0" * n
    cipher = encryptor.encrypt(plaintext)
    return b2a_hex(cipher)



def decrypt(ciphertext):
    '''解密'''
    plain1 = encryptor.decrypt(a2b_hex(ciphertext))
    plain = plain1.rstrip("\0")
    return plain

