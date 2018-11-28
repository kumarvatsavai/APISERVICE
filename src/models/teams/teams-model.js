'use strict';

import Model from '../model.js';
import schema from './teams-schema.js';

class Teams extends Model {}

const teams = new Teams(schema);

export default teams;
