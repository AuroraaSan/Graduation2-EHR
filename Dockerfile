# Use a lightweight Python image
FROM python:3.9-slim

# Set the working directory
WORKDIR /code

# Copy only the required files for better caching
COPY ./requirements.txt /code/requirements.txt

# Install dependencies
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt


COPY ./app /code/app

# Expose the FastAPI default port
EXPOSE 8000

# Set the environment variable (optional for default values)
ENV NEBIUS_API_KEY=""

# Command to run the FastAPI app using Uvicorn
CMD ["uvicorn", "app.app:app", "--host", "0.0.0.0", "--port", "8000"]
