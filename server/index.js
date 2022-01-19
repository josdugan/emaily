const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
require('./models/user');
require('./services/passport');
const authRoutes = require('./routes/authRoutes');
const billingRoutes = require('./routes/billingRoutes');
const keys = require('./config/keys');

mongoose.connect(keys.mongoURI);

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey],
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(authRoutes);
app.use(billingRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const start = () => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    console.log('GOOGLE_CLIENT_ID must be set');
  }
  if (!process.env.GOOGLE_CLIENT_SECRET) {
    console.log('GOOGLE_CLIENT_SECRET must be set');
  }
  if (!process.env.MONGO_URI) {
    console.log('MONGO_URI must be set');
  }
  if (!process.env.COOKIE_KEY) {
    console.log('COOKIE_KEY must be set');
  }

  app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
  });
};

start();
