'use strict';

import Model from '../model.js';
import schema from './playerstat-schema.js';

class PlayerStats extends Model {

  find(query) {
    let name = query && query.name;
    let queryObject = name ? {name} : {};
    return this.schema.find(queryObject);
  }

}

const playerstats = new PlayerStats(schema);

export default playerstats;