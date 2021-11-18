import math
import operator

import cv2
import numpy as np
from time import time
import mediapipe as mp
import matplotlib.pyplot as plt

# Initializing mediapipe pose class.
mp_pose = mp.solutions.pose

# Setting up the Pose function.
# pose = mp_pose.Pose(static_image_mode=False, min_detection_confidence=0.5, model_complexity=1)

# Initializing mediapipe drawing class, useful for annotation.
mp_drawing = mp.solutions.drawing_utils


def calculateAngle(landmark1, landmark2, landmark3):
    """
    This function calculates angle between three different landmarks.
    Args:
        landmark1: The first landmark containing the x,y and z coordinates.
        landmark2: The second landmark containing the x,y and z coordinates.
        landmark3: The third landmark containing the x,y and z coordinates.
    Returns:
        angle: The calculated angle between the three landmarks.
    """
    x1, y1, _ = landmark1
    x2, y2, _ = landmark2
    x3, y3, _ = landmark3

    # Calculate the angle between the three points
    angle = math.degrees(math.atan2(y3 - y2, x3 - x2) - math.atan2(y1 - y2, x1 - x2))

    if angle < 0:
        angle += 360
    return angle


# def classifyPose(landmarks, output_image, display=False):
#     """
#     This function classifies yoga poses depending upon the angles of various body joints.
#     Args:
#         landmarks: A list of detected landmarks of the person whose pose needs to be classified.
#         output_image: A image of the person with the detected pose landmarks drawn.
#         display: A boolean value that is if set to true the function displays the resultant image with the pose label
#         written on it and returns nothing.
#     Returns:
#         output_image: The image with the detected pose landmarks drawn and pose label written.
#         label: The classified pose label of the person in the output_image.
#     """
#     label = 'UNKNOWN'
#     color = (0, 0, 255)  # red
#
#     # Calculate the required angles.
#     # ----------------------------------------------------------------------------------------------------------------
#
#     # Get the angle between the left shoulder, elbow and wrist points.
#     left_elbow_angle = calculateAngle(landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value],
#                                       landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value],
#                                       landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value])
#
#     # Get the angle between the right shoulder, elbow and wrist points.
#     right_elbow_angle = calculateAngle(landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value],
#                                        landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value],
#                                        landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value])
#
#     # Get the angle between the left elbow, shoulder and hip points.
#     left_shoulder_angle = calculateAngle(landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value],
#                                          landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value],
#                                          landmarks[mp_pose.PoseLandmark.LEFT_HIP.value])
#
#     # Get the angle between the right hip, shoulder and elbow points.
#     right_shoulder_angle = calculateAngle(landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value],
#                                           landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value],
#                                           landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value])
#
#     # Get the angle between the left hip, knee and ankle points.
#     left_knee_angle = calculateAngle(landmarks[mp_pose.PoseLandmark.LEFT_HIP.value],
#                                      landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value],
#                                      landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value])
#
#     # Get the angle between the right hip, knee and ankle points
#     right_knee_angle = calculateAngle(landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value],
#                                       landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value],
#                                       landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value])
#
#     # ----------------------------------------------------------------------------------------------------------------
#
#     # Check if it is the warrior II pose or the T pose.
#     # As for both of them, both arms should be straight and shoulders should be at the specific angle.
#     # ----------------------------------------------------------------------------------------------------------------
#
#     # Check if the both arms are straight.
#     if left_elbow_angle & gt; 165 and left_elbow_angle & lt; 195 and right_elbow_angle & gt; 165 and right_elbow_angle & lt; 195:
#
#         # Check if shoulders are at the required angle.
#         if left_shoulder_angle & gt; 80 and left_shoulder_angle & lt; 110 and right_shoulder_angle & gt; 80 and right_shoulder_angle & lt; 110:
#
#             # Check if it is the warrior II pose.
#             # ----------------------------------------------------------------------------------------------------------------
#
#             # Check if one leg is straight.
#             if left_knee_angle & gt; 165 and left_knee_angle & lt; 195 or right_knee_angle & gt; 165 and right_knee_angle & lt; 195:
#
#                 # Check if the other leg is bended at the required angle.
#                 if left_knee_angle & gt; 90 and left_knee_angle & lt; 120 or right_knee_angle & gt; 90 and right_knee_angle & lt; 120:
#
#                     # Specify the label of the pose that is Warrior II pose.
#                     label = 'Warrior II Pose'
#
#                     # ----------------------------------------------------------------------------------------------------------------
#
#             # Check if it is the T pose.
#             # ----------------------------------------------------------------------------------------------------------------
#
#             # Check if both legs are straight
#             if left_knee_angle & gt; 160 and left_knee_angle & lt; 195 and right_knee_angle & gt; 160 and right_knee_angle & lt; 195:
#
#                 # Specify the label of the pose that is tree pose.
#                 label = 'T Pose'
#
#     # ----------------------------------------------------------------------------------------------------------------
#
#     # Check if it is the tree pose.
#     # ----------------------------------------------------------------------------------------------------------------
#
#     # Check if one leg is straight
#     if left_knee_angle & gt; 165 and left_knee_angle & lt; 195 or right_knee_angle & gt; 165 and right_knee_angle & lt; 195:
#
#         # Check if the other leg is bended at the required angle.
#         if left_knee_angle & gt; 315 and left_knee_angle & lt; 335 or right_knee_angle & gt; 25 and right_knee_angle & lt; 45:
#
#             # Specify the label of the pose that is tree pose.
#             label = 'Tree Pose'
#
#     # ----------------------------------------------------------------------------------------------------------------
#
#     # Check if the pose is classified successfully
#     if label != 'Unknown Pose':
#         # Update the color (to green) with which the label will be written on the image.
#         color = (0, 255, 0)
#
#         # Write the label on the output image.
#     cv2.putText(output_image, label, (10, 30), cv2.FONT_HERSHEY_PLAIN, 2, color, 2)
#
#     # Check if the resultant image is specified to be displayed.
#     if display:
#
#         # Display the resultant image.
#         plt.figure(figsize=[10, 10])
#         plt.imshow(output_image[:, :, ::-1]);
#         plt.title("Output Image");
#         plt.axis('off');
#
#     else:
#
#         # Return the output image and the classified label.
#         return output_image, label


def detectPose(image, pose, display=True):
    """
    This function performs pose detection on an image.
    Args:
        image: The input image with a prominent person whose pose landmarks needs to be detected.
        pose: The pose setup function required to perform the pose detection.
        display: A boolean value that is if set to true the function displays the original input image, the resultant image,
                 and the pose landmarks in 3D plot and returns nothing.
    Returns:
        output_image: The input image with the detected pose landmarks drawn.
        landmarks: A list of detected landmarks converted into their original scale.
    """
    output_image = image.copy()

    # Convert the image from BGR into RGB format.
    imageRGB = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    # Perform the Pose Detection.
    results = pose.process(imageRGB)

    height, width, _ = image.shape

    landmarks = []
    if results.pose_landmarks:  # Check if any landmarks are detected.
        # Draw Pose landmarks on the output image.
        mp_drawing.draw_landmarks(image=output_image, landmark_list=results.pose_landmarks,
                                  connections=mp_pose.POSE_CONNECTIONS)
        for landmark in results.pose_landmarks.landmark:
            landmarks.append((int(landmark.x * width), int(landmark.y * height),
                              (landmark.z * width)))

    if display:
        plt.figure(figsize=[22, 22])
        plt.subplot(121);
        plt.imshow(image[:, :, ::-1]);
        plt.title("Original Image");
        plt.axis('off');
        plt.subplot(122);
        plt.imshow(output_image[:, :, ::-1]);
        plt.title("Output Image");
        plt.axis('off');

        # Plot Pose landmarks in 3D.
        mp_drawing.plot_landmarks(results.pose_world_landmarks, mp_pose.POSE_CONNECTIONS)
    else:
        return output_image, landmarks


# Setup Pose function for video.
pose_video = mp_pose.Pose(static_image_mode=False, min_detection_confidence=0.5, model_complexity=1)
cap = cv2.VideoCapture(0)
# if not cap.isOpened():
#     print("failed to read VideoCapture object")
#     return

# Initialize a variable to store the time of the previous frame.
time1 = 0

while cap.isOpened():
    ret, frame = cap.read()  # read next frame

    if ret:
        # Flip the frame horizontally for natural (selfie-view) visualization
        frame = cv2.flip(frame, 1)
        frame_height, frame_width, _ = frame.shape  # 480, 640
        frame = cv2.resize(frame, (int(frame_width * (640 / frame_height)), 640))  # 640, 853 (when height 480 -> 640 : width 640 -> ?)
        frame, _ = detectPose(frame, pose_video, display=False)

        time2 = time()
        # Check if the difference between the previous and this frame time &gt; 0 to avoid division by zero.
        if operator.gt((time2 - time1), 0):
            frames_per_second = 1.0 / (time2 - time1)  # Calculate the number of frames per second.

            # Write the calculated number of frames per second on the frame.
            cv2.putText(frame, 'FPS: {}'.format(int(frames_per_second)), (10, 30), cv2.FONT_HERSHEY_PLAIN, 2,
                        (0, 255, 0), 3)

        time1 = time2

        cv2.imshow('MediaPipe_PoseDetection', frame)
        if (cv2.waitKey(30) & 0xFF) == ord('q'):
            break

    else:
        break

cap.release()
cv2.destroyAllWindows()
