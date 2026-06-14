from ultralytics import YOLO

model = YOLO("yolov8n.pt")


def detect_damage(image_path):

    results = model.predict(
        source=image_path,
        conf=0.25
    )

    detections = []

    for result in results:

        for box in result.boxes:

            cls = int(box.cls[0])
            conf = float(box.conf[0])

            detections.append({
                "label": model.names[cls],
                "confidence": round(conf, 2)
            })

    return detections