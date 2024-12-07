import time
import cv2
import tensorflow as tf
import numpy as np

movenet_interpreter = tf.lite.Interpreter(model_path='models/tflite-multi-lightning-16/model.tflite')
movenet_interpreter.allocate_tensors()

TARGET_IMAGE_SIZE = 192
MOVENET_INPUT_TYPE = tf.uint8
IS_MULTI_POSE = True

# Function to preprocess frame for MoveNet
def preprocess_for_movenet(frame):
    img = tf.image.resize_with_pad(np.expand_dims(frame, axis=0), TARGET_IMAGE_SIZE, TARGET_IMAGE_SIZE)
    return tf.cast(img, dtype=MOVENET_INPUT_TYPE)

# Function to draw keypoints
def draw_movenet_keypoints(frame, keypoints, confidence_threshold):
    y, x, c = frame.shape
    shaped = np.squeeze(np.multiply(keypoints, [y, x, 1]))
    for kp in shaped:
        ky, kx, kp_conf = kp
        if kp_conf > confidence_threshold:
            cv2.circle(frame, (int(kx), int(ky)), 4, (0, 255, 0), -1)

# Function to draw keypoints for multiple people
def draw_movenet_keypoints_multi(frame, outputs, confidence_threshold=0.5):
    y, x, c = frame.shape
    for person in outputs[0]:
        keypoints = np.reshape(person[:17 * 3], (17, 3))
        for ky, kx, kp_conf in keypoints:
            if kp_conf > confidence_threshold:
                px, py = int(kx * x), int(ky * y)
                cv2.circle(frame, (px, py), 4, (0, 255, 0), -1)

# Webcam
cap = cv2.VideoCapture(0)
# Video file
#cap = cv2.VideoCapture('output_video_full.mp4')

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    start_time = time.time()
    
    input_image = preprocess_for_movenet(frame)

    input_details = movenet_interpreter.get_input_details()
    output_details = movenet_interpreter.get_output_details()

    # Handle dynamic input shape
    if IS_MULTI_POSE:
        input_tensor_index = input_details[0]['index']
        movenet_interpreter.resize_tensor_input(input_tensor_index, input_image.shape, strict=True)
        movenet_interpreter.allocate_tensors()

    movenet_interpreter.set_tensor(input_details[0]['index'], np.array(input_image))
    movenet_interpreter.invoke()

    results = movenet_interpreter.get_tensor(output_details[0]['index'])

    end_time = time.time()
    fps = 1 / (end_time - start_time)

    # Draw the keypoints on the frame
    if (IS_MULTI_POSE):
        draw_movenet_keypoints_multi(frame, results, confidence_threshold=0.5)
    else:
        draw_movenet_keypoints(frame, results[0], confidence_threshold=0.5)
        
    cv2.putText(frame, f'MoveNet FPS: {fps:.2f}', (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

    cv2.imshow('MoveNet Pose Detection', frame)

    if cv2.waitKey(10) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
