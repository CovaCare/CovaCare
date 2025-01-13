import cv2

count = 0
waitTime = 1000

# Webcam
#cap = cv2.VideoCapture(0)
# Video file
cap = cv2.VideoCapture('sample_videos/sample_video.mp4')

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    count += 1

    cv2.putText(frame, f'Frame Number: {count:.2f}', (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    cv2.imshow('OpenCV Test', frame)
    
    if cv2.waitKey(waitTime) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
