#!/bin/sh

echo "********************************************************"
echo "Wait for mongodb to be available"
echo "********************************************************"

while ! nc -z $MONGODB_STATUS_HOST $MONGODB_STATUS_PORT; do
  printf 'mongodb is still not available. Retrying...\n'
  sleep 3
done

printf 'mongodb detected running'

echo "********************************************************"
echo "Starting myapp"
echo "********************************************************"

java -Djava.security.egd=file:/dev/./urandom \
     -Dspring.data.mongodb.uri=$MONGODB_URI \
     -jar /app.jar
