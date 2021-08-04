const mongoose = require('mongoose');

// mongoose.connect(process.env.MONGODB_URI, {  
//   dbName: process.env.DB_NAME,
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false,
//   useCreateIndex: true
// })
// .then((result) => {
//   // console.log(result)
//   console.log('mongodb connected.');
// })
// .catch(err => {
//   console.log(err.message);
// });


const connectionParams = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
}
mongoose.connect(uri, connectionParams)
  .then(() => {
    console.log('Connected to database on production...ls')
  })
  .catch((err) => {
    console.error(`Error connecting to the database. \n${err}`);
  })

// mongoose.connection.on('connected', () => {
//   console.log('Mongoose connected to db');
// });

// mongoose.connection.on('error', (err) => {
//   console.log(err.message);
// });

// mongoose.connection.on('disconneted', () => {
//   console.log('Mongoose connection is disconnected.')
// });

// process.on('SIGINT', async () => {
//   await mongoose.connection.close();
//   process.exit(0)
// });

// Connect to Cluster0
// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://<username>:<password>@cluster0.yjoup.gcp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });