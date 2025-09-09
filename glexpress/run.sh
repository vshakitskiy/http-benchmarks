#!/usr/bin/env bash

# non-cluster:
# NODE_ENV=production node index.js

# cluster
pnpx pm2 start index.js -i 16 --env production
