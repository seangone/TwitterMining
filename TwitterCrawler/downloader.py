import tweepy
from tweepy.parsers import JSONParser, ModelParser
from pymongo import *

from time import sleep
from datetime import datetime

class downloader(object):
    def __init__(self):
        self.config()

    def config(self):
        # configure tweepy
        consumer_key = "EDEHVD09dN7cdIJMPr4D47eYp"
        consumer_secret = "jTQFOvigDTHu4Lusb7rJ3kCX0RkimTEX1iZaFl0MloKMuhB1Tb"
        access_token = "3932937014-ULiqX7aTSxpHEQOHEncUL2w6YT3tEzvbyYpseea"
        access_token_secret = "CdGTXhyJX9qkBO3MeqRAZne6Cv4MPPKWDMlUuMz3DTNcV"

        auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
        auth.set_access_token(access_token, access_token_secret)
        self.api = tweepy.API(auth, parser=JSONParser())

        # configure mongodb
        client = MongoClient("mongodb://localhost:27017/")
        self.db = client['tm']

    def download_trends(self, woeid = 23424977):
        # call api
        res = self.api.trends_place(woeid)[0]['trends']
        collection_tweets = self.db['trends']
        timestamp = datetime.now()
        for i, t in enumerate(res):
            t['crawled_time'] = timestamp
            t['crawled_order'] = i

        # db write
        collection_tweets.insert(res)  # add _id to the dict

        # log
        record = "Trends Crawled Successful Time {} Size {}".format(timestamp, len(res))
        print(record)
        # print(res)

    def get_trends(self):
        collection_trends = self.db['trends']
        res = collection_trends.aggregate(
                [{"$project": {"crawled_time": 1}},
                 {"$group": {
                     "_id": "$crawled_time",
                     "t": {"$first": "$crawled_time"}
                 }},
                 {"$sort": {"_id": -1}},
                 {"$limit": 1}])
        for d in res:
            latest_time = d['t']
        record = "Got lastest time in DB: {}".format(latest_time)
        print(record)
        res = collection_trends.find(
            {"crawled_time":latest_time},
            {'_id': 0, 'name': 1, 'url': 1, "tweet_volume": 1,
             "crawled_order": 1})\
            .sort("crawled_order", 1)\
            .limit(9)
        record = "Got 9 lastest trends of time {} in DB: {}"\
            .format(latest_time, "\n".join(map(str, res)))
        print(record)


if __name__ == "__main__":
    d = downloader()
    d.download_trends()