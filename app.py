from flask import Flask, render_template, request
import os
import classify
from PIL import Image
import numpy as np

app = Flask(__name__)
port = int(os.getenv('PORT', 5000))
class_names = ['mesothiolma','adenocarcinoma', 'No Tumor', 'squamous']
#class_names = ['adenocarcinoma_left.lower.lobe_T2_N0_M0_Ib', 'large.cell.carcinoma_left.hilum_T2_N2_M0_IIIa', 'Normal','squamous.cell.carcinoma_left.hilum_T1_N2_M0_IIIa']


@app.route('/', methods=['GET'])
def hello_world():
    return render_template("dex.html")


@app.route('/home', methods=['GET',"POST"])
def home():
    if request.method=='POST':
        image_file = request.files["imagefile"]
        image_path = "./images/" + image_file.filename
        # image_file.save(image_path)
        image = Image.open(image_file)
        prediction = classify.predict(image)
        result = " {} cancer for {:.2f}% Confidence".format(class_names[np.argmax(prediction)], 100 * np.max(prediction))
    else:
        result=None
    return render_template("home.html", prediction=result)
    
@app.route('/login', methods=['GET',"POST"])
def login():
    return render_template("login.html")

if __name__ == '__main__':
    #app.run(host='0.0.0.0', port=port)
    app.run(debug=False)
