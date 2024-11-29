# Displaying a Standard Web Camera

# import cv2

# cap = cv2.VideoCapture(0)

# while(True):
#     ret, frame = cap.read()
#     cv2.imshow('frame',frame)
#     if cv2.waitKey(1) & 0xFF == ord('q'):
#         break

# cap.release()
# cv2.destroyAllWindows()

#---------------------------------------------------------------------------------

# Displaying a Standard IP Camera
# Ref: https://stackoverflow.com/questions/49978705/access-ip-camera-in-python-opencv

import cv2

# Most of the IP cameras have a username and password to access the video. 
# In such case, the credentials have to be provided in the streaming URL as follows:

# An example of IP camera streaming URL is as follows:
# rtsp://192.168.1.64/1

capture = cv2.VideoCapture('rtsp://username:password@192.168.1.64/1')

while(True):
    ret, frame = cap.read()
    cv2.imshow('frame',frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

capture.release()
cv2.destroyAllWindows()

