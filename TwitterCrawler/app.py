from util.config import *
from downloader import *
from itempipeline import *
from scheduler import *

# responsibilities:
# read schedules from scheduler and execute them
# send requests to downloaders and deal with responses
# send requests to parsers and deal with responses
# the app, downloaders and parsers can be deployed on different machines or on the same one


logger.info("App Starts...")
s = Scheduler()
d = Downloader(twitter_api_config)
p = MongoPipeline(mongodb_config)

iter = d.download_trends()
p.put_trends(iter)
p.get_trends()


seedtask = {'func_name': 'download_search',
            'paras':
                {'query': "durant"}
            }
s.put(Schedule(d, seedtask))
cur = s.next()
while(cur):
    response = cur.execute()


