# Tiki Product Recommendation System

## Overview
This project builds a product recommendation system for an e-commerce platform (Tiki) using user review and rating data.  
It includes data preprocessing, exploratory data analysis (EDA), and a recommendation model based on collaborative filtering.

---

## Dataset
The project uses two main datasets:
- `Tiki_products.csv`
- `Tiki_reviews.csv`

These datasets contain product information and user ratings used to generate recommendations.

---

## Technologies
- Python
- Pandas, NumPy
- Matplotlib, Seaborn
- Scikit-surprise (SVD model)

---

## Workflow

### 1. Data Preprocessing
- Handled missing values and duplicates  
- Cleaned invalid records  
- Standardized data types  

### 2. Exploratory Data Analysis (EDA)
- Analyzed user behavior and rating distribution  
- Explored product popularity and trends  
- Visualized insights using charts  

### 3. Recommendation Model
- Built a recommendation system using **Collaborative Filtering**
- Applied **SVD (Singular Value Decomposition)**  
- Used user-item-rating matrix:
  - `customer_id`
  - `product_id`
  - `rating`

### 4. Prediction & Recommendation
- Predicted user preferences  
- Generated Top-N recommended products  

---

## Visualization
The recommendation results were:
- Exported to **JSON format**  
- Displayed using a simple **HTML interface** for better visualization  

---

## Project Output
- Cleaned datasets  
- EDA visualizations  
- Recommendation results  
- JSON output + HTML display  

---

## Key Features
- Personalized product recommendations  
- Data-driven insights from user behavior  
- End-to-end workflow: data → model → visualization  

---

## Future Improvements
- Implement content-based recommendation  
- Improve model performance with hybrid approach  
- Deploy as a web application  

---

## Author
Nguyễn Quốc Anh
