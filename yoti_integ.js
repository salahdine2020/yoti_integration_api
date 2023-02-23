const path = require('path');
const fs = require('fs');

const {
    IDVClient,
    SessionSpecificationBuilder,
    RequestedDocumentAuthenticityCheckBuilder,
    RequestedLivenessCheckBuilder,
    RequestedTextExtractionTaskBuilder,
    RequestedFaceMatchCheckBuilder,
    SdkConfigBuilder

} = require('yoti');

const YOTI_CLIENT_SDK_ID = 'YOTI_CLIENT_SDK_ID';
const YOTI_PEM = fs.readFileSync(path.join(__dirname, '/path/to/pem'));
const idvClient = new IDVClient(YOTI_CLIENT_SDK_ID, YOTI_PEM);

//Document Authenticity Check
const documentAuthenticityCheck = new RequestedDocumentAuthenticityCheckBuilder().build();

//Liveness check with 3 retries
const livenessCheck = new RequestedLivenessCheckBuilder()
    .forZoomLiveness()
    .withMaxRetries(3)
    .build();

//Face Match Check with manual check set to fallback
const faceMatchCheck = new RequestedFaceMatchCheckBuilder()
    .withManualCheckFallback()
    .build();

//ID Document Text Extraction Task with manual check set to fallback
const textExtractionTask = new RequestedTextExtractionTaskBuilder()
    .withManualCheckFallback()
    .build();

//Configuration for the client SDK (Frontend)
const sdkConfig = new SdkConfigBuilder()
    .withAllowsCameraAndUpload()
    .withPresetIssuingCountry('GBR')
    .withSuccessUrl('/success')
    .withErrorUrl('/error')
    .build();

//Buiding the Session with defined specification from above
const sessionSpec = new SessionSpecificationBuilder()
    .withClientSessionTokenTtl(600)
    .withResourcesTtl(604800)
    .withUserTrackingId('some-user-tracking-id')
    .withRequestedCheck(documentAuthenticityCheck)
    .withRequestedCheck(livenessCheck)
    .withRequestedCheck(faceMatchCheck)
    .withRequestedTask(textExtractionTask)
    .withSdkConfig(sdkConfig)
    .build();

//Create Session
idvClient
    .createSession(sessionSpec)
    .then((session) => {
        const sessionId = session.getSessionId();
        const clientSessionToken = session.getClientSessionToken();
        const clientSessionTokenTtl = session.getClientSessionTokenTtl();
    })
    .catch((err) => {
        // handle err
    });