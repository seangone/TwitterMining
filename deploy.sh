rm -rf TwitterMining/
git clone https://github.com/seangone/TwitterMining.git

cp ./TwitterMining/Server/Deploy/TwitterMining.war ./tomcat/webapps

cd pipenv
pipenv shell
cd ..
pip install -r ./TwitterMining/TwitterCrawler/requirements.txt
nohup python3 ./TwitterMining/TwitterCrawler/Scheduler.py > log.txt 2>&1 &
