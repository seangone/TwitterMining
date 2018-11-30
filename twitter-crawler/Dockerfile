# Use an official Python runtime as a parent image
FROM python:3.6

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
ADD . /app

# Install any needed packages specified in requirements.txt
RUN pip install -U nltk
RUN pip install -U numpy
RUN python3 -m nltk.downloader punkt
RUN python3 -m nltk.downloader vader_lexicon
RUN pip install --trusted-host pypi.python.org -r requirements.txt

# Run app.py when the container launches
CMD ["python3", "app.py"]