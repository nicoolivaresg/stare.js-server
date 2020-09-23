# Simple Express Server StArE.js (Server version)

## Description
This is an really simple example for StArE.js Server version with all the basic configuration ready to run.

## Installation

First, you must create your own <code>.env</code> file, for this you can copy the <code>.env.example</code> file and fill it with your own data.  
Note that you only need to configure (in the <code>.env</code> file or on the import function) the options required for the SERPs/Feature Extractor that you're going to use. Fro exmple, if you're NOT going to use Google SERP or the BING SERP, the fields in the <code>.env</code> file can be empty.

```bash
npm install
```
## How to use

```bash
npm run start
```

Now you can make request to

```
http://localhost:3001/<your-serp>?query=<your-query>&numberOfResults=<your-number-of-results-desired>
```

For example:

```
http://localhost:3001/searchcloud?query=hello&numberOfResults=10
```