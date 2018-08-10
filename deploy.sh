rm -rf TwitterMining/
git clone https://github.com/seangone/TwitterMining.git

cp ./TwitterMining/Server/Deploy/TwitterMining.war ./tomcat/webapps

pip install -r ./TwitterMining/TwitterCrawler/requirements.txt
nohup python3 ./TwitterMining/TwitterCrawler/app.py > log.txt 2>&1 &
