# run in the server

docker pull 127.0.0.1:5000/seangone/twittercrawler
docker pull 127.0.0.1:5000/seangone/twittermining

docker run -d -it \
    --name tmserver \
    -p 80:8080 \
    127.0.0.1:5000/seangone/twittermining
docker run -d -it \
    --name tmcrawler \
    -v "$PWD"/app_log:/app/app_log \
    127.0.0.1:5000/seangone/twittercrawler