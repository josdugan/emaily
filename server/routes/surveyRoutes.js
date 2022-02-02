const express = require('express');
const _ = require('lodash');
const mongoose = require('mongoose');
const Path = require('path-parser');
const { URL } = require('url');
const requireCredits = require('../middleware/requireCredits');
const requireLogin = require('../middleware/requireLogin');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const router = express.Router();
const Survey = mongoose.model('surveys');

router.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
  const { title, subject, body, recipients } = req.body;

  const survey = new Survey({
    title,
    body,
    subject,
    recipients: recipients
      .split(',')
      .map((recipient) => ({ email: recipient.trim() })),
    _user: req.user.id,
    dateSent: Date.now(),
  });

  const mailer = new Mailer(survey, surveyTemplate(survey));

  try {
    await mailer.send();

    await survey.save();

    req.user.credits -= 1;
    const user = await req.user.save();

    res.send(user);
  } catch (err) {
    res.status(422).send(err);
  }
});

router.post('/api/surveys/webhooks', (req, res) => {
  const p = new Path('/api/surveys/:surveyId/:choice');

  const events = req.body
    .map(({ url, email }) => {
      const pathname = new URL(event.url).pathname;
      const match = p.test(pathname);
      if (match) {
        const { surveyId, choice } = match;
        return { email, surveyId, choice };
      }
    })
    .filter((event) => !!event);

  _.uniqBy(events, 'email', 'surveyId').forEach(
    ({ surveyId, email, choice }) => {
      Survey.updateOne(
        {
          _id: surveyId,
          recipients: {
            $elemMatch: { email, responded: false },
          },
        },
        {
          $inc: { [choice]: 1 },
          $set: { 'recipients.$.responsded': true },
          lastResponded: new Date(),
        }
      ).exec();
    }
  );

  res.send({});
});

router.get('/api/surveys/:surveyId/:choice', (req, res) => {
  res.send('Thanks for voting!');
});

router.get('/api/surveys', requireLogin, async (req, res) => {
  const surveys = await Survey.find({ _user: req.user.id }).select({
    recipients: false,
  });

  res.send(surveys);
});

module.exports = router;
