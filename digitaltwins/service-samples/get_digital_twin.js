// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

const IoTHubTokenCredentials = require('azure-iot-digitaltwin-service').IoTHubTokenCredentials;
const DigitalTwinServiceClient  = require('azure-iot-digitaltwin-service').DigitalTwinServiceClient;

// Simple example of how to:
// - create a Digital Twin Service Client using the DigitalTwinServiceClient constructor
// - get the Digital Twin
// - list all the Digital Twin Components
async function main() {
  // IoT Hub connection string has to be set to system environment variable IOTHUB_CONNECTION_STRING
  // Twin enabled device must be exist on the IoT Hub
  const deviceId = '<DEVICE_ID_GOES_HERE>';
  
  // Create digital twin service client 
  const credentials = new IoTHubTokenCredentials(process.env.IOTHUB_CONNECTION_STRING);
  const digitalTwinServiceClient = new DigitalTwinServiceClient(credentials);

  // Get digital twin
  const digitalTwin = await digitalTwinServiceClient.getDigitalTwin(deviceId);

  // Print device capabilities
  console.log(JSON.stringify(digitalTwin, null, 2));

  // List components by name
  for (var digitalComponentName in digitalTwin.components) {
    console.log(JSON.stringify(digitalTwin.components[digitalComponentName]));
  }
};
  
main();