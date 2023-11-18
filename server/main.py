# app.py
import json
from flask import Flask, request, jsonify
from openai import OpenAI

import PromptComposer

app = Flask(__name__)
client = OpenAI(api_key="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",)
taxidriver_url = "https://oaidalleapiprodscus.blob.core.windows.net/private/org-b96SxKz2DjiAINW2kfQd3LvS/user-cAIsouEBA2Dd8wTpKsFgWrb0/img-GUleoqJ3ozGtebL93JOmjkCv.png?st=2023-11-18T08%3A17%3A41Z&se=2023-11-18T10%3A17%3A41Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-11-17T19%3A52%3A27Z&ske=2023-11-18T19%3A52%3A27Z&sks=b&skv=2021-08-06&sig=BFC05v4%2B8RcCULq3uhzNCgQtjtJ0VjZ7Hnu0ZPvKJ%2BE%3D"
with open('storage.json', 'r') as file:
    storage = json.loads(file.read())


@app.get("/taxi")
def get_taxidriver():
    return jsonify(taxidriver_url)


@app.get("/storage")
def get_storage():
    return jsonify(storage)


@app.get("/kitties")
def get_kitties():
    if request.is_json:
        ls = request.get_json()

        print("request", ls)
        ret = {}

        for ck in ls:
            id = str(ck["id"])

            if id not in storage:
                # query dalle
                response = client.images.generate(
                    model="dall-e-3",
                    prompt=PromptComposer.compose(ck["chain"], ck["genes"]),
                    size="1024x1024",
                    quality="standard",
                    n=1,
                )
                print("response", response)
                image_url = response.data[0].url
                storage[id] = image_url
                with open("storage.json", "w") as f:
                    f.write(json.dumps(storage))
            ret[id] = storage[id]

        return jsonify(ret)

    return {"error": "Request must be JSON"}, 415


# start the server with the 'run()' method
if __name__ == '__main__':
    app.run(host='0.0.0.0', port='5000')
