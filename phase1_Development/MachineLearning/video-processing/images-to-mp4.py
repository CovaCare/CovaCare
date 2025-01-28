import cv2
import os
import glob

def images_to_mp4(input_folder, output_video_path, start_frame, end_frame, fps):
    image_files = sorted(glob.glob(os.path.join(input_folder, '*.jpg')) + glob.glob(os.path.join(input_folder, '*.png')))
    
    if not image_files:
        print("No images found in the folder.")
        return

    total_frames = len(image_files)
    if start_frame < 1 or start_frame > total_frames or end_frame < 1 or end_frame > total_frames or start_frame > end_frame:
        print("Invalid frame range.")
        return

    first_image = cv2.imread(image_files[start_frame - 1])
    height, width, _ = first_image.shape
    
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_video_path, fourcc, fps, (width, height))
    
    # Loop through the specified frame range and write images to the video
    for frame_number in range(start_frame - 1, end_frame):
        image_path = image_files[frame_number]
        frame = cv2.imread(image_path)
        out.write(frame)
    
    out.release()
    print(f"Video saved to {output_video_path}")

input_folder = 'sample_images'
output_path = 'sample_videos/sample_video.mp4'
start_frame = 11
end_frame = 40
fps_param = 30
images_to_mp4(input_folder, output_path, start_frame, end_frame, fps_param)
