const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://sodharmendra74:sodharmendra74@cluster300.zool2ru.mongodb.net/?retryWrites=true&w=majority/interview', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const interviewSchema = new mongoose.Schema({
  name: String,
  role: String,
  date: Date,
  location: String,
  history: [
    {
      action: String, // Action performed (e.g., "Rescheduled", "Canceled")
      date: Date,      // Date of the action
    },
  ],
});

const Interview = mongoose.model('Interview', interviewSchema);


const insertDummyData = async () => {
  try {
    await Interview.insertMany([
      {
        name: 'John',
        role: 'Software Engineer',
        date: new Date('2023-03-29T03:00:00Z'),
      },
      {
        name: 'Alice',
        role: 'Data Scientist',
        date: new Date('2023-03-29T03:00:00Z'),
      },
      {
        name: 'Bob',
        role: 'UX',
        date: new Date('2023-03-29T03:00:00Z'),
      },
      // Add more dummy data as needed
      {
        name: 'Emily',
        role: 'Product Manager',
        date: new Date('2023-03-29T03:00:00Z'),
      },
      {
        name: 'Michael',
        role: 'Frontend Developer',
        date: new Date('2023-03-29T03:00:00Z'),
      },
      {
        name: 'Sara',
        role: 'Backend Developer',
        date: new Date('2023-03-29T03:00:00Z'),
      },
    ]);
    console.log('Dummy data inserted successfully.');
  } catch (error) {
    console.error('Error inserting dummy data:', error);
  }
};


insertDummyData();

app.get('/api/interviews', async (req, res) => {
  try {
    const interviews = await Interview.find({ date: { $gte: new Date() } }).sort('date');
    res.json(interviews);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/interviews/today', async (req, res) => {
  const today = new Date(Date.now());
  today.setHours(0,0,0,0)
  const tomorrow = new Date(Date.now())
  tomorrow.setHours(0,0,0,0)
  tomorrow.setDate(tomorrow.getDate()+1)
  try {
    const interviewsToday = await Interview.find({ date: {$gte:today, $lt:tomorrow} }).sort('date');
    res.json(interviewsToday);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/api/interviews/tomorrow', async (req, res) => {
  const today = new Date(Date.now());
  today.setHours(0,0,0,0)
  const tomorrow = new Date(Date.now())
  tomorrow.setHours(0,0,0,0)
  tomorrow.setDate(tomorrow.getDate()+1)

  try {
    const interviewsTomorrow = await Interview.find({ date: {$gt:today, $lte:tomorrow} }).sort('date');
    res.json(interviewsTomorrow);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/interviews/other', async (req, res) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  try {
    const interviewsOther = await Interview.find({ date: { $gte: tomorrow } }).sort('date');
    res.json(interviewsOther);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/interviews/history/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const interview = await Interview.findById(id);
    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    res.json(interview.history);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/interviews', async (req, res) => {
  const { name, role, date } = req.body;

  try {
    const isValidDate = !isNaN(new Date(date).valueOf());

    if (!isValidDate) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    const newInterview = new Interview({ name, role, date });
    await newInterview.save();
    res.json(newInterview);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.put('/api/interviews/:id', async (req, res) => {
  const { id } = req.params;
  const { date } = req.body;

  try {
    const updatedInterview = await Interview.findByIdAndUpdate(id, { date }, { new: true });
    res.json(updatedInterview);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/api/interviews/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Interview.findByIdAndDelete(id);
    res.json({ message: 'Interview canceled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
