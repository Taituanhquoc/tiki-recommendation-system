# Tiki Product Recommendation System

## Overview
This project builds a product recommendation system for Tiki based on user review and rating data.  
The workflow includes data cleaning, exploratory data analysis (EDA), and recommendation modeling using SVD-based collaborative filtering.

## Dataset
The project uses two datasets:
- `Tiki_products.csv`
- `Tiki_reviews.csv`

## Technologies
- Python
- Pandas
- Matplotlib
- Seaborn
- Scikit-surprise

## Workflow
1. Load and inspect product and review data  
2. Clean missing values, duplicates, and invalid records  
3. Perform exploratory data analysis on user behavior and product interactions  
4. Prepare user-item-rating data  
5. Train a recommendation model using SVD  
6. Generate top product recommendations for users  

## Model
The recommendation model is built using **SVD (Singular Value Decomposition)** from the `surprise` library, based on:
- `customer_id`
- `product_id`
- `rating`

## Result
The system predicts user preferences and recommends relevant products based on historical rating behavior.

## Visualization
The recommendation results were exported to JSON format and displayed through a simple HTML interface for better visualization.

## Project Output
- Cleaned review and product datasets
- Exploratory data analysis visualizations
- Top-N product recommendations for a sample user
