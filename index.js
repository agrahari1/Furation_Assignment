const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const winston = require('winston');
const Item = require('./model/item');

const app = express();
const PORT = 8000;

// Database connection
mongoose.connect('mongodb://localhost/furationDatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });

// Middleware
app.use(bodyParser.json());
// app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.render('app is run proper'); // Serve the index.html file
});

// Retrieve all items
app.get('/api/items', (req, res) => {
  Item.find()
    .then((items) => {
      res.json(items);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Internal server error' });
    });
});

// Retrieve a specific item by ID
app.get('/api/items/:id', (req, res) => {
  const { id } = req.params;

  Item.findById(id)
    .then((item) => {
      if (!item) {
        res.status(404).json({ error: 'Item not found' });
      } else {
        res.json(item);
      }
    })
    .catch((error) => {
      res.status(500).json({ error: 'Internal server error' });
    });
});

// Create a new item
app.post('/api/items', (req, res) => {
  const { name, description, price } = req.body;

  if (!name || !price) {
    res.status(400).json({ error: 'Name and price are required' });
  } else {
    const newItem = new Item({ name, description, price });

    newItem.save()
      .then((item) => {
        res.status(201).json(item);
      })
      .catch((error) => {
        res.status(500).json({ error: 'Internal server error' });
      });
  }
});

// Update an existing item by ID
app.put('/api/items/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;

  if (!name || !price) {
    res.status(400).json({ error: 'Name and price are required' });
  } else {
    Item.findByIdAndUpdate(id, { name, description, price }, { new: true })
      .then((item) => {
        if (!item) {
          res.status(404).json({ error: 'Item not found' });
        } else {
          res.json(item);
        }
      })
      .catch((error) => {
        res.status(500).json({ error: 'Internal server error' });
      });
  }
});

// Delete an item by ID
app.delete('/api/items/:id', (req, res) => {
  const { id } = req.params;

  Item.findByIdAndDelete(id)
    .then((item) => {
      if (!item) {
        res.status(404).json({ error: 'Item not found' });
      } else {
        res.sendStatus(204);
      }
    })
    .catch((error) => {
      res.status(500).json({ error: 'Internal server error' });
    });
});

// Implement error logging using Winston
const logger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log' }),
  ],
});

app.use((err, req, res, next) => {
  logger.error(err.stack);
  next(err);
});

// Pagination concept
app.get('/api/items', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const count = await Item.countDocuments();
    const totalPages = Math.ceil(count / limit);
    const offset = (page - 1) * limit;

    const items = await Item.find()
      .skip(offset)
      .limit(limit);

    res.json({
      items,
      page,
      totalPages,
    });
  } catch (error) {
    logger.error('Failed to retrieve items', error);
    res.status(500).json({ error: 'Failed to retrieve items' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
