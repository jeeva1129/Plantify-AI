
import os
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

app.config["MAX_CONTENT_LENGTH"] = 10 * 1024 * 1024

ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png"}

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "Please select an image."}), 400

    file = request.files["image"]

    if not file.filename:
        return jsonify({"error": "No image selected."}), 400

    extension = file.filename.rsplit(".", 1)[-1].lower()

    if extension not in ALLOWED_EXTENSIONS:
        return jsonify({"error": "Only JPG and PNG images are allowed."}), 400

    # AI model connection will be added in the next step.
    return jsonify({
        "error": "AI model is not connected yet. Please try again after model setup."
    }), 503


@app.errorhandler(413)
def file_too_large(error):
    return jsonify({"error": "Image size must be below 10 MB."}), 413


@app.errorhandler(404)
def page_not_found(error):
    return jsonify({"error": "Requested page was not found."}), 404


@app.errorhandler(500)
def server_error(error):
    return jsonify({"error": "Internal server error. Please try again."}), 500


if __name__ == "__main__":
    app.run(debug=True)
