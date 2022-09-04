import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import jwt from 'jsonwebtoken';
import { Response } from 'superagent';
import { App } from '../../app';
import { Router } from '../../routes/auth/auth.route';
import { Repository as AuthRepository } from '../../routes/auth/auth.repository';
import * as mock from '../mocks/auth.mocks';
import { Passwords } from '../../helpers/password';

import { Service } from '../../routes/auth/auth.service';
import { Controller } from '../../routes/auth/auth.controller';

const passwords = new Passwords();

const service = new Service(AuthRepository, passwords);
const controller = new Controller(service);
const { router } = new Router(controller);

chai.use(chaiHttp);
const { expect } = chai;

const instance = new App();
instance.addRoute('/auth', router);

describe('test routes above /auth', () => {
  let res: Response;
  let findFirstUserStub: sinon.SinonStub;
  let createUserStub: sinon.SinonStub;
  let tokenVerifyStub: sinon.SinonStub;

  describe('tests /auth/login', () => {
    beforeEach(() => {
      findFirstUserStub = sinon.stub(AuthRepository, 'findFirst');
    });

    afterEach(() => {
      findFirstUserStub.restore();
    });

    it('should work', async () => {
      const body = {
        username: mock.VALID_USER.username,
        password: mock.VALID_USER.password,
      };

      findFirstUserStub.resolves({
        ...mock.VALID_USER,
        password: passwords.encodeSync(body.password)
      });

      res = await chai
        .request(instance.app)
        .post('/auth/login')
        .send(body);

      expect(res.status).to.equal(200);
      expect(typeof res.body.token).to.equal('string');
      expect(typeof res.body.user.id).to.equal('string');
      expect(typeof res.body.user.email).to.equal('string');
      expect(typeof res.body.user.username).to.equal('string');
    });

    it('should fail if user is not found', async () => {
      const body = {
        username: mock.VALID_USER.username,
        password: mock.VALID_USER.password,
      };

      findFirstUserStub.resolves(null);

      res = await chai
        .request(instance.app)
        .post('/auth/login')
        .send(body);

      expect(res.status).to.equal(404);
      expect(res.body.error).to.equal('Usuário ou senha incorreta');
    });

    it('should fail if the password is invalid', async () => {
      const body = {
        username: mock.VALID_USER.username,
        password: mock.VALID_USER.password,
      };

      findFirstUserStub.resolves({
        ...mock.VALID_USER,
        password: 'incorrect-password',
      });

      res = await chai
        .request(instance.app)
        .post('/auth/login')
        .send(body);

      expect(res.status).to.equal(404);
      expect(res.body.error).to.equal('Usuário ou senha incorreta');
    });

    it('should fail if body is incorrect', async () => {
      const body = {
        username: mock.VALID_USER.username,
      };

      res = await chai
        .request(instance.app)
        .post('/auth/login')
        .send(body);

      expect(res.status).to.equal(400);
      expect(typeof res.body.error).to.equal('string');
    });

  });

  describe('tests /auth/register', () => {
    beforeEach(() => {
      findFirstUserStub = sinon.stub(AuthRepository, 'findFirst');
      createUserStub = sinon.stub(AuthRepository, 'create');
    });

    afterEach(() => {
      findFirstUserStub.restore();
      createUserStub.restore();
    });

    it('should work', async () => {
      findFirstUserStub.resolves(null);
      createUserStub.resolves(mock.VALID_USER);

      res = await chai
        .request(instance.app)
        .post('/auth/register')
        .send(mock.VALID_USER);

      expect(res.status).to.equal(201);
      expect(typeof res.body.token).to.equal('string');
      expect(typeof res.body.user.id).to.equal('string');
      expect(typeof res.body.user.email).to.equal('string');
      expect(typeof res.body.user.username).to.equal('string');
    });

    it('should fail if user already exists', async () => {
      findFirstUserStub.resolves(mock.VALID_USER);

      res = await chai
        .request(instance.app)
        .post('/auth/register')
        .send(mock.VALID_USER);

      expect(res.status).to.equal(409);
      expect(typeof res.body.error).to.equal('string');
    });
  });

  describe('tests /auth/verify', () => {
    beforeEach(() => {
      tokenVerifyStub = sinon.stub(jwt, 'verify');
    });

    afterEach(() => {
      tokenVerifyStub.restore();
    });

    it('should work', async () => {
      tokenVerifyStub.resolves(mock.VALID_USER);

      res = await chai
        .request(instance.app)
        .get('/auth/verify')
        .set('authorization', 'Bearer 123.456.789');

      expect(res.status).to.equal(200);
    });

    it('should throw if token is invalid', async () => {
      tokenVerifyStub.throws();

      res = await chai
        .request(instance.app)
        .get('/auth/verify')
        .set('authorization', 'Bearer 123.456.789');

      expect(res.status).to.equal(400);
      expect(typeof res.body.error).to.equal('string');
    });
  });
});
