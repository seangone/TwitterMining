# Build images first

# then push it to my private registry
docker tag seangone/twittercrawler 18.144.22.172:5000/seangone/twittercrawler
docker push 18.144.22.172:5000/seangone/twittercrawler
docker tag seangone/twittermining 18.144.22.172:5000/seangone/twittermining
docker push 18.144.22.172:5000/seangone/twittermining
docker tag seangone/tmfrontend 18.144.22.172:5000/seangone/tmfrontend
docker push 18.144.22.172:5000/seangone/tmfrontend