const mongoose = require('mongoose')

const url = `mongodb+srv://laundry_phl:laundry-phl@cluster0.eoshw.mongodb.net/laundry_phl?retryWrites=true&w=majority`;

const connectionParams={
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}
mongoose.connect(url,connectionParams)
    .then( () => {
        console.log('Connected to database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })

    mongoose.Promise = global.Promise;