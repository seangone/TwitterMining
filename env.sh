# MongoDB
docker run --name mongo -v "$PWD"/mongodb-data:/data/db -d -p 20087:27017 mongo
# Mongo-express
docker run -d -it --rm \
    --name mongo-express \
    --link mongo:mongo \
    -p 20088:8081 \
    mongo-express
