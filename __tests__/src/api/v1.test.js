'use strict';

// dynamic? Maybe put this in an array an repeat all tests ...
process.env.STORAGE = 'mongo';

import jwt_decode from 'jwt-decode';

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

  it('it should return the record to /api/v1/playerstats with a correct record', () =>{
    let obj = {username:'jayjay',password:'123456',email:'jayjay@gmail.com'};
    return mockRequest
      .post('/signup')
      .send(obj)
      .then(results =>{
        let headers = {Authorization : `Bearer ${results.text}`};
        return mockRequest.get(`/api/v1/playerstats`)
          .set('Authorization', `Bearer ${results.text}`)
          .set('gzip', true)
          .then(data =>{
            let record = JSON.parse(data.text).results[0].name;
            expect(record).toBe('jayjay')
            expect(data.status).toBe(200);
          })
      })
  });

  it('it should return the correct player record to /api/v1/my/:model/:name with a correct record', () =>{
    let obj = {username:'jayjay2',password:'123456',email:'jayjay2@gmail.com'};
    return mockRequest
      .post('/signup')
      .send(obj)
      .then(results =>{
        let headers = {Authorization : `Bearer ${results.text}`};
        return mockRequest.get(`/api/v1/my/playerstats/jayjay2`)
          .set('Authorization', `Bearer ${results.text}`)
          .set('gzip', true)
          .then(data =>{
            let record = JSON.parse(data.text)[0].name;
            expect(record).toBe('jayjay2')
            expect(data.status).toBe(200);
          })
      })
  });

  it('it should get a correct record with ID /api/v1/:model/:id', () =>{
    let obj2 = {username:'johnny',password:'johnny',email:'johnny@gmail.com'};
    return mockRequest
      .post('/signup')
      .send(obj2)
      .then(results =>{
        let decodedToken = jwt_decode(results.text)
        console.log('DECODED TOKEN USERNAME',decodedToken.name)
        return mockRequest.get(`/api/v1/my/playerstats/${decodedToken.name}`)
          .set('Authorization', `Bearer ${results.text}`)
          .set('gzip', true)
          .then(data =>{
            // console.log('DATA',JSON.parse(data.text)[0],'BODY',data.body);
            let dataId = JSON.parse(data.text)[0]._id;
            return mockRequest.get(`/api/v1/playerstats/${dataId}`)
            .set('Authorization', `Bearer ${results.text}`)
            .set('gzip', true)
            .then(info =>{
              let userRecordTest = JSON.parse(info.text)[0].name;
              console.log ('INFORMATION', JSON.parse(info.text), 'BODY', data.body);
              expect(userRecordTest).toBe('johnny')
              expect(data.status).toBe(200);
            })
          })
      })
  });

  it('it delete a record using ID /api/v1/:model/:id', () =>{
    let obj2 = {username:'yoyo',password:'yoyo',email:'yoyo@gmail.com',role:'admin'};
    return mockRequest
      .post('/signup')
      .send(obj2)
      .then(results =>{
        let decodedToken = jwt_decode(results.text)
        console.log('DECODED TOKEN USERNAME',decodedToken.name)
        return mockRequest.get(`/api/v1/my/playerstats/${decodedToken.name}`)
          .set('Authorization', `Bearer ${results.text}`)
          .set('gzip', true)
          .then(data =>{
            let dataId = JSON.parse(data.text)[0]._id;
            return mockRequest.delete(`/api/v1/playerstats/${dataId}`)
            .set('Authorization', `Bearer ${results.text}`)
            .set('gzip', true)
            .then(info =>{
              expect(info.status).toBe(200);
            })
          })
      })
  });

  it('it should get the updated record after doing a PATCH ', () =>{
    let obj1 = {username:'andy',password:'andy',email:'andy@gmail.com'};
    let obj2 = {username:'andy123',password:'andy123',email:'andy123@gmail.com'};
    return mockRequest
      .post('/signup')
      .send(obj1)
      .then(results =>{
        let decodedToken = jwt_decode(results.text)
        console.log('DECODED TOKEN USERNAME',decodedToken.name)
        return mockRequest.get(`/api/v1/my/playerstats/${decodedToken.name}`)
          .set('Authorization', `Bearer ${results.text}`)
          .set('gzip', true)
          .then(data =>{
            let dataId = JSON.parse(data.text)[0]._id;
            return mockRequest.patch(`/api/v1/playerstats/${dataId}`)
            .send(obj2)
            .set('Authorization', `Bearer ${results.text}`)
            .set('gzip', true)
            .then(info =>{
              expect(info.status).toBe(200);
            })
          })
      })
  });

  it('it should be able to POST /api/v1/singlestat', () =>{
    let obj = {username:'jonjon',password:'jonjon',email:'jonjon@gmail.com'};
    let sendObject = {name:'jonjon',win:true};
    return mockRequest
      .post('/signup')
      .send(obj)
      .then(results =>{
        return mockRequest.post(`/api/v1/singlestat`)
          .send(sendObject)
          .set('Authorization', `Bearer ${results.text}`)
          .set('gzip', true)
          .then(data =>{
            expect(JSON.parse(data.text).name).toBe('jonjon');
            expect(JSON.parse(data.text).win).toBeTruthy;
            expect(data.status).toBe(200);
          })
      })
  });

});

