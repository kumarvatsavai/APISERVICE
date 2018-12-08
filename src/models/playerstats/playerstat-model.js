'use strict';

import Model from '../model.js';
import schema from './playerstat-schema.js';

class PlayerStats extends Model {

  find(query) {
    if(query){
      if(query._id){
        let _id = query && query._id;
        let queryObject = _id ? {_id} : {};
        return this.schema.find(queryObject);
      } else if (query.name) {
        let name = query && query.name;
        let queryObject = name ? {name} : {};
        return this.schema.find(queryObject);
      }
    }else { return this.schema.find()}
  }

}

const playerstats = new PlayerStats(schema);

export default playerstats;