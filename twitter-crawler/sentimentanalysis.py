from nltk.sentiment.vader import SentimentIntensityAnalyzer
from nltk import tokenize

sid = SentimentIntensityAnalyzer()


def cal_sentimental_score(text):
    sentences = tokenize.sent_tokenize(text)
    s = 0
    for sentence in sentences:
        ss = sid.polarity_scores(sentence)
        s += ss['compound']
    return s

if __name__ == '__main__':
    cal_sentimental_score("how are you?")
    cal_sentimental_score("fine thank you")
    cal_sentimental_score("fuck u")
    cal_sentimental_score("fuck")
