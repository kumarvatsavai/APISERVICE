'use strict';

import mongoose from 'mongoose';
require('mongoose-schema-jsonschema')(mongoose);

// Incoming data from game server
const singlestat = mongoose.Schema({
  name: { type:String, required:true},
  win: {type:Boolean},
});


// transform input data to the aggregate -- this will be for the put/patch playerStat
// singleStat.pre('save', function(next) {
//   console.log("PRESAVE PlayerStats THIS: ", this)
//     .then(results => {

//       next();
//     })
//     .catch( error => {throw error;} );
// });
export default mongoose.model('singlestat',singlestat);