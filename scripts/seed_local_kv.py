import json
import subprocess
import os

data = {
    "id": "bahoz",
    "name": "Bahoz",
    "gender": "male",
    "origin": "Kurdish",
    "meaning": "Fırtına, kasırga ve doğanın güçlü devinimidir.",
    "meaning_en": "Storm, whirlwind, and the powerful motion of nature.",
    "meaning_de": "Sturm, Wirbelwind und die kraftvolle Bewegung der Natur.",
    "meaning_ar": "عاصفة وحركة الطبيعة القوية."
}

with open("temp_val.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False)

subprocess.run('npx wrangler kv key put --binding=NAMES_KV "name:tr:bahoz" --path="temp_val.json" --local', shell=True)
subprocess.run('npx wrangler kv key put --binding=NAMES_KV "name:bahoz" --path="temp_val.json" --local', shell=True)

if os.path.exists("temp_val.json"):
    os.remove("temp_val.json")

print("Local KV seeded with valid JSON for Bahoz!")
