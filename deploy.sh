cd ..
rm -rf ./TwitterMining
git clone https://github.com/seangone/TwitterMining.git
cd TwitterMining
cd api-server
./mvnw package
cd ..
docker-compose up -d
