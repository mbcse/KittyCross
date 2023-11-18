import json

taxi_prompt = ""
with open('prompts.json', 'r') as file:
    lookup = json.loads(file.read())


def extract(val, lk):
    for e in lk.items():
        val -= e[1]
        if val < 0: return e[0]

    return None


def compose(attr):
    prompt = ""
    for e in lookup:
        print(e)
        val = extract(int(attr.pop(0)), e["options"])
        if val:
            prompt += e["prompt"].format(val)

    return prompt



