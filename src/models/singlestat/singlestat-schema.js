'use strict';

import mongoose from 'mongoose';
require('mongoose-schema-jsonschema')(mongoose);

import playerstats from '../playerstats/playerstat-schema';

// Incoming data from game server
const singlestat = mongoose.Schema({
  name: { type:String, required:true},
  win: {type:Boolean},
});

singlestat.post('save', function(next) {

  return playerstats.find({name: this.name})
    .then(results => {

      let myPlayerStats = results[0];

      let data = {};

      if (myPlayerStats === undefined) {

        myPlayerStats = new playerstats({name: this.name, wins: 0, losses: 0});

        if (this.win) {
          data.wins =  1;
        }
        else {
          data.losses = 1;
        }
      }
      else {
        if (this.win) {
          let newWinTotal = myPlayerStats.wins + 1;
          data.wins =  newWinTotal;
        }
        else {
          let newLossTotal = myPlayerStats.losses + 1;
          data.losses = newLossTotal;
        }
      }

      myPlayerStats = Object.assign(myPlayerStats,data);

      return myPlayerStats.save(data)
        .then(results => {
          console.log('results from saving myPlayerStats: ', results);
        })
        .catch(next);
    });
});

export default mongoose.model('singlestat',singlestat);