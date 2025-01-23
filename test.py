from transformers import pipeline

# Download the model locally
pipeline(model="lxyuan/vit-xray-pneumonia-classification", cache_dir="./modelsss")
