rm -rf TwitterMining/
git clone https://github.com/seangone/TwitterMining.git

./TwitterCrawler/docker-build.sh
./TwitterCrawler/docker-run.sh

./SpringServer/docker-build.sh
./SpringServer/docker-run.sh