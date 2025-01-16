# Simulating and Developing IP Camera Integration

### Overview
To integrate IP camera feeds with our Machine Learning (ML) model for accident detection, our group needed to develop and validate the capability to access and process video streams. However, due to the unavailability of physical IP cameras during development, we focused on researching and simulating this functionality using a Python script.


### Planned Workflow for Full Development 
1. Access the IP Camera Stream with OpenCV (cv2): Utilize OpenCV (cv2) to access and capture the video stream from the IP camera.
2. Extract and Preprocess Frames: Extract individual frames from the video stream and preprocess them for input into the machine learning model. 
3. Run Frames Through the Accident Detection Model: Pass the processed frames through our trained accident detection model to determine whether an accident has occurred.
4. Trigger Alerts Upon Detection: If an accident is detected by the model, trigger an alert to notify the emergency contacts.
