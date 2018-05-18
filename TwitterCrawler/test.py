import tweepy
from tweepy.parsers import JSONParser, ModelParser
from pymongo import *

if __name__ == "__main__":
    # configure tweepy
    consumer_key = "EDEHVD09dN7cdIJMPr4D47eYp"
    consumer_secret = "jTQFOvigDTHu4Lusb7rJ3kCX0RkimTEX1iZaFl0MloKMuhB1Tb"
    access_token = "3932937014-ULiqX7aTSxpHEQOHEncUL2w6YT3tEzvbyYpseea"
    access_token_secret = "CdGTXhyJX9qkBO3MeqRAZne6Cv4MPPKWDMlUuMz3DTNcV"

    auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)
    api = tweepy.API(auth, parser=JSONParser())

    # configure mongodb
    client = MongoClient("mongodb://localhost:27017/")
    db = client['tm']
    collection_tweets = db['tweets']

    # pull and store
    tweets = api.user_timeline(id = "realDonaldTrump")
    firstStatus = tweets[0];
    retweets = api.retweets(firstStatus['id'])
    collection_tweets.insert(tweets) # add _id to the dict

    print(firstStatus)
    print(type(firstStatus))
    print(retweets)