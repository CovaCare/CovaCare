import cv2
import time
from ultralytics import YOLO

model = YOLO('yolov8n.pt')

# Webcam
cap = cv2.VideoCapture(0)
# Video file
#cap = cv2.VideoCapture('output_video_full.mp4')

# FPS counter initialization
prev_time = time.time()

while True:
    ret, frame = cap.read()
    if not ret:
        break

    start_time = time.time()
    results = model(frame, classes=[0])

    people_count = 0
    for result in results:
        boxes = result.boxes
        for box in boxes:
            cls = box.cls[0]
            conf = box.conf[0]

            if int(cls) == 0 and conf > 0.5:
                people_count += 1

    end_time = time.time()
    fps = 1 / (end_time - start_time)

    cv2.putText(frame, f'FPS: {fps:.2f}', (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    cv2.putText(frame, f'People Count: {people_count}', (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

    cv2.imshow('People Counter', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
