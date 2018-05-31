from datetime import datetime

import tweepy
from tweepy.parsers import JSONParser, ModelParser

from util.logger import get_logger
logger = get_logger()

# tweepy download function wrapper
class Downloader(object):

    def __init__(self, config):
        self.tweepy_config(**config)

    def tweepy_config(self, consumer_key, consumer_secret, access_token, access_token_secret):
        auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
        auth.set_access_token(access_token, access_token_secret)
        self.api = tweepy.API(auth, parser=JSONParser())
        logger.info("Tweepy Config - consumer_key {}, consumer_secret {}, access_token {}, access_token_secret {}"
                    .format(consumer_key, consumer_secret, access_token, access_token_secret))

    def download_trends(self, woeid = 23424977):
        # call api
        res = self.api.trends_place(woeid)[0]['trends']
        # logging
        timestamp = datetime.utcnow()
        for i, t in enumerate(res):
            t['crawled_time'] = timestamp
            t['crawled_order'] = i

        logger.info("Downloaded trends successfully - At UTC {} Size {}".format(timestamp, len(res)))
        return res

    def download_user_timeline(self, user_id=None, screen_name=None, max_id=None):
        res = self.api.user_timeline(
            user_id=user_id, screen_name=screen_name, max_id=max_id, count=200, include_rts=1
        )
        logger.info("Complete - Downloaded User timeline - Size {}".format(len(res)))
        return res

    def download_retweeters(self, id, cursor=None):
        res = self.api.retweeters(id=id, cursor=cursor)
        logger.info("Complete - Downloaded Retweeters - Size {}".format(len(res)))
        return res

    def download_search(self, query, max_id=None):
        res = self.api.search(q=query, max_id=max_id, count=100)['statuses']
        logger.info("Complete - Downloaded Retweeters - Size {}".format(len(res)))
        return res

    def __call__(self, *args, **kwargs):
        func_name = kwargs['func_name']
        paras = kwargs['paras']
        func = getattr(self, func_name)
        return func(**paras)

if __name__ == "__main__":
    from util.config import twitter_api_config
    d = Downloader(twitter_api_config)
    schedule = {'func_name': 'download_user_timeline',
                'paras':
                    {'screen_name': "realDonaldTrump"}
                }
    res = d(**schedule)
    print(len(res))
    print(res[0])

    schedule = {'func_name': 'download_retweeters',
                'paras':
                    {'id': "1001455721588969472"}
                }
    res = d(**schedule)
    for i in res['ids'][:5]:
        print(i)

    task = {'func_name': 'download_search',
                'paras':
                    {'query': "durant"}
                }
    res = d(**task)
    for i in res[:5]:
        print(i)