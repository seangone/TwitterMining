
from util.logger import get_logger
logger = get_logger()

import tweepy
from tweepy.parsers import JSONParser, ModelParser

from pymongo import *

from windowcounter import *
from sentimentanalysis import *

def config_tweepy(api_config):
    auth = tweepy.OAuthHandler(api_config['consumer_key'], api_config['consumer_secret'])
    auth.set_access_token(api_config['access_token'], api_config['access_token_secret'])
    api = tweepy.API(auth, parser=JSONParser())
    logger.info("Tweepy Config - {}".format(api_config))
    return api

def config_mongo(mongodb_config):
    client = MongoClient(mongodb_config['url'])
    db = client['tm']
    logger.info("MongoDB Config Url - {}".format(mongodb_config['url']))
    return db

lasttimestamp = 0
def writedb_sentimental_score(db, timestamp, score, last_status_id):
    global lasttimestamp
    if timestamp - lasttimestamp < 1:
        return
    collection = db['sentiments']
    collection.insert({'timestamp': timestamp,
                       'score': score,
                       'last_status_id': last_status_id})
    lasttimestamp = timestamp


class MyStreamListener(tweepy.StreamListener):
    def __init__(self, db, counter):
        super(MyStreamListener, self).__init__()
        self.db = db
        self.counter = counter

    def on_error(self, status_code):
        if status_code == 420:
            #returning False in on_error disconnects the stream
            return False
            # returning non-False reconnects the stream, with backoff.
            # return True


    def on_status(self, status):
        json = status._json
        if json['text'].startswith("RT"):
            return
        if json['truncated']:
            text = json['extended_tweet']['full_text']
        else:
            text = json['text']
        # Store status info to MongoDB
        ####
        # Calculate Sentimental score
        score = cal_sentimental_score(text)
        self.counter.add(score)
        print(json['id'], "-----", score, text)
        print(self.counter(), len(self.counter))
        # Store score to MongoDB
        writedb_sentimental_score(self.db, time.time(), self.counter(), json['id'])
        # db.sentiments.find().sort({$natural:-1}).limit(1)


if __name__ == '__main__':
    from util.config import twitter_api_config, mongodb_config
    api = config_tweepy(twitter_api_config)
    db = config_mongo(mongodb_config)
    counter = windowcounter(600)
    myStreamListener = MyStreamListener(db, counter)
    # start a stream
    myStream = tweepy.Stream(auth=api.auth, listener=myStreamListener)
    myStream.filter(track=['Donald Trump'])
    # myStream.filter(follow=["2211149702"])
