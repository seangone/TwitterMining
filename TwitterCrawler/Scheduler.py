from datetime import datetime
from threading import Timer
import time
import heapq

from util.logger import get_logger
logger = get_logger()

from downloader import *

class Scheduler(object):

    def __init__(self):
        self.q = []
        heapq.heapify(self.q)

    def deserialize_from_file(self, filepath):
        pass

    def serialize_to_file(self, filepath):
        pass

    def put(self, s):
        assert isinstance(s, dict)
        heapq.heappush(self.q, s)

    def put_many(self, schedules):
        for s in schedules:
            self.put(s)

    def next(self):
        return heapq.heappop(self.q)



def timedTask():
    '''
    第一个参数: 延迟多长时间执行任务(单位: 秒)
    第二个参数: 要执行的任务, 即函数
    第三个参数: 调用函数的参数(tuple)
    '''
    Timer(60 * 20, task, ()).start()

def task():
    print("task executed at:", datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    d = Downloader()
    d.download_trends()
    timedTask()

if __name__ == '__main__':
    task()
    while True:
        print("Main Thread Heartbeat at", datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
        time.sleep(20)
