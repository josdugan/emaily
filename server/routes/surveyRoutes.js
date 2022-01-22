const express = require('express');
const mongoose = require('mongoose');
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

router.get('/api/surveys/thanks', (req, res) => {
  res.send('Thanks for voting!');
});

module.exports = router;
