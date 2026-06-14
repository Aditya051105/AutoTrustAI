from ultralytics import YOLO

model = YOLO("yolov8n.pt")

results = model.predict(
    source=r"ml_engine\damage_detection\uploads\car.jpg",
    save=True
)

print("Detection Complete!")

for result in results:
    print(result.boxes)