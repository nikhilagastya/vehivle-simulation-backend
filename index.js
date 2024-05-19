const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const DATA_FILE = './data.json';

// Utility functions
const readData = () => JSON.parse(fs.readFileSync(DATA_FILE));
const writeData = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

// Routes
app.get('/scenarios', (req, res) => {
  const data = readData();
  res.json(data.scenarios);
});

app.post('/scenarios', (req, res) => {
  const data = readData();
  const newScenario = req.body;
  data.scenarios.push(newScenario);
  writeData(data);
  res.status(201).json(newScenario);
});

app.put('/scenarios/:id', (req, res) => {
  const data = readData();
  const updatedScenario = req.body;
  const index = data.scenarios.findIndex(s => s.id === req.params.id);
  if (index !== -1) {
    data.scenarios[index] = updatedScenario;
    writeData(data);
    res.json(updatedScenario);
  } else {
    res.status(404).json({ error: 'Scenario not found' });
  }
});

app.delete('/scenarios/:id', (req, res) => {
  const data = readData();
  const index = data.scenarios.findIndex(s => s.id === req.params.id);
  if (index !== -1) {
    const deletedScenario = data.scenarios.splice(index, 1);
    writeData(data);
    res.json(deletedScenario);
  } else {
    res.status(404).json({ error: 'Scenario not found' });
  }
});

app.get('/vehicles/:scenarioId', (req, res) => {
  const data = readData();
  const scenario = data.scenarios.find(s => s.id === req.params.scenarioId);
  if (scenario) {
    res.json(scenario.vehicles || []);
  } else {
    res.status(404).json({ error: 'Scenario not found' });
  }
});

app.post('/vehicles/:scenarioId', (req, res) => {
  const data = readData();
  const scenario = data.scenarios.find(s => s.id === req.params.scenarioId);
  if (scenario) {
    const newVehicle = req.body;
    scenario.vehicles = scenario.vehicles || [];
    scenario.vehicles.push(newVehicle);
    writeData(data);
    res.status(201).json(newVehicle);
  } else {
    res.status(404).json({ error: 'Scenario not found' });
  }
});

app.put('/vehicles/:scenarioId/:vehicleId', (req, res) => {
  const data = readData();
  const scenario = data.scenarios.find(s => s.id === req.params.scenarioId);
  if (scenario) {
    const index = scenario.vehicles.findIndex(v => v.id === req.params.vehicleId);
    if (index !== -1) {
      scenario.vehicles[index] = req.body;
      writeData(data);
      res.json(req.body);
    } else {
      res.status(404).json({ error: 'Vehicle not found' });
    }
  } else {
    res.status(404).json({ error: 'Scenario not found' });
  }
});

app.delete('/vehicles/:scenarioId/:vehicleId', (req, res) => {
  const data = readData();
  const scenario = data.scenarios.find(s => s.id === req.params.scenarioId);
  if (scenario) {
    const index = scenario.vehicles.findIndex(v => v.id === req.params.vehicleId);
    if (index !== -1) {
      const deletedVehicle = scenario.vehicles.splice(index, 1);
      writeData(data);
      res.json(deletedVehicle);
    } else {
      res.status(404).json({ error: 'Vehicle not found' });
    }
  } else {
    res.status(404).json({ error: 'Scenario not found' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
