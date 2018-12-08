'use strict';

import Model from '../model.js';
import schema from './singlestat-schema.js';

class SingleStat extends Model {

  find(query) {
    let name = query && query.name;
    let queryObject = name ? {name} : {};
    return this.schema.find(queryObject);
  }
  
}

const singlestat = new SingleStat(schema);

export default singlestat;