rm -rf TwitterMining/
git clone https://github.com/seangone/TwitterMining.git

cp ./TwitterMining/Server/Deploy/TwitterMining.war ./tomcat/webapps

cd pipenv
pipenv shell
pip install -r ../TwitterMining/TwitterCrawler/requirements.txt