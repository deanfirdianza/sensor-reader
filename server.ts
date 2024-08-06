// server.js
// src/server.ts

import express from 'express';
import mqtt from 'mqtt';

const app = express();
const port = 3000;

// Configure MQTT client
const mqttClient = mqtt.connect('mqtt://localhost:1884'); // Replace with your MQTT broker URL

// Store the latest state of each flag
const sensorState: { [flag: string]: number } = {};

// Handle incoming MQTT messages
mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker');
  mqttClient.subscribe('Yanmar-1345', (err) => {
    if (err) {
      console.error('Failed to subscribe to topic:', err);
    }
  });
});

mqttClient.on('message', (topic, message) => {
  if (topic === 'Yanmar-1345') {
    const data = JSON.parse(message.toString());
    handleSensorData(data);
  }
});

// Function to handle sensor data
const handleSensorData = (data: {
  sensorDatas: { flag: string; switcher: number }[];
  gateway_indentify: string;
  time: string;
  addTime: string;
  retransmit: string;
}) => {
  const { sensorDatas } = data;

  // init data perlu ada in case ketika mati
  sensorDatas.forEach(sensor => {
    const { flag, switcher } = sensor;
    
    if (sensorState[flag] !== undefined) {
      if (sensorState[flag] !== switcher) {
        console.log(`State changed for ${flag}: ${sensorState[flag]} -> ${switcher}`);
        console.log(`Data update to DB`);

        if (sensorState[flag] == 0 && switcher == 1) {
          console.log(`Qty tambah ke DB`);
        }
        // Handle the event where the object has passed the conveyor belt
      }
    } else {
      console.log(`Initial state for ${flag}: ${switcher}`);
    }

    // Update the state
    sensorState[flag] = switcher;
  });
};

// Start Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
