# Medical Image Classification Using Transfer Learning

## Project Overview

This project implements a deep learning-based medical image classification system using **Transfer Learning with MobileNetV2** to classify chest X-ray images into two categories:

- NORMAL
- PNEUMONIA

The model uses ImageNet-pretrained MobileNetV2, data augmentation, class weighting, and fine-tuning to improve classification performance.

## Technologies Used

- Python
- TensorFlow / Keras
- MobileNetV2
- NumPy
- Pandas
- Matplotlib
- Seaborn
- Scikit-learn
- Google Colab

## Dataset

**Dataset:** Chest X-Ray Images (Pneumonia)

**Source:** [Kaggle - Chest X-Ray Images (Pneumonia)](https://www.kaggle.com/datasets/paultimothymooney/chest-xray-pneumonia)

The dataset contains chest X-ray images belonging to two classes: NORMAL and PNEUMONIA.

### Dataset Distribution

| Dataset | Number of Images |
|---|---:|
| Training | 4,434 |
| Validation | 782 |
| Testing | 624 |
| **Total used** | **5,840** |

Images were resized to 224 × 224 pixels for MobileNetV2.

*The dataset is not included in this repository. Download it separately from Kaggle.*

## Project Workflow

1. Dataset loading and exploration (EDA)
2. Image visualization and class distribution analysis
3. Image resizing and preprocessing
4. Data augmentation
5. Transfer learning using MobileNetV2
6. Class imbalance handling using class weights
7. Model training and validation
8. Fine-tuning the final 30 MobileNetV2 layers
9. Model evaluation using accuracy, precision, recall, AUC, and F1-score
10. Confusion matrix and classification report
11. Individual chest X-ray prediction
12. Saving the trained model

## Model Architecture

**Base Model:** MobileNetV2

**Approach:** Transfer Learning and Fine-Tuning

The architecture includes:

- Pre-trained MobileNetV2 feature extractor
- Data augmentation layers
- Global Average Pooling
- Dropout layer (0.3)
- Dense output layer with sigmoid activation

The model was initially trained with frozen MobileNetV2 layers. The final 30 layers were subsequently unfrozen for fine-tuning.

## Final Test Results

The fine-tuned model achieved the following results on the independent test dataset:

| Metric | Result |
|---|---:|
| Accuracy | 83.17% |
| AUC | 95.75% |
| Precision | 79.87% |
| Recall | 97.69% |
| Loss | 0.3765 |

### Class-wise Performance

| Class | Precision | Recall | F1-score |
|---|---:|---:|---:|
| NORMAL | 0.94 | 0.59 | 0.72 |
| PNEUMONIA | 0.80 | 0.98 | 0.88 |

The results show strong pneumonia recall, while identifying NORMAL images remains an area for improvement.

## Sample Predictions

The trained model was tested with individual chest X-ray images:

- NORMAL image → NORMAL (85.99% model score)
- PNEUMONIA image → PNEUMONIA (98.76% model score)

These are sample predictions and do not establish clinical reliability. The model scores are not clinically calibrated confidence values.

## Repository Structure

```text
Medical-Image-Classification-Using-Transfer-Learning/
│
├── Medical_Image_Classification.ipynb
├── chest_xray_mobilenetv2.keras
├── README.md
└── requirements.txt
```

## How to Run

1. Clone this repository.
2. Open the notebook using Google Colab or Jupyter Notebook.
3. Download the dataset from Kaggle.
4. Configure the dataset path in the notebook.
5. Install the required dependencies.
6. Execute the notebook cells sequentially.

## Future Improvements

- Improve NORMAL class recall.
- Experiment with other pretrained architectures such as EfficientNet.
- Perform additional hyperparameter tuning.
- Evaluate performance on external datasets.
- Explore model explainability techniques such as Grad-CAM.

## Disclaimer

This project is developed for educational and research purposes only. It is not a clinically validated medical diagnostic system and must not be used to diagnose, treat, or make medical decisions about patients.

## Author

**Balaji Krishnamoorthy**

Machine Learning / AI Enthusiast
