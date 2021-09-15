# Research group web
- Public web of robotic group - bachelor thesis of Ján Špirka

## Migrate Server
- _git clone_
- replace URL_PREFIX in /client/config.js
- _npm install_ in /client
- _npm run build_ in /client 
- move /client/build to /server  
- replace SSL CA in /server/.ssl
- _npm install_
- _npm run prod_
