import os 
import tensorflow as tf 
import numpy as np 
import seaborn as sns 
import pathlib 
from IPython import display 
from matplotlib import pyplot as plt 
from sklearn.metrics import classification_report

data = tf.keras.utils.get_file( 
  'mini_speech_commands.zip', 
  origin="http://storage.googleapis.com/download.tensorflow.org/data/mini_speech_commands.zip", 
  extract=True, 
  cache_dir='.', cache_subdir='data')


os.listdir('./data/')