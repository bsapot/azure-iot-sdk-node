/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 */

 var assert = require('chai').assert;
 var sinon = require('sinon');
 var DigitalTwinServiceClient = require('../dist/cl/digital_twin_service_client').DigitalTwinServiceClient;

 var testCredentials = {
    signRequest: sinon.stub().callsFake(function(webResource) {
        return Promise.resolve(webResource);
    }),
    getHubName: sinon.stub().returns('fake.host.name')
 }

 describe('DigitalTwinServiceClient', function () {

  /*Test_SRS_NODE_DIGITAL_TWIN_SERVICE_CLIENT_12_001: [The `DigitalTwinServiceClient` creates an instance of the DigitalTwinServiceClient passing IoTHubTokenCredentials class as an argument.]*/
  it(`Constructor creates an instance of the DigitalTwinServiceClient`, function(testCallback) {
    var digitalTwinServiceClient = new DigitalTwinServiceClient(testCredentials);
    assert.instanceOf(digitalTwinServiceClient, DigitalTwinServiceClient);
    testCallback();
  });

  /*Test_SRS_NODE_DIGITAL_TWIN_SERVICE_CLIENT_12_002: [The `getDigitalTwin` method shall call the `getInterfaces` method of the protocol layer with the given argument.]*/
  /*Test_SRS_NODE_DIGITAL_TWIN_SERVICE_CLIENT_12_003: [The `getDigitalTwin` method shall call the callback with an error parameter if a callback is passed..]*/
  it('getDigitalTwin calls the getInterfaces method on the PL client', function (testCallback) {
    var testTwinId = 'digitalTwinId';``
    var testDigitalTwin = {
      components: {
        testComponentName: {}
      },
      response: undefined
    };
    var testClient = new DigitalTwinServiceClient(testCredentials);
    testClient._pl.digitalTwin.getInterfaces = sinon.stub().callsArgWith(1, null, testDigitalTwin);
    testClient.getDigitalTwin(testTwinId, function (err, result, response) {
      assert.isTrue(testClient._pl.digitalTwin.getInterfaces.calledWith(testTwinId));
      assert.isNull(err);
      assert.deepEqual(result.interfaces, testDigitalTwin.interfaces);
      assert.deepEqual(result.response, testDigitalTwin.response);
      testCallback();
    });
  });

  /*Test_SRS_NODE_DIGITAL_TWIN_SERVICE_CLIENT_12_004: [The `getDigitalTwin` method shall return error if the method of the protocol layer failed.]*/
  it('getDigitalTwin calls its callback with an error if the PL client fails', function (testCallback) {
    var testTwinId = 'digitalTwinId';
    var testError = new Error('fake error');
    var testClient = new DigitalTwinServiceClient(testCredentials);
    testClient._pl.digitalTwin.getInterfaces = sinon.stub().callsArgWith(1, testError);
    testClient.getDigitalTwin(testTwinId, function (err) {
      assert.isTrue(testClient._pl.digitalTwin.getInterfaces.calledWith(testTwinId));
      assert.strictEqual(err, testError);
      testCallback();
    });
  });

  /*Test_SRS_NODE_DIGITAL_TWIN_SERVICE_CLIENT_12_020: [The `getDigitalTwin` method shall return a promise if there is no callback passed.]*/
  it('getDigitalTwin shall return a promise if there is no callback passed', async () => {
    var testTwinId = 'digitalTwinId';
    var testDigitalTwin = {
      components: {
        testComponentName: {}
      }
    };
    var testClient = new DigitalTwinServiceClient(testCredentials);
    testClient._pl.digitalTwin.getInterfaces = sinon.stub().callsArgWith(1, null, testDigitalTwin);
    const returnedPromise = await testClient.getDigitalTwin(testTwinId);
    assert.deepEqual(returnedPromise.interfaces, testDigitalTwin.interfaces);
    assert.deepEqual(returnedPromise.response, testDigitalTwin.response);
  });

  /*Test_SRS_NODE_DIGITAL_TWIN_SERVICE_CLIENT_12_005: [The `getDigitalTwinComponent` method shall call the `getInterface` method of the protocol layer with the given arguments.]*/
  /*Test_SRS_NODE_DIGITAL_TWIN_SERVICE_CLIENT_12_006: [The `getDigitalTwinComponent` method shall call the callback with an error parameter if a callback is passed..]*/
  it('getDigitalTwinComponent calls getInterface on the PL client', function (testCallback) {
    var testTwinId = 'digitalTwinId';
    var testDigitalTwin = {
      interfaces: {
        testComponentName: {}
      }
    };
    var expectedTestDigitalTwin = {
      components: {
        testComponentName: {}
      }
    };
    var testComponentName = 'testComponentName';
    var testClient = new DigitalTwinServiceClient(testCredentials);
    testClient._pl.digitalTwin.getInterface = sinon.stub().callsArgWith(2, null, testDigitalTwin);
    testClient.getDigitalTwinComponent(testTwinId, testComponentName, function (err, result) {
      assert.isTrue(testClient._pl.digitalTwin.getInterface.calledWith(testTwinId, testComponentName));
      assert.isNull(err);
      assert.deepEqual(result, expectedTestDigitalTwin);
      testCallback();
    });
  });

  /*Test_SRS_NODE_DIGITAL_TWIN_SERVICE_CLIENT_12_007: [The `getDigitalTwinComponent` method shall return error if the method of the protocol layer failed.]*/
  it('getDigitalTwinComponent calls its callback with an error if the PL client fails', function (testCallback) {
    var testTwinId = 'digitalTwinId';
    var testError = new Error('fake error');
    var testComponentName = 'testComponentName';
    var testClient = new DigitalTwinServiceClient(testCredentials);
    testClient._pl.digitalTwin.getInterface = sinon.stub().callsArgWith(2, testError);
    testClient.getDigitalTwinComponent(testTwinId, testComponentName, function (err, result) {
      assert.isTrue(testClient._pl.digitalTwin.getInterface.calledWith(testTwinId, testComponentName));
      assert.strictEqual(err, testError);
      testCallback();
    });
  });

  /*Test_SRS_NODE_DIGITAL_TWIN_SERVICE_CLIENT_12_021: [The `getDigitalTwinComponent` method shall return a promise if there is no callback passed.]*/
  it('getDigitalTwinComponent shall return a promise if there is no callback passed', async () => {
    var testTwinId = 'digitalTwinId';
    var testDigitalTwin = {
      interfaces: {
        testComponentName: {}
      }
    };
    var testComponentName = 'testComponentName';
    var testClient = new DigitalTwinServiceClient(testCredentials);
    testClient._pl.digitalTwin.getInterface = sinon.stub().callsArgWith(2, null, testDigitalTwin.interfaces);
    const returnedPromise = await testClient.getDigitalTwinComponent(testTwinId, testComponentName);
    assert.isNotNull(returnedPromise);
  });

  /*Test_SRS_NODE_DIGITAL_TWIN_SERVICE_CLIENT_12_008: [The `getDigitalTwinModel` method shall call the `getDigitalTwinModel` method of the protocol layer with the given argument.]*/
  /*Test_SRS_NODE_DIGITAL_TWIN_SERVICE_CLIENT_12_009: [The `getDigitalTwinModel` method shall call the callback with an error parameter if a callback is passed..]*/
  it('getDigitalTwinModel calls getDigitalTwinModel on the PL client', function (testCallback) {
    var testModelId = 'modelId';
    var testDigitalTwinModel = {
      body: 42,
    };
    var testClient = new DigitalTwinServiceClient(testCredentials);
    testClient._pl.digitalTwin.getDigitalTwinModel = sinon.stub().callsArgWith(1, null, testDigitalTwinModel);
    testClient.getModel(testModelId, function (err, result) {
      assert.isTrue(testClient._pl.digitalTwin.getDigitalTwinModel.calledWith(testModelId));
      assert.isNull(err);
      assert.deepEqual(result, testDigitalTwinModel);
      testCallback();
    });
  });

  /*Test_SRS_NODE_DIGITAL_TWIN_SERVICE_CLIENT_12_010: [The `getDigitalTwinModel` method shall return error if the method of the protocol layer failed.]*/
  it('getDigitalTwinModel calls its callback with an error if the PL client fails', function (testCallback) {
    var testModelId = 'modelId';
    var testError = new Error('fake error');
    var testClient = new DigitalTwinServiceClient(testCredentials);
    testClient._pl.digitalTwin.getDigitalTwinModel = sinon.stub().callsArgWith(1, testError);
    testClient.getModel(testModelId, function (err, result) {
      assert.isTrue(testClient._pl.digitalTwin.getDigitalTwinModel.calledWith(testModelId));
      assert.strictEqual(err, testError);
      testCallback();
    });
  });

  /*Test_SRS_NODE_DIGITAL_TWIN_SERVICE_CLIENT_12_022: [The `getDigitalTwinModel` method shall return a promise if there is no callback passed.]*/
  it('getDigitalTwinModel shall return a promise if there is no callback passed', async () => {
    var testModelId = 'modelId';
    var testDigitalTwinModel = {
      interfaces: {
        testComponentName: {}
      }
    };
    var testClient = new DigitalTwinServiceClient(testCredentials);
    testClient._pl.digitalTwin.getDigitalTwinModel = sinon.stub().callsArgWith(1, null, testDigitalTwinModel);
    const returnedPromise = await testClient.getModel(testModelId);
    assert.isNotNull(returnedPromise);
  });

  /*Test_SRS_NODE_DIGITAL_TWIN_SERVICE_CLIENT_12_011: [The `updateDigitalTwin` method shall call the `updateInterfaces` method of the protocol layer with the given arguments.]*/
  /*Test_SRS_NODE_DIGITAL_TWIN_SERVICE_CLIENT_12_012: [The `updateDigitalTwin` method shall call the callback with an error parameter if a callback is passed..]*/
  it('updateDigitalTwin calls updateInterfaces on the PL client', function (testCallback) {
    var testTwinId = 'digitalTwinId';
    var testDigitalTwin = {
      interfaces: {
        testComponentName: {}
      }
    };
    var testPatch = {
      components: {
        testComponentName: {}
      }
    };
    var testClient = new DigitalTwinServiceClient(testCredentials);
    testClient._pl.digitalTwin.updateInterfaces = sinon.stub().callsArgWith(2, null, testDigitalTwin);
    testClient.updateDigitalTwin(testTwinId, testPatch, function (err, result) {
      assert.isTrue(testClient._pl.digitalTwin.updateInterfaces.calledWith(testTwinId, testPatch));
      assert.isNull(err);
      assert.deepEqual(result, testPatch);
      testCallback();
    });
  });

  /*Test_SRS_NODE_DIGITAL_TWIN_SERVICE_CLIENT_12_013: [The `updateDigitalTwin` method shall return error if the method of the protocol layer failed.]*/
  it('updateDigitalTwin calls its callback with an error if the PL client fails', function (testCallback) {
    var testTwinId = 'digitalTwinId';
    var testPatch = {
      components: {
        testComponentName: {}
      }
    };
    var testError = new Error('fake error');
    var testClient = new DigitalTwinServiceClient(testCredentials);
    testClient._pl.digitalTwin.updateInterfaces = sinon.stub().callsArgWith(2, testError);
    testClient.updateDigitalTwin(testTwinId, testPatch, function (err, result) {
      assert.isTrue(testClient._pl.digitalTwin.updateInterfaces.calledWith(testTwinId));
      assert.strictEqual(err, testError);
      testCallback();
    });
  });

  /*Test_SRS_NODE_DIGITAL_TWIN_SERVICE_CLIENT_12_023: [The `updateDigitalTwin` method shall return a promise if there is no callback passed.]*/
  it('updateDigitalTwin shall return a promise if there is no callback passed', async () => {
    var testTwinId = 'digitalTwinId';
    var testDigitalTwin = {
      interfaces: {
        testComponentName: {}
      }
    };
    var testPatch = {
      components: {
        testComponentName: {}
      }
    };
    var testClient = new DigitalTwinServiceClient(testCredentials);
    testClient._pl.digitalTwin.updateInterfaces = sinon.stub().callsArgWith(3, null, testDigitalTwin);
    const result = await testClient.updateDigitalTwin(testTwinId, testPatch);
    assert.deepEqual(result.components, testPatch.components);
  });

  /*Test_SRS_NODE_DIGITAL_TWIN_SERVICE_CLIENT_12_026: [The `updateDigitalTwin` method shall call the `updateInterfaces` method of the protocol layer with the given arguments including eTag.]*/
  it('updateDigitalTwin calls updateInterfaces on the PL client using eTag', function (testCallback) {
    var testTwinId = 'digitalTwinId';
    var eTag = 'testETag';
    var options = {
      ifMatch: eTag
    }
    var testDigitalTwin = {
      interfaces: {
        testComponentName: {}
      }
    };
    var testPatch = {
      components: {
        testComponentName: {}
      }
    };
    var testClient = new DigitalTwinServiceClient(testCredentials);
    testClient._pl.digitalTwin.updateInterfaces = sinon.stub().callsArgWith(3, null, testDigitalTwin);
    testClient.updateDigitalTwin(testTwinId, testPatch, eTag, function (err, result) {
      assert.isTrue(testClient._pl.digitalTwin.updateInterfaces.calledWith(testTwinId, testPatch, options));
      assert.isNull(err);
      assert.deepEqual(result, testPatch);
      testCallback();
    });
  });

  /*Test_SRS_NODE_DIGITAL_TWIN_SERVICE_CLIENT_12_014: [The `updateDigitalTwinProperty` method shall call the `updateInterfaces` method of the protocol layer.]*/
  /*Test_SRS_NODE_DIGITAL_TWIN_SERVICE_CLIENT_12_015: [The `updateDigitalTwinProperty` method shall call the callback with an error parameter if a callback is passed..]*/
  it('updateDigitalTwinProperty calls updateInterfaces on the PL client', function (testCallback) {
    var testTwinId = 'digitalTwinId';
    var testComponentName = 'testComponentName';
    var testPropertyName = 'testPropertyName';
    var testPropertyValue = 'testPropertyValue';

    var testDigitalTwin = {
      interfaces: {
        testComponentName: {
          properties: {
            testPropertyName: {
              desired: {
                value: [testPropertyValue]
              }
            }
          }
        }
      }
    };

    var expectedPatch = {
      components: {
        [testComponentName]: {
          properties: {
            [testPropertyName]: {
              desired: {
                value: [testPropertyValue]
              }
            }
          }
        }
      }
    };

    var testClient = new DigitalTwinServiceClient(testCredentials);
    testClient._pl.digitalTwin.updateInterfaces = sinon.stub().callsArgWith(2, null, testDigitalTwin);
    testClient.updateDigitalTwinProperty(testTwinId, testComponentName, testPropertyName, testPropertyValue, function (err, result) {
      assert.isTrue(testClient._pl.digitalTwin.updateInterfaces.calledWith(testTwinId));
      assert.isNull(err);
      assert.deepEqual(result, expectedPatch);
      testCallback();
    });
  });

  /*Test_SRS_NODE_DIGITAL_TWIN_SERVICE_CLIENT_12_016: [The `updateDigitalTwinProperty` method shall return error if the method of the protocol layer failed.]*/
  it('updateDigitalTwinProperty calls its callback with an error if the PL client fails', function (testCallback) {
    var testTwinId = 'digitalTwinId';
    var testError = new Error('fake error');
    var testComponentName = 'testComponentName';
    var testPropertyName = 'testPropertyName';
    var testPropertyValue = 'testPropertyValue';
    var testClient = new DigitalTwinServiceClient(testCredentials);
    testClient._pl.digitalTwin.updateInterfaces = sinon.stub().callsArgWith(2, testError);
    testClient.updateDigitalTwinProperty(testTwinId, testComponentName, testPropertyName, testPropertyValue, function (err, result) {
      assert.isTrue(testClient._pl.digitalTwin.updateInterfaces.calledWith(testTwinId));
      assert.strictEqual(err, testError);
      testCallback();
    });
  });

  /*Test_SRS_NODE_DIGITAL_TWIN_SERVICE_CLIENT_12_024: [The `updateDigitalTwinProperty` method shall return a promise if there is no callback passed.]*/
  it('updateDigitalTwinProperty shall return a promise if there is no callback passed', async () => {
    var testTwinId = 'digitalTwinId';
    var testDigitalTwin = {
      components: {
        testComponentName: {}
      }
    };
    var testComponentName = 'testComponentName';
    var testPropertyName = 'testPropertyName';
    var testPropertyValue = 'testPropertyValue';

    var expectedPatch = {
      components: {
        [testComponentName]: {
          properties: {
            [testPropertyName]: {
              desired: {
                value: [testPropertyValue]
              }
            }
          }
        }
      }
    };

    var testClient = new DigitalTwinServiceClient(testCredentials);
    testClient._pl.digitalTwin.updateInterfaces = sinon.stub().callsArgWith(3, null, testDigitalTwin);
    const returnedPromise = await testClient.updateDigitalTwinProperty(testTwinId, testComponentName, testPropertyName, testPropertyValue);
    assert.isNotNull(returnedPromise);
  });

  /*Test_SRS_NODE_DIGITAL_TWIN_SERVICE_CLIENT_12_027: [The `updateDigitalTwinProperty` method shall call the `updateInterfaces` method of the protocol layer including eTag.]*/
  it('updateDigitalTwinProperty calls updateInterfaces on the PL client using eTag', function (testCallback) {
    var testTwinId = 'digitalTwinId';
    var testComponentName = 'testComponentName';
    var testPropertyName = 'testPropertyName';
    var testPropertyValue = 'testPropertyValue';
    var eTag = 'testETag';
    var options = {
      ifMatch: eTag
    }

    var testDigitalTwin = {
      interfaces: {
        testComponentName: {
          properties: {
            testPropertyName: {
              desired: {
                value: [testPropertyValue]
              }
            }
          }
        }
      }
    };

    var expectedPatch = {
      components: {
        [testComponentName]: {
          properties: {
            [testPropertyName]: {
              desired: {
                value: [testPropertyValue]
              }
            }
          }
        }
      }
    };
    var testClient = new DigitalTwinServiceClient(testCredentials);
    testClient._pl.digitalTwin.updateInterfaces = sinon.stub().callsArgWith(3, null, testDigitalTwin);
    testClient.updateDigitalTwinProperty(testTwinId, testComponentName, testPropertyName, testPropertyValue, eTag, function (err, result) {
      assert.isTrue(testClient._pl.digitalTwin.updateInterfaces.calledWith(testTwinId, testDigitalTwin, options));
      assert.isNull(err);
      assert.deepEqual(result, expectedPatch);
      testCallback();
    });
  });



  /*Test_SRS_NODE_DIGITAL_TWIN_SERVICE_CLIENT_12_017: [The `invokeCommand` method shall call the `invokeInterfaceCommand` method of the protocol layer with the given arguments.]*/
  /*Test_SRS_NODE_DIGITAL_TWIN_SERVICE_CLIENT_12_018: [The `invokeCommand` method shall call the callback with an error parameter if a callback is passed..]*/
  it('invokeCommand calls invokeInterfaceCommand on the PL client', function (testCallback) {
    var testTwinId = 'digitalTwinId';
    var testCommandResponse = {
      xMsCommandStatuscode: number = 42,
      xMsRequestId: string = 'testRequestId',
      body: any = 'testBody'
    };
    var expectedTestCommandResponse = {
      statusCode: number = 42,
      requestId: string = 'testRequestId',
      result: any = 'testBody'
    };
    var testComponentName = 'testComponentName';
    var testCommandName = 'testCommandName';
    var testArgument = 123456;
    var testClient = new DigitalTwinServiceClient(testCredentials);
    testClient._pl.digitalTwin.invokeInterfaceCommand = sinon.stub().callsArgWith(4, null, testCommandResponse);
    testClient.invokeCommand(testTwinId, testComponentName, testCommandName, testArgument, function (err, result) {
      assert.isTrue(testClient._pl.digitalTwin.invokeInterfaceCommand.calledWith(testTwinId, testComponentName, testCommandName, testArgument));
      assert.isNull(err);
      assert.deepEqual(result, expectedTestCommandResponse);
      testCallback();
    });
  });

  /*Test_SRS_NODE_DIGITAL_TWIN_SERVICE_CLIENT_12_019: [The `invokeCommand` method shall return error if the method of the protocol layer failed.]*/
  it('invokeCommand calls its callback with an error if the PL client fails', function (testCallback) {
    var testTwinId = 'digitalTwinId';
    var testError = new Error('fake error');
    var testComponentName = 'testComponentName';
    var testCommandName = 'testCommandName';
    var testArgument = 'abcdefg';
    var testClient = new DigitalTwinServiceClient(testCredentials);
    testClient._pl.digitalTwin.invokeInterfaceCommand = sinon.stub().callsArgWith(4, testError);
    testClient.invokeCommand(testTwinId, testComponentName, testCommandName, testArgument, function (err, result) {
      assert.isTrue(testClient._pl.digitalTwin.invokeInterfaceCommand.calledWith(testTwinId, testComponentName, testCommandName, testArgument));
      assert.strictEqual(err, testError);
      testCallback();
    });
  });

  /*Test_SRS_NODE_DIGITAL_TWIN_SERVICE_CLIENT_12_025: [The `invokeCommand` method shall return a promise if there is no callback passed.]*/
  it('invokeCommand shall return a promise if there is no callback passed', async () => {
    var testTwinId = 'digitalTwinId';
    var testCommandResponse = {
      result: {
        testResult: {}
      }
    };
    var testComponentName = 'testComponentName';
    var testCommandName = 'testCommandName';
    var testArgument = 123456;
    var testClient = new DigitalTwinServiceClient(testCredentials);
    testClient._pl.digitalTwin.invokeInterfaceCommand = sinon.stub().callsArgWith(4, null, testCommandResponse);
    const returnedPromise = await testClient.invokeCommand(testTwinId, testComponentName, testCommandName, testArgument);
    assert.isNotNull(returnedPromise);
  });
});
