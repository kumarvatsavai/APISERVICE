'use strict';

import mongoose from 'mongoose';
require('mongoose-schema-jsonschema')(mongoose);
import playerstats from '../models/playerstats/playerstat-schema';

import express from 'express';

const authRouter = express.Router();

import User from './model.js';
import Role from './roles-schema.js';
import auth from './middleware.js';
import oauth from './lib/oauth.js';

let sendJSON = (data,response) => {
  response.statusCode = 200;
  response.statusMessage = 'OK';
  response.setHeader('Content-Type', 'application/json');
  response.write( JSON.stringify(data) );
  response.end();
};

authRouter.post('/signup', (req, res, next) => {
  let user = new User(req.body);
  let userStats = new playerstats({name:req.body.username, wins: 0, losses: 0});
  user.save()
    .then( (user) => {
      userStats.save();
      req.token = user.generateToken();
      req.user = user;
      res.cookie('auth', req.token);
      res.send(req.token);
    }).catch(next);
});

authRouter.post('/signin', auth(), (req, res, next) => {
  res.cookie('auth', req.token);
  res.send(req.token);
});

authRouter.get('/oauth', (req, res, next) => {
  oauth.authorize(req)
    .then((token) => {
      res.cookie('auth', token);
      res.send(token);
    })
    .catch(next);
});

authRouter.post('/role', (req, res, next) => {

  let capabilities = req.body.capabilities;

  let role = new Role({role:req.body.role, capabilities:capabilities});

  role.save()
    .then( results => {
      console.log('Saved role - results: ', results);
      sendJSON(results, res);
    })
    .catch( next );
});

export default authRouter;
