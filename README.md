# 🚗 Used Car Evaluation & Price Prediction System

## 📌 About the Project

This project helps users check the condition of a used car and estimate its price. Based on the inputs, it also suggests whether the car is worth buying or not.

The main idea is to make car buying easier by giving a simple analysis instead of relying only on guesswork.

---

## 🎯 What this project does

* Estimates the **price of a used car**
* Calculates a **condition score**
* Gives a final suggestion:

  * Buy
  * Negotiate
  * Do not buy

---

## ⚙️ Features

### 🔍 Condition Check

The system takes inputs like:

* Engine condition
* Body condition
* Interior condition

Then it calculates an overall score.

---

### 💰 Price Prediction

* Predicts price using basic machine learning
* Based on:

  * Year
  * Kilometers driven

---

### 💡 Final Decision

Based on condition:

* Good → Buy
* Average → Negotiate
* Poor → Do not buy

---

## 🛠️ Tech Used

* Python
* Django
* HTML, CSS, JavaScript
* Scikit-learn (for ML)

---

## 📂 Project Structure

```
car_project/
 ├── car_app/
 │    ├── models.py
 │    ├── views.py
 │    ├── ml_model.py
 │    ├── templates/
 │    └── static/
 ├── db.sqlite3
 └── manage.py
```

---

## 🚀 How to Run

1. Clone the repo

```
git clone https://github.com/your-username/project-name.git
```

2. Go to folder

```
cd car_project
```

3. Install requirements

```
pip install -r requirements.txt
```

4. Run server

```
python manage.py runserver
```

5. Open in browser

```
http://127.0.0.1:8000/
```

---

## 📊 How it works

1. User enters car details
2. System calculates condition
3. Model predicts price
4. Final result is shown

---

## 🔮 Future Improvements

* Add image upload for damage detection
* Improve accuracy with better dataset
* Make mobile-friendly UI

---

## 👨‍💻 Author

Aditya Bawane

---

## ⭐ Note

This project is made for learning and academic purposes.
