import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import jwt from 'jsonwebtoken';
import { Response } from 'superagent';
import { App } from '../../app';
import { Router } from '../../routes/payments/payments.route';
import { Repository as PaymentsRepository } from '../../routes/payments/payments.repository';
import { Repository as AuthRepository } from '../../routes/auth/auth.repository';
import * as paymentsMock from '../mocks/payments.mocks';
import * as authMock from '../mocks/auth.mocks';
import { Token } from '../../helpers/token';
import { Service } from '../../routes/payments/payments.service';
import { Controller } from '../../routes/payments/payments.controller';

chai.use(chaiHttp);
const { expect } = chai;

const service = new Service(AuthRepository, PaymentsRepository);
const token = new Token();
const controller = new Controller(service, token);
const router = new Router(controller);

const instance = new App();
instance.addRoute('/payments', router.router);

describe('test routes above /payments', () => {
  let res: Response;

  describe('tests GET /payments/me', () => {
    let tokenVerifyStub: sinon.SinonStub;
    let authModelFindFirstStub: sinon.SinonStub;
    let paymentsModelFindManyStub: sinon.SinonStub;

    beforeEach(() => {
      tokenVerifyStub = sinon.stub(token, 'verify');
      authModelFindFirstStub = sinon.stub(AuthRepository, 'findFirst');
      paymentsModelFindManyStub = sinon.stub(PaymentsRepository, 'findMany');
    });

    afterEach(sinon.restore);

    it('should work', async () => {
      tokenVerifyStub.resolves({ user: authMock.VALID_USER });
      authModelFindFirstStub.resolves(authMock.VALID_USER);
      paymentsModelFindManyStub.resolves([]);

      res = await chai
        .request(instance.app)
        .get('/payments/me')
        .set('authorization', 'Bearer 123.456.789');

      expect(res.status).to.equal(200);
    });

    it('should fail if user is not found', async () => {
      tokenVerifyStub.resolves({ user: authMock.VALID_USER });
      authModelFindFirstStub.resolves(null);

      res = await chai
        .request(instance.app)
        .get('/payments/me')
        .set('authorization', 'Bearer 123.456.789');

      expect(res.status).to.equal(404);
      expect(typeof res.body.error).to.equal('string');
    });
  });

  describe('tests POST /payments/me', () => {
    let tokenVerifyStub: sinon.SinonStub;
    let paymentsModelCreateStub: sinon.SinonStub;

    beforeEach(() => {
      tokenVerifyStub = sinon.stub(token, 'verify');
      paymentsModelCreateStub = sinon.stub(PaymentsRepository, 'create');
    });

    afterEach(sinon.restore);

    it('should work', async () => {
      tokenVerifyStub.resolves({ user: authMock.VALID_USER });
      paymentsModelCreateStub.resolves(paymentsMock.VALID_PAYMENT);

      res = await chai
        .request(instance.app)
        .post('/payments/me')
        .set('authorization', 'Bearer 123.456.789')
        .send(paymentsMock.VALID_PAYMENT);

      expect(res.status).to.equal(201);
      expect(res.body.id).to.equal(paymentsMock.VALID_PAYMENT.id);
    });
  });

  describe('tests patch /payments/me/:id', () => {
    let stubs: {
      token: {
        verify: sinon.SinonStub;
      };
      PaymentsRepository: {
        findFirst: sinon.SinonStub;
        update: sinon.SinonStub;
      };
    };

    beforeEach(() => {
      stubs = {
        token: {
          verify: sinon.stub(token, 'verify'),
        },
        PaymentsRepository: {
          findFirst: sinon.stub(PaymentsRepository, 'findFirst'),
          update: sinon.stub(PaymentsRepository, 'update')
        },
      };
    });

    afterEach(sinon.restore);

    it('should work', async () => {
      stubs.token.verify.resolves({ user: authMock.VALID_USER });
      stubs.PaymentsRepository.findFirst.resolves(paymentsMock.VALID_PAYMENT);
      stubs.PaymentsRepository.update.resolves(paymentsMock.VALID_PAYMENT);

      res = await chai
        .request(instance.app)
        .patch('/payments/me/1')
        .set('authorization', 'Bearer 123.456.789')
        .send(paymentsMock.VALID_PAYMENT);

      expect(res.status).to.equal(200);
      expect(res.body.id).to.equal(paymentsMock.VALID_PAYMENT.id);
    });

    it('should fail if payment doesnt exists', async () => {
      stubs.token.verify.resolves({ user: authMock.VALID_USER });
      stubs.PaymentsRepository.findFirst.resolves(null);

      res = await chai
        .request(instance.app)
        .patch('/payments/me/1')
        .set('authorization', 'Bearer 123.456.789')
        .send(paymentsMock.VALID_PAYMENT);

      expect(res.status).to.equal(404);
      expect(typeof res.body.error).to.equal('string');
    });

  });

  describe('tests delete /payments/me/:id', () => {
    let stubs: {
      token: {
        verify: sinon.SinonStub;
      };
      PaymentsRepository: {
        findFirst: sinon.SinonStub;
        deleteMany: sinon.SinonStub;
      };
    };

    beforeEach(() => {
      stubs = {
        token: {
          verify: sinon.stub(token, 'verify')
        },
        PaymentsRepository: {
          findFirst: sinon.stub(PaymentsRepository, 'findFirst'),
          deleteMany: sinon.stub(PaymentsRepository, 'deleteMany')
        }
      };
    });

    afterEach(sinon.restore);

    it('should work', async () => {
      stubs.token.verify.resolves({ user: authMock.VALID_USER });
      stubs.PaymentsRepository.findFirst.resolves(paymentsMock.VALID_PAYMENT);
      stubs.PaymentsRepository.deleteMany.resolves();

      res = await chai
        .request(instance.app)
        .delete('/payments/me/1')
        .set('authorization', 'Bearer 123.456.789');

      expect(res.status).to.equal(204);
    });

    it('should fail if payment doesnt exists', async () => {
      stubs.token.verify.resolves({ user: authMock.VALID_USER });
      stubs.PaymentsRepository.findFirst.resolves(null);
      stubs.PaymentsRepository.deleteMany.resolves();

      res = await chai
        .request(instance.app)
        .delete('/payments/me/1')
        .set('authorization', 'Bearer 123.456.789');

      expect(res.status).to.equal(404);
      expect(typeof res.body.error).to.equal('string');
    });
  });
});
