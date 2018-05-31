from util.logger import get_logger
logger = get_logger()


class Task(object):
    def __init__(self, func_name, paras):
        self.func = func_name
        self.paras = paras


# parser function wrapper
class Parser(object):
    def __init__(self):
        pass

    def parse_tweets(self, tweets):
        tasks = []
        for t in tweets:
            # new task to put
            task = Task('put_tweet', tweets)
            tasks.append(task)
            # new task to crawl retweets
            task = Task('download_retweeters', {'id': t['id']})
            tasks.append(task)
        logger.info("Complete - Parse_tweets_to_retweeters Complete Size {}".format(len(tasks)))
        return tasks

    def __call__(self, *args, **kwargs):
        func_name = kwargs['func_name']
        paras = kwargs['paras']
        func = getattr(self, func_name)
        return func(**paras)
