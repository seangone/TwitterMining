rm -rf TwitterMining/
git clone https://github.com/seangone/TwitterMining.git

cd TwitterCrawler/
./docker-build.sh
./docker-run.sh

cd ..

cd SpringServer
./docker-build.sh
./docker-run.sh