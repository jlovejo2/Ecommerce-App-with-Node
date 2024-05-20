### Curl Commands

- `curl -iX POST \
  -H 'content-type: application/json' \
  -d '{"username": "admin", "password": "mystical_narwhal"}' \
  --cookie-jar cookies \
  http://localhost:1337/login`

- using the --cookie-jar flag we store the cookie expected in a file for use later.  in this case file is cookies. 
- it is created in the directory the curl command is run in.

- `curl -i --cookie cookies http://localhost:1337/orders`
- this command grabs that cookie and makes an authenticated response 