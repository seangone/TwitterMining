import os
import logging
from logging.handlers import TimedRotatingFileHandler

def mkdir(path):
    folder = os.path.exists(path)

    if not folder:
        os.makedirs(path)


def get_logger():
    mkdir("./app_log")
    log = logging.getLogger("logger.log")
    if not log.handlers:
        file_hdlr = TimedRotatingFileHandler(filename="./app_log/logger.log", when="D", interval=10, backupCount=2)
        file_hdlr.setLevel(logging.INFO)
        stream_hdlr = logging.StreamHandler()
        # stream_hdlr.setLevel(logging.DEBUG)
        formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
        file_hdlr.setFormatter(formatter)
        # stream_hdlr.setFormatter(formatter)
        log.addHandler(file_hdlr)
        # log.addHandler(stream_hdlr)
        logging.basicConfig(level=logging.INFO)
    return log