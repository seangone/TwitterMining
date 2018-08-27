
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

def readdb_topics(db):
    # connect db and get topics
    dbres = db['topics'].find().limit(400)
    topics = {l['_id']: l for l in dbres}
    newrouter = topicrouter(topics)
    return newrouter

def writedb_sentimental_score(db, topic, timestamp, score, last_status_id):
    global lasttimestamp
    if timestamp - lasttimestamp < 1:
        return
    collection = db['sentiments']
    collection.insert({'topic': topic,
                       'timestamp': timestamp,
                       'score': score,
                       'last_status_id': last_status_id})
    lasttimestamp = timestamp

def deletedb_old(db, delta = 86400):
    collection = db['sentiments']
    res = collection.remove({'timestamp': {"$lt": time.time() - delta}})
    return res

def get_status_text(status):
    assert isinstance(status, tweepy.Status)
    json = status._json
    if json['text'].startswith("RT"):
        return
    if json['truncated']:
        text = json['extended_tweet']['full_text']
    else:
        text = json['text']
    return text

def get_status_id(status):
    assert isinstance(status, tweepy.Status)
    return status._json['id']

class topicrouter(object):
    def __init__(self, topics = {}):
        self.topics = topics
        for k, v in self.topics.items():
            v['counter'] = windowcounter(600)

    def names(self):
        return list(self.topics.keys())

    def keywords(self):
        return [kw for k, v in self.topics.items() for kw in v['keywords']]

    def ids(self):
        return [kw for k, v in self.topics.items() for kw in v['ids']]

    def route(self, status):
        text = get_status_text(status)
        if text is None: return
        for k, v in self.topics.items():
            for kw in v['keywords']:
                if kw in text:
                    return k
        return

    def get_counter(self, topic_name):
        if topic_name in self.names():
            return self.topics[topic_name]['counter']
        return

    def __eq__(self, another):
        if not isinstance(another, topicrouter): return False
        return self.names() == another.names() and \
               self.keywords() == another.keywords() and \
               self.ids() == another.ids()


class MyStreamListener(tweepy.StreamListener):
    def __init__(self, db, router):
        super(MyStreamListener, self).__init__()
        self.db = db
        self.router = router
        assert isinstance(self.router, topicrouter)

    def on_error(self, status_code):
        if status_code == 420:
            #returning False in on_error disconnects the stream
            return False
            # returning non-False reconnects the stream, with backoff.
            # return True

    def on_status(self, status):
        # route status to the corresponding topic
        topic_name = self.router.route(status)
        if topic_name is None: return
        counter = self.router.get_counter(topic_name)
        # TODO: Store status info to MongoDB
        # Calculate Sentimental score
        id = get_status_id(status)
        text = get_status_text(status)
        score = cal_sentimental_score(text)
        counter.add(score)
        print(status._json)
        print(id, "-----", score, text)
        print(topic_name, counter(), len(counter))
        # Store score to MongoDB
        writedb_sentimental_score(self.db, topic_name, time.time(), counter(), id)
        # db.sentiments.find({"topic": "Donald Trump"}).sort({"timestamp": -1}).limit(1)


if __name__ == '__main__':
    from util.config import *
    api = config_tweepy(twitter_api_config)
    db = config_mongo(mongodb_config)

    num_deleted = deletedb_old(db, RESIST_TIME)
    logger.info("deleted old scores: {}".format(num_deleted))

    # get topics from db and start a twitter stream
    router = readdb_topics(db)
    myStreamListener = MyStreamListener(db, router)
    myStream = tweepy.Stream(auth=api.auth, listener=myStreamListener)
    myStream.filter(track=router.keywords(), async=True)
    logger.info("Topics initialized from DB: {}, keywords: {}"
                .format(router.names(), router.keywords()))

    while 1:
        time.sleep(CHECK_INTERVAL)
        # delete old
        num_deleted = deletedb_old(db, RESIST_TIME)
        logger.info("deleted old scores: {}".format(num_deleted))
        # check tasks of topics
        newrouter = readdb_topics(db)
        if router is not None and newrouter == router:
            logger.info("Topics check, nothing changes, keywords: {}"
                        .format(router.keywords()))
        else:
            router = newrouter
            logger.info("Topics update from DB: {},  keywords: {}"
                        .format(router.names(), router.keywords()))
            myStream.disconnect()
            myStreamListener = MyStreamListener(db, router)
            myStream = tweepy.Stream(auth=api.auth, listener=myStreamListener)
            myStream.filter(track=router.keywords(), async=True)
            logger.info("Stream restarts")