import json

breed = {
    534351: "orange tabby", 
    421613: "bengal", 
    1442: "tuxedo", 
    84531: "british shorthair"
}

with open('prompts.json', 'r') as file:
    lookup = json.loads(file.read())


def extract(val, lk):
    for e in lk.items():
        val -= e[1]
        if val < 0: return e[0]

    return None


def decode_genes(gene):
    attr = [int((gene >> i * 20) & 0b11111) for i in range(12)]
    chain = gene >> 240 & 0b1111
    return attr


def compose(chain, gene):
    attr = decode_genes(int(gene))

    prompt = "Create an image that radiates a vibrant and mystical atmosphere, capturing the essence of a majestic cat as the central figure. The art style is a modern, digital reinterpretation of Art Deco, infused with neon colors and inspired by the memphis group. The cat is positioned centrally. The scenary is rendered in bold and saturated hues that give the scene a dreamlike quality. The composition is aiming to balance the cat's noble poise with the dynamic background, creating a harmonious blend of tradition and fantasy that is grounded in reality. "
    prompt += "The cat has a {} coloring and fur pattern. ".format(breed[int(chain)])
    for e in lookup:
        val = extract(int(attr.pop(0)), e["options"])
        if val:
            prompt += e["prompt"].format(val)

    prompt += "The illustration should be one holistic piece tying together all its elements. "
    print(prompt)
    return prompt
