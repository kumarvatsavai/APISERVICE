'use strict';

// dynamic? Maybe put this in an array an repeat all tests ...
process.env.STORAGE = 'mongo';

import {server} from '../../../src/app.js';

import supergoose, { startDB, stopDB } from '../../supergoose.js';

const mockRequest = supergoose(server);

beforeAll(startDB);
afterAll(stopDB);

// Unmock our model (might have been mocked by a previous test)
jest.unmock('require-directory');

describe('api server', () => {

  it('should respond with a 500 on an invalid model', () => {

    return mockRequest
      .get('/booboo')
      .then(results => {
        expect(results.status).toBe(404);
      })
      .catch(err => {
        expect(err).not.toBeDefined();
      });

  });

  it('should respond with a 404 on an invalid method', () => {

    return mockRequest
      .post('/api/v1/foo/12')
      .then(results => {
        expect(results.status).toBe(404);
      })
      .catch(err => {
        expect(err).not.toBeDefined();
      });

  });

  it('should be unable to post to /api/v1/singlestat without auth', ()  => {

    let obj = {win:'false', name:'person'};

    return mockRequest
      .post('/api/v1/singlestat')
      .send(obj)
      .then(results => {
        expect(results.status).toBe(401);
        expect(results.body.name).toBeUndefined();
      })
      .catch( err => console.error('err', err) );

  });


  it('following a post, should not find a record without auth', () => {

    let obj = {win:'true', name:'personTwo'};

    return mockRequest
      .post('/api/v1/singlestat')
      .send(obj)
      .then(results => {
        return mockRequest.get(`/api/v1/playerstat/${results.body.name}`)
          .then(list => {
            expect(list.body.name).toBeUndefined();
            expect(list.status).toBe(500);
          });
      })
      .catch( err => console.error('err', err) );

  });

});


