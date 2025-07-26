const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();
const expect = chai.expect;
const Student = require('../models/Student');

chai.use(chaiHttp);

describe('Student Management API', () => {
  before((done) => {
    // Clear the test database before running tests
    Student.deleteMany({}, (err) => {
      done();
    });
  });

  describe('POST /api/students', () => {
    it('should create a new student', (done) => {
      const student = {
        nic: '123456789V',
        name: 'Test Student',
        email: 'test@student.com',
        phone: '0712345678',
        address: '123 Test St',
        course: 'Computer Science',
        year: 2
      };
      chai.request(server)
        .post('/api/students')
        .send(student)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('nic').eql(student.nic);
          done();
        });
    });

    it('should not create a student with existing NIC', (done) => {
      const student = {
        nic: '123456789V',
        name: 'Duplicate Student',
        email: 'dup@student.com',
        phone: '0712345679',
        address: '456 Test St',
        course: 'Engineering',
        year: 3
      };
      chai.request(server)
        .post('/api/students')
        .send(student)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message').eql('Student with this NIC already exists');
          done();
        });
    });
  });

  describe('GET /api/students/:nic', () => {
    it('should get a student by NIC', (done) => {
      chai.request(server)
        .get('/api/students/123456789V')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('nic').eql('123456789V');
          done();
        });
    });

    it('should return 404 for non-existing student', (done) => {
      chai.request(server)
        .get('/api/students/nonexistent')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('message').eql('Student not found');
          done();
        });
    });
  });

  describe('PATCH /api/students/:nic', () => {
    it('should update a student by NIC', (done) => {
      const updateData = { name: 'Updated Name' };
      chai.request(server)
        .patch('/api/students/123456789V')
        .send(updateData)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('name').eql('Updated Name');
          done();
        });
    });

    it('should return 404 when updating non-existing student', (done) => {
      chai.request(server)
        .patch('/api/students/nonexistent')
        .send({ name: 'Name' })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('message').eql('Student not found');
          done();
        });
    });
  });

  describe('DELETE /api/students/:nic', () => {
    it('should delete a student by NIC', (done) => {
      chai.request(server)
        .delete('/api/students/123456789V')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').eql('Student deleted successfully');
          done();
        });
    });

    it('should return 404 when deleting non-existing student', (done) => {
      chai.request(server)
        .delete('/api/students/nonexistent')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('message').eql('Student not found');
          done();
        });
    });
  });
});
