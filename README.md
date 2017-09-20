# blockbuilder-search
API endpoint and UI for blockbuilder search page

This repo is split into two main parts, the API endpoint and the search page. It is currently only really designed
to be called from within blockbuilder, in order to develop a potentially complicated feature that has new backend requirements. 

# API endpoint
This is an express endpoint which calls ElasticSearch and returns the results.

# Search page
This is a small react app using redux.

# Development

### setup blockbuilder dev environment

- (full guide)[https://github.com/enjalot/blockbuilder/wiki/Development#development]

- open a web browser and visit local blockbuilder [http://[::]:8889](http://[::]:8889)

### setup search index

- download and install `Elasticsearch 2.3.4` from [https://www.elastic.co/downloads/past-releases](https://www.elastic.co/downloads/past-releases)

- populate elasticsearch index with blocks

### connect local blockbuilder with local blockbuilder-search

```
// npm link blockbuilder-search
```

- watch the **blockbuilder-search** source for changes, and rebuild the bundle on each change

```
cd blockbuilder-search
npm run buildWatch
```

- open a web browser and visit local blockbuilder search [http://[::]:8889/search](http://[::]:8889/search)