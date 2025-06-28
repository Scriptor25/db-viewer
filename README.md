# DB Viewer

This project utilizes the German "DB API Marketplace" APIs to display lots of useful information about train stations,
timetables and more.

## Getting Started

First you need to check out the git repository. After that, duplicate the ".env.example" and rename it to ".env.local".
This file contains the api endpoint url, client id and client secret (api key). Alternatively (e.g. if deployed on a
server) these variables can also be set as environment variables.

To get a client id and secret, visit the [DB API Marketplace](https://developers.deutschebahn.com/db-api-marketplace/apis/)
and create a new application. You need to subscribe to following APIs for the webinterface to work:

- Timetables
- FaSta - Station Facilities Status
- StaDa - Station Data 

The next thing to do (pun intended) is to run `npm install` and set up the project locally. After that run `npm run dev`
to run the site in developer mode or `npm run build` followed by `npm run start` to launch in production mode. Now you
can visit your very own "Deutsche Bahn Information Display" on `localhost` or wherever you hosted it.
