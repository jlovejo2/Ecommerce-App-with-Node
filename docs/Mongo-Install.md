followed instructions on mongodb.com
https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/

### Step 1
- import the public key used by the package management system
`sudo apt-get install gnupg curl`

### Step 2
- import the mongodb public GPG key
`curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor ` 

### Step 3
- create the list file for version of Ubuntu
- this one for Ubuntu 20.04
`echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list`

### Step 4
- reload local packages
`sudo apt-get update`

### Step 5
- install latest version of MongoDB
`sudo apt-get install -y mongodb-org`

### Step 6 (Optional)
- pin the packageat the currently installed version
`
    echo "mongodb-org hold" | sudo dpkg --set-selections
    echo "mongodb-org-database hold" | sudo dpkg --set-selections
    echo "mongodb-org-server hold" | sudo dpkg --set-selections
    echo "mongodb-mongosh hold" | sudo dpkg --set-selections
    echo "mongodb-org-mongos hold" | sudo dpkg --set-selections
    echo "mongodb-org-tools hold" | sudo dpkg --set-selections
`
