/* eslint-env jest */
const session = require('supertest-session')
const models = require('../models')
const { ApiError } = require('../api/util')

module.exports.TOKEN = '3b0886cd-84ef-4702-8016-cfa7e20418f9'

module.exports.setupTestDb = async () => {
  await models.sequelize.sync()
}

module.exports.destroyTestDb = async () => {
  await models.sequelize.drop()
}

module.exports.createTestUsers = async () => {
  await models.User.bulkCreate([
    { netid: 'dev', isAdmin: true },
    { netid: 'admin', universityName: 'Admin', isAdmin: true },
    { netid: '225staff', universityName: '225 Staff', isAdmin: false },
    { netid: '241staff', universityName: '241 Staff', isAdmin: false },
    { netid: 'student', isAdmin: false },
    { netid: 'otherstudent', isAdmin: false },
  ])
}

module.exports.createTestTokens = async () => {
  // Hash is for the following UUID:
  // 3b0886cd-84ef-4702-8016-cfa7e20418f9
  await models.AccessToken.bulkCreate([
    {
      name: 'Admin test token',
      hash: '8b66be9b382176ea802a06d1be2a5e66d53fadf279a5fc40e17c6862c75d4e0f',
      userId: 2,
    },
  ])
}

module.exports.createTestCourses = async () => {
  await models.Course.bulkCreate([{ name: 'CS225' }, { name: 'CS241' }])
}

module.exports.createTestQueues = async () => {
  await models.Queue.bulkCreate([
    {
      name: 'CS225 Queue',
      location: 'Here',
      courseId: 1,
      createdAt: '2019-10-05 22:05:41.000 +00:00',
    },
    {
      name: 'CS241 Queue',
      location: 'There',
      courseId: 2,
      createdAt: '2019-10-05 22:10:41.000 +00:00',
    },
    {
      name: 'CS225 Fixed Location',
      fixedLocation: true,
      location: 'Everywhere',
      courseId: 1,
      createdAt: '2019-10-05 22:15:41.000 +00:00',
    },
    {
      name: 'CS225 Closed',
      open: false,
      location: 'Everywhere',
      courseId: 1,
      createdAt: '2019-10-05 22:25:41.000 +00:00',
    },
    {
      name: 'CS225 Confidential Queue',
      fixedLocation: false,
      location: 'Everywhere',
      isConfidential: true,
      messageEnabled: true,
      courseId: 1,
      createdAt: '2019-10-05 22:35:41.000 +00:00',
    },
  ])
}

module.exports.createTestQuestions = async () => {
  await models.Question.bulkCreate([
    {
      queueId: 1,
      name: 'Nathan',
      location: 'Siebel',
      topic: 'Queue',
      askedById: 2,
    },
    {
      queueId: 1,
      name: 'Jordi',
      location: 'ECEB',
      topic: 'Canada',
      askedById: 5,
    },
    {
      queueId: 3,
      name: 'Arman',
      location: '',
      topic: 'Sauce',
      askedById: 2,
    },
    {
      queueId: 5,
      name: 'Student',
      location: '',
      topic: 'Secret',
      askedById: 5,
    },
    {
      queueId: 5,
      name: 'Other Student',
      location: '',
      topic: 'Secret',
      askedById: 6,
    },
  ])
}

module.exports.populateTestDb = async () => {
  await module.exports.createTestUsers()
  await module.exports.createTestTokens()
  await module.exports.createTestCourses()

  const staff225 = await models.User.findOne({ where: { netid: '225staff' } })
  await staff225.addStaffAssignment(1)

  const staff241 = await models.User.findOne({ where: { netid: '241staff' } })
  await staff241.addStaffAssignment(2)

  await module.exports.createTestQueues()
  await module.exports.createTestQuestions()
}

module.exports.requestAsUser = async (app, user) => {
  const testSession = session(app)
  await testSession.post('/login/dev').send({ netid: user })
  return testSession
}

module.exports.expectNextCalledWithApiError = (next, statusCode) => {
  expect(next).toHaveBeenCalledTimes(1)
  const arg = next.mock.calls[0][0]
  expect(arg).toBeInstanceOf(ApiError)
  expect(arg.httpStatusCode).toEqual(statusCode)
}
