// server.js
// src/server.ts

import express from 'express';
import mqtt from 'mqtt';
import dotenv from "dotenv";
import * as production from './modules/production';
import { time } from 'console';
import { checkSensorRegistry, getAssemblyNameFromSensorKey } from './modules/sensor';
import * as item_requests from './modules/item-request';

dotenv.config();
const app = express();
const port = 3000;

// Configure MQTT client
const mqttClient = mqtt.connect(process.env.DSN_MQTT||'mqtt://localhost:1884'); // Replace with your MQTT broker URL
// process.env.

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
  const { sensorDatas, time } = data;

  sensorDatas.forEach(async sensor => {
    const { flag, switcher } = sensor;
    
    if (sensorState[flag] !== undefined) {
      if (sensorState[flag] !== switcher) {
        console.log(`State changed for ${flag}: ${sensorState[flag]} -> ${switcher}`);

        if (sensorState[flag] == 0 && switcher == 1) {
          // if flag == "REG001"
          if (checkSensorRegistry(flag)) {
            if (flag == 'REG001') {
              console.log("REG001 PROCESS");
              
              // REG001
              var production_plan_detail_id = await production.getProductionPlanDetail()
              if (production_plan_detail_id != null) {
                var timeInt = parseInt(time)
                var recordedTime: Date = new Date(timeInt*1000)
  
                var result = await production.setProductionActual(production_plan_detail_id, recordedTime)
                // console.log(`Production Actual : `, result)
              } else {
                // console.log(`Production Plan Detail Null`)
              }
            } else {
              console.log(`${flag} PROCESS`);
              // REG002 - REG026
              var pphIds = await production.getProductionPlanHeader()
              if (pphIds != null) {
                var assemblyName = getAssemblyNameFromSensorKey(flag)
                result = await item_requests.setItemRequestFromProductionSensorBatch(pphIds, assemblyName)
                // console.log(`Item Request Result : `, result)
              } else {
                console.log(`ppdIds null`);
              }
            }
          } else {
            // NON REGISTERED KEY
            console.log(`Key ${flag} not registered`);
          }
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
  console.log(`Server is running on port ${port}`);
});
