const express = require('express');
const bodyParser = require('body-parser');
const supabaseClient = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

const supabase = supabaseClient.createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

app.get('/', (req, res) => {
  res.sendFile('public/index.html', { root: __dirname });
});

// External API endpoint
app.get('/api/weather', async (req, res) => {
  const city = req.query.city;

  if (!city) {
    res.status(400).json({ message: 'City is required' });
    return;
  }

  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=imperial`;

  const response = await fetch(weatherUrl);
  const data = await response.json();

  res.json(data);
});

// Get saved locations from Supabase
app.get('/api/saved-locations', async (req, res) => {
  const { data, error } = await supabase
    .from('saved_locations')
    .select()
    .order('created_at', { ascending: false });

  if (error) {
    res.status(500).json(error);
  } else {
    res.json(data);
  }
});

// Save location to Supabase
app.post('/api/saved-locations', async (req, res) => {
  const city = req.body.city;

  if (!city) {
    res.status(400).json({ message: 'City is required' });
    return;
  }

  const { data, error } = await supabase
    .from('saved_locations')
    .insert({ city: city })
    .select();

  if (error) {
    res.status(500).json(error);
  } else {
    res.json(data);
  }
});

app.listen(port, () => {
  console.log(`App is available on port: ${port}`);
});

// Deleting saved locations
app.delete('/api/saved-locations', async (req, res) => {
  const { data, error } = await supabase
    .from('saved_locations')
    .delete()
    .not('id', 'is', null)
    .select();

  if (error) {
    console.log('Delete error:', error);
    res.status(500).json(error);
  } else {
    console.log('Deleted rows:', data);
    res.json({ message: 'Saved locations cleared!', deleted: data });
  }
});