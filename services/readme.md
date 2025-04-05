# Services

- **SMS Alert Service**  
  Sends emergency notifications to designated contacts using Twilio.

- **Image Hosting Service**  
  Manages secure storage and retrieval of camera feed images for incident verification.

---

## [SMS Alert Service](./alerting/)

This service sends SMS alerts when the system detects a fall or accident.

### Features
- Real-time SMS alerts to emergency contacts
- Integration with accident detection logic
- Uses [Twilio](https://www.twilio.com/) API for reliable message delivery

---

## [Image Hosting Service](./image-server/)

This service securely stores and serves image data captured from the camera.

### Running the Server

Start the image server:
```bash
python image-server.py
```

Expose the server publicly using ngrok:
```bash
ngrok http 5002
```