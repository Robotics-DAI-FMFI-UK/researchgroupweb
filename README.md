# researchgroupweb
public web of robotic group - bachelor thesis of Jan Spirka

## Migrate Server 

- git clone
- cd /client
- replace URL_PREFIX in config.js 
- npm run build
- mv build ../server
- cd ../server
- replace SSL CA in .ssl
- npm run prod
