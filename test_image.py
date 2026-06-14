import cv2

img = cv2.imread(r"ml_engine\damage_detection\uploads\car.jpg")

print(img is not None)

if img is not None:
    print(img.shape)
    