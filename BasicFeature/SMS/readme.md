# SMS Feature

### Overview
As part of our project, we needed a reliable way to send emergency SMS alerts to designated contacts when an accident is detected by the system. To achieve this, our group researched various SMS APIs and selected TextBelt Open Source for development and validation. This service allows us to send SMS messages programmatically and supports local testing through its open-source implementation.

### Implementation
To integrate TextBelt into our system:
1. Cloning the Repository:
    The [TextBelt Open Source repository](./textbelt/) was cloned, and the server was set up following the instructions provided in its GitHub documentation. This local setup allowed us to test SMS functionality without incurring external costs or requiring an internet connection.

2. Developing the Test Script:
    A [Python script](./send_sms.py) was created to send POST requests to the TextBelt server's /text endpoint. This script included the recipient's phone number and a sample message in the payload.

3. Testing the SMS Feature:
    The script was executed on the local machine to send a test SMS. One of our team members received the SMS successfully, confirming that the feature worked as intended.

### Future Development
- While TextBelt is functional, we also explored Twilio API as an alternative. Twilio offers more robust features, easier integration, and scalable options for production environments.
- Future work involves integrating the SMS feature with the accident detection model to send real-time alerts when incidents are detected.