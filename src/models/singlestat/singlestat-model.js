'use strict';

import Model from '../model.js';
import schema from './singlestat-schema.js';

class SingleStat extends Model {}

const singlestat = new SingleStat(schema);

export default singlestat;