//Create a new Node.js project with npm init and install the necessary dependencies with npm install express yoti--save.
//Create a new file called app.js and
//import the required modules:

const express = require('express');
const fs = require('fs');
const path = require('path');
const { IDVClient, SessionSpecificationBuilder, RequestedDocumentAuthenticityCheckBuilder, RequestedLivenessCheckBuilder, RequestedTextExtractionTaskBuilder, RequestedFaceMatchCheckBuilder, SdkConfigBuilder } = require('yoti');

// Create an instance of the Express application and define a route for your API endpoint:

const app = express();

app.get('/yoti-session', (req, res) => {
    // Code to create Yoti session
});

//Inside the route handler function, copy the code from your original file and modify it to return the session data as JSON:

app.get('/yoti-session', (req, res) => {
    const YOTI_CLIENT_SDK_ID = 'YOTI_CLIENT_SDK_ID';
    const YOTI_PEM = fs.readFileSync(path.join(__dirname, '/path/to/pem'));
    const idvClient = new IDVClient(YOTI_CLIENT_SDK_ID, YOTI_PEM);

    const documentAuthenticityCheck = new RequestedDocumentAuthenticityCheckBuilder().build();
    const livenessCheck = new RequestedLivenessCheckBuilder().forZoomLiveness().withMaxRetries(3).build();
    const faceMatchCheck = new RequestedFaceMatchCheckBuilder().withManualCheckFallback().build();
    const textExtractionTask = new RequestedTextExtractionTaskBuilder().withManualCheckFallback().build();

    const sdkConfig = new SdkConfigBuilder()
        .withAllowsCameraAndUpload()
        .withPresetIssuingCountry('GBR')
        .withSuccessUrl('/success')
        .withErrorUrl('/error').build();

    const sessionSpec = new SessionSpecificationBuilder()
        .withClientSessionTokenTtl(600)
        .withResourcesTtl(604800)
        .withUserTrackingId('some-user-tracking-id')
        .withRequestedCheck(documentAuthenticityCheck)
        .withRequestedCheck(livenessCheck)
        .withRequestedCheck(faceMatchCheck)
        .withRequestedTask(textExtractionTask)
        .withSdkConfig(sdkConfig).build();

    idvClient.createSession(sessionSpec)
        .then((session) => {
            const sessionId = session.getSessionId();
            const clientSessionToken = session.getClientSessionToken();
            const clientSessionTokenTtl = session.getClientSessionTokenTtl();

            res.json({ sessionId, clientSessionToken, clientSessionTokenTtl });
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
});
//Start the Express server by adding the following code at the end of app.js:
app.listen(3000, () => {
    console.log('Server started on port 3000');
});