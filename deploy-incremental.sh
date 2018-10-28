# run in the server

docker pull 127.0.0.1:5000/seangone/twittercrawler
docker pull 127.0.0.1:5000/seangone/twittermining
docker pull 127.0.0.1:5000/seangone/tmfrontend

docker stop tmcrawler
docker stop tmserver
docker stop tmfrontend

docker rm tmcrawler
docker rm tmserver
docker rm tmfrontend

docker run -d -it \
    --name tmserver \
    -p 8080:8080 \
    127.0.0.1:5000/seangone/twittermining
docker run -d -it \
    --name tmcrawler \
    -v "$PWD"/app_log:/app/app_log \
    127.0.0.1:5000/seangone/twittercrawler
docker run -d -it \
    --name tmfrontend \
    -p 80:3000 \
    127.0.0.1:5000/seangone/tmfrontend