from downloader import *
from parser import *
from itempipeline import *

from util.logger import get_logger
logger = get_logger()

class Executer(object):
    def __init__(self):
        from util.config import twitter_api_config
        from util.config import mongodb_config
        self.d = Downloader(twitter_api_config)
        self.p = Parser()
        self.pl = MongoPipeline(mongodb_config)

    def __call__(self, *args, **kwargs):
        t = kwargs['task']
        assert isinstance(t, Task)
        func_name = t.func
        paras = t.paras
        if func_name.startswith("download"):
            logger.info("Executer - Task {} Paras {}".format(func_name, paras))
            func = getattr(self.d, func_name)
        elif func_name.startswith("parse"):
            logger.info("Executer - Task {} Size {}".format(func_name, len(paras['tweets'])))
            func = getattr(self.p, func_name)
        elif func_name.startswith("put"):
            logger.info("Executer - Task {}".format(func_name))
            func = getattr(self.pl, func_name)
        else:
            raise Exception("Wrong task")
        return func(**paras)


if __name__=="__main__":
    e = Executer()
    tweets = e(task=Task("download_search", {'query': "durant"}))
    tasks = e(task=Task("parse_tweets", {'tweets': tweets}))
    assert isinstance(tasks, list)
    while len(tasks):
        t = tasks.pop(0)
        res = e(task=t)
        if isinstance(res, Task):
            tasks.append(res)
        else:
            Task("put")
    print(tweets[:1])
    print(retweeters[:1])