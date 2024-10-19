from ultralytics import YOLO
import cv2
import math
import time
import numpy as np
inference_times = [105.2, 104.2, 103.9, 106.2, 111.2, 107.2, 105.2, 107.7]
average_inference_time = np.mean(inference_times)
print(f'Average Inference Time per Image: {average_inference_time:.4f} ms')
