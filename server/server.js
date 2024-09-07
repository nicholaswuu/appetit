require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const admin = require('./firebaseAdmin');
const path = require('path');

const app = express();
app.use(express.json());

app.use(cors({ origin: 'http://localhost:3000' }));

const verifyFirebaseToken = async (req, res, next) => {
  const idToken = req.headers.authorization?.split(' ')[1];
  if (!idToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized', error });
  }
};

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const visitSchema = new mongoose.Schema({
  userId: String,
  rows: Array
});

const Visit = mongoose.model('Visit', visitSchema);

app.post('/api/visits/row', verifyFirebaseToken, async (req, res) => {
  const { row } = req.body;
  const userId = req.user.uid;

  try {
    let userVisit = await Visit.findOne({ userId });

    if (userVisit) {
      const existingRowIndex = userVisit.rows.findIndex(r => r.id === row.id);
      if (existingRowIndex !== -1) {
        userVisit.rows[existingRowIndex] = row;
      } else {
        userVisit.rows.push(row);
      }
    } else {
      userVisit = new Visit({ userId, rows: [row] });
    }

    await userVisit.save();
    res.status(200).json({ message: 'Row saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving row', error });
  }
});

app.get('/api/visits', verifyFirebaseToken, async (req, res) => {
  const userId = req.user.uid;

  try {
    const userVisit = await Visit.findOne({ userId });

    if (userVisit) {
      res.status(200).json(userVisit.rows);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving rows', error });
  }
});

app.delete('/api/visits/row/:id', verifyFirebaseToken, async (req, res) => {
  const userId = req.user.uid;
  const rowId = parseInt(req.params.id);

  try {
    let userVisit = await Visit.findOne({ userId });

    if (userVisit) {
      userVisit.rows = userVisit.rows.filter(row => row.id !== rowId);
      await userVisit.save();
      res.status(200).json({ message: 'Row deleted successfully' });
    } else {
      res.status(404).json({ message: 'User data not found' });
    }
  } catch (error) {
    console.error('Error deleting row:', error);
    res.status(500).json({ message: 'Error deleting row', error });
  }
});

app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
