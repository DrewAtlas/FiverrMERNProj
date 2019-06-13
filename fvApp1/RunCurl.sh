#!/bin/bash

# Run the tests against test app 1 on port 3000
curl -d name=Testname http://localhost:3000/test1/posting

curl http://localhost:3000/test1/getting

curl http://localhost:3000/test1/contact?id=1



