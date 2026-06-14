from ml_engine.damage_detection.detect import detect_damage

image_path = r"ml_engine\damage_detection\uploads\car.jpg"

result = detect_damage(image_path)

print(result)