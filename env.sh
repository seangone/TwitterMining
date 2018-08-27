# MongoDB
docker run -d \
    --name mongo \
    -v "$PWD"/mongodb-data:/data/db \
    -p 20087:27017 \
    mongo

# Mongo-express
docker run -d -it --rm \
    --name mongo-express \
    --link mongo:mongo \
    -p 20088:8081 \
    mongo-express

# Docker registry
docker run \
  --detach \
  --name registry \
  --hostname registry \
  --volume $(pwd)/registry:/var/lib/registry/docker/registry \
  --publish 5000:5000 \
  --restart unless-stopped \
  registry:latest