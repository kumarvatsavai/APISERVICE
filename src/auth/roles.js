'use strict';

import mongoose from 'mongoose';
require('mongoose-schema-jsonschema')(mongoose);

const rolesSchema = mongoose.Schema (
  {
    role: {type: String, required: true},
    capabilities: {type: Array, required:true},
  }
);

export default mongoose.model('roles', rolesSchema);
