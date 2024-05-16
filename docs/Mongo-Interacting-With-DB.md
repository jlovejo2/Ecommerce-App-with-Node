### Connecting to local Mongo Database
- make sure database is running
    `sudo systemctl status mongod`
- if not `sudo systemctl start mongod`

### connect to Mongo CLI
- `mongosh --port 27017`

### One in CLI will
- will see this on command line
`test>    `

- to enter database
`test> use ecommerce-app`
- will then see if successful
`ecommerce-app>   `

- To find a collection
`db.getCollection('products').find().pretty()`

- clear out databse
`db.dropDatabase()`