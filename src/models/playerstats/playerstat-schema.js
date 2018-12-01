'use strict';

import mongoose from 'mongoose';
require('mongoose-schema-jsonschema')(mongoose);

const playerstats = mongoose.Schema({
  name: { type:String, required:true, unique:true}, // one per player
  wins: {type:Number, default:0}, // count 
  losses: {type:Number, default:0}, // count
});

export default mongoose.model('playerstats',playerstats);