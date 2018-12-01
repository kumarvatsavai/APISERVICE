'use strict';

import Model from '../model.js';
import schema from './playerstat-schema.js';

class PlayerStats extends Model {}

const playerstats = new PlayerStats(schema);

export default playerstats;