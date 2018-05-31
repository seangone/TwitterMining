from pymongo import *

from util.logger import get_logger
logger = get_logger()

# connect to data pipeline, it could be connected to a database or a message queue
# it is responsible for get, put, check_update
class ItemPipeline(object):
    pass

class MongoPipeline(ItemPipeline):
    def __init__(self, mongo_config):
        self.config_mongo(**mongo_config)

    def config_mongo(self, url):
        client = MongoClient(url)
        self.db = client['tm']
        logger.info("MongoDB Config Url - {}".format(url))

    def put_trends(self, trends):
        collection_tweets = self.db['trends']
        # db write
        i = 0
        for item in trends:
            collection_tweets.insert(item)  # add _id to the dict
            i += 1
        logger.info("Written Successfully - Size {}".format(i))

    def get_trends(self):
        collection_trends = self.db['trends']
        # get latest time of all records
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
        logger.info("Read Successfully lastest time in Trends from MongoDB At {}".format(latest_time))
        # get the records with the latest time
        res = collection_trends.find(
            {"crawled_time": latest_time},
            {'_id': 0, 'name': 1, 'url': 1, "tweet_volume": 1,
             "crawled_order": 1}) \
            .sort("crawled_order", 1) \
            .limit(1)
        logger.info("Read Successfully the lastest trend from MongoDB: {}" \
                    .format("\n".join(map(str, res))))

    def put_tweet(self, tweets):
        collection = self.db['tweets']
        # db write
        i = 0
        for item in tweets:
            collection.insert(item)  # add _id to the dict
            i += 1
        logger.info("Complete - Written tweets - Size {}".format(i))

    def put_retweeters(self, source_id, retweeters):
        collection = self.db['retweeters']
        # db write
        i = 0
        for item in retweeters:
            item['source_id'] = source_id
            collection.insert(item)  # add _id to the dict
            i += 1
        logger.info("Complete - Written retweeters - Size {}".format(i))

if __name__ == "__main__":
    from util.config import mongodb_config
    p = MongoPipeline(mongodb_config)
    p.get_trends()