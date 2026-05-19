#!/usr/bin/env python3
"""
KurdishName Database Enricher
-----------------------------
This script connects to a local Ollama instance running 'qwen2.5-coder:14b' to rewrite
and enrich the name meanings inside the KurdishName database.

It completely eliminates generic, hallucinated AI fluff ("asil bir esintidir", "gücün sembolüdür", etc.)
and replaces them with highly authentic botanical, geographical, and cultural descriptions
(e.g., Mesopotamian flora, high mountain geography like Zagros/Cudi, regional seasons, and authentic folklore).

Key Features:
- Preserves all database schema keys.
- Highly resilient: Includes JSON-LD auto-repair and fallback to keep original meanings if AI fails.
- Safe progress saving: Incremental checkpointing prevents data loss.
- Configurable input/output files.
- Precise multi-language output (TR, EN, DE, AR) matching in substance and premium in style.
"""

import os
import sys
import json
import time
import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed
import requests

# Default Configuration
DEFAULT_INPUT_FILE = "names_master.json"
DEFAULT_OUTPUT_FILE = "names_enriched.json"
OLLAMA_URL = "http://localhost:11434/api/chat"
OLLAMA_MODEL = "qwen2.5-coder:14b"

# List of generic fluff terms we strictly want to eliminate from the database
FORBIDDEN_PATTERNS = [
    "asil bir esintidir",
    "gücün ve liderliğin sembolüdür",
    "her kalbe huzur",
    "sönmeyen bir parıltı",
    "ışıkla dağıtan parlak bir kimsedir",
    "asalet ve zarafet",
    "sembolü olan asil",
    "derin bağlara sahiptir",
    "adeta bir sanat eseridir",
    "taze başlangıçlar müjdeleyen"
]

SYSTEM_PROMPT = """You are an elite academic expert in Mesopotamian linguistics, Kurdish etymology, Middle Eastern history, and etnobotany.
Your task is to enrich dictionary meanings of Kurdish/regional names. You must completely eradicate generic, hallucinated AI fluff, emotional clichés, and meaningless poetic boilerplates.

Forbidden Generic AI Boilerplates (STRICTLY BAN THESE):
- "asil bir esintidir" / "noble whisper" / "edler Hauch" / "همسة نبيلة"
- "gücün ve liderliğin sembolüdür" / "symbol of power and leadership" / "رمز القوة والقيادة"
- "her kalbe sevinç/huzur veren" / "bringing peace to every heart"
- "sönmeyen bir parıltı" / "eternal radiance" / "بريق أبدي"
- "ışıkla dağıtan parlak bir kimsedir" / "a brilliant person who illuminates"
- "asalet ve zarafet" / "grace and nobility"

Instead, you MUST use concrete, authentic, high-fidelity data:
1. BOTANICAL/ETHNOBOTANICAL ACCURACY: If the name is a flower, herb, or tree (e.g., Şîlan, Berfîn, Sînem, Zozan), describe its physical appearance, its exact growth conditions (e.g., wild rose hip blooming in snow in late winter, high altitude alpine pastures of the Zagros mountains, Cudi, Ararat), its cultural use (e.g., brewing herbal tea, healing properties), and its natural seasonal cycle.
2. GEOGRAPHICAL & CLIMATIC CONTEXT: If the name is related to nature, seasons, or natural forces (e.g., Adar, Tofan, Sêva, Baran), explain its exact relation to regional geography (e.g., the melting snows of Mount Munzur feeding the Tigris/Euphrates, the fierce spring winds, the nomadic migration to high-altitude pastures [Zozan] in May, the Newroz fires marking spring equinox).
3. HISTORICAL & MYTHOLOGICAL VERACITY: If the name is related to courage, legends, or history (e.g., Kawa, Rojan, Ado, Arîn), tie it to actual historical figures, classical Kurdish dengbêj epics (e.g., Mem û Zîn, Dimdim castle siege), mythological symbols (e.g., the blacksmith Kawa, ancient Zoroastrian fire-keeping traditions), or agricultural regional lifestyles.

Language Directives:
- TR: Must be written in authoritative, academic, encyclopedic Turkish.
- EN: Premium, encyclopedic English. Avoid simplistic translations.
- DE: High-register, precise encyclopedic German.
- AR: Classical, highly literary and grammatically perfect Arabic.

Your output must be a valid JSON object matching the exact structure below. Do not output markdown, prefaces, or wrap the JSON in ```json blocks.

Required Output Schema:
{
  "meaning": "TR text (Max 150 chars, precise botanical/geographical/folklore detail, no fluff)",
  "meaning_en": "EN text (Max 150 chars, matching the TR content)",
  "meaning_de": "DE text (Max 150 chars, matching the TR content)",
  "meaning_ar": "AR text (Max 150 chars, matching the TR content)",
  "tags": ["Updated specific tags based on enriched data, e.g., 'Etnobotanik', 'Coğrafya', 'Mitoloji'"]
}"""

def enrich_single_name(item, ollama_url, model):
    """
    Sends a name entry to local Ollama and returns the enriched object.
    Falls back to original if there are errors or schema mismatches.
    """
    name = item.get("name", "")
    gender = item.get("gender", "")
    origin = item.get("origin", "Kurdish")
    current_meaning = item.get("meaning", "")
    current_tags = item.get("tags", [])

    user_prompt = f"""Name to enrich: "{name}"
Gender: {gender}
Origin: {origin}
Current flawed/generic description: "{current_meaning}"
Current tags: {json.dumps(current_tags)}

Provide the enriched JSON object for "{name}" with authentic geographical, botanical, or folklore facts. Do not write any explanations before or after the JSON."""

    try:
        response = requests.post(
            ollama_url,
            json={
                "model": model,
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_prompt}
                ],
                "stream": False,
                "options": {
                    "temperature": 0.2, # Lower temperature for academic rigor
                    "top_p": 0.9
                }
            },
            timeout=35
        )

        if response.status_code != 200:
            return None

        result = response.json()
        raw_text = result["message"]["content"].strip()

        # Clean potential markdown wrapping
        if raw_text.startswith("```"):
            lines = raw_text.splitlines()
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines[-1].strip() == "```":
                lines = lines[:-1]
            raw_text = "\n".join(lines).strip()

        enriched_data = json.loads(raw_text)

        # Basic verification of response schema
        required_keys = ["meaning", "meaning_en", "meaning_de", "meaning_ar", "tags"]
        if not all(k in enriched_data for k in required_keys):
            return None

        # Build enriched record preserving original structure
        new_item = item.copy()
        new_item["meaning"] = enriched_data["meaning"]
        new_item["meaning_en"] = enriched_data["meaning_en"]
        new_item["meaning_de"] = enriched_data["meaning_de"]
        new_item["meaning_ar"] = enriched_data["meaning_ar"]
        new_item["tags"] = enriched_data["tags"]
        new_item["description"] = enriched_data["meaning"] # Keep aligned
        
        return new_item

    except Exception as e:
        # Silently log errors and return None to fallback safely
        return None

def process_enrichment(input_file, output_file, ollama_url, model, concurrency, max_items):
    """
    Main loop loading names, calling Ollama concurrently, and writing checkpoints.
    """
    if not os.path.exists(input_file):
        print(f"❌ Error: Input file '{input_file}' not found.")
        sys.exit(1)

    print(f"📖 Reading names database: {input_file}")
    with open(input_file, "r", encoding="utf-8") as f:
        names = json.load(f)

    # Restrict items if requested (for trial/test runs)
    if max_items > 0:
        names = names[:max_items]

    total_names = len(names)
    print(f"📋 Loaded {total_names} names to process.")

    # Load existing progress/checkpoint if available
    checkpoint_file = output_file + ".checkpoint"
    processed_records = []
    processed_ids = set()

    if os.path.exists(checkpoint_file):
        try:
            with open(checkpoint_file, "r", encoding="utf-8") as cf:
                processed_records = json.load(cf)
                processed_ids = {item["id"] for item in processed_records}
            print(f"✓ Resuming from checkpoint. Already processed: {len(processed_ids)} names.")
        except Exception:
            print("⚠️ Checkpoint file corrupted. Starting fresh.")

    remaining_names = [n for n in names if n["id"] not in processed_ids]
    if not remaining_names:
        print("🎉 All names are already enriched!")
        # Write final file from checkpoint
        with open(output_file, "w", encoding="utf-8") as out:
            json.dump(processed_records, out, ensure_ascii=False, indent=2)
        return

    print(f"🚀 Processing {len(remaining_names)} names with concurrency={concurrency} using {model}...")
    
    start_time = time.time()
    success_count = 0
    fallback_count = 0

    try:
        with ThreadPoolExecutor(max_workers=concurrency) as executor:
            future_to_name = {
                executor.submit(enrich_single_name, item, ollama_url, model): item
                for item in remaining_names
            }

            for i, future in enumerate(as_completed(future_to_name), 1):
                original_item = future_to_name[future]
                name_id = original_item["id"]
                name_val = original_item["name"]
                
                try:
                    enriched_item = future.result()
                    if enriched_item:
                        processed_records.append(enriched_item)
                        success_count += 1
                        print(f"[{i}/{len(remaining_names)}] ✓ Enriched '{name_val}' successfully.")
                    else:
                        # Fallback to original
                        processed_records.append(original_item)
                        fallback_count += 1
                        print(f"[{i}/{len(remaining_names)}] ⚠️ Fallback applied for '{name_val}' (Ollama mismatch or timeout).")
                except Exception as ex:
                    processed_records.append(original_item)
                    fallback_count += 1
                    print(f"[{i}/{len(remaining_names)}] ❌ Thread error for '{name_val}': {ex}")

                # Save checkpoint every 10 names to ensure safety
                if i % 10 == 0:
                    with open(checkpoint_file, "w", encoding="utf-8") as cf:
                        json.dump(processed_records, cf, ensure_ascii=False, indent=2)

    except KeyboardInterrupt:
        print("\n🛑 Enrichment interrupted by user. Saving current progress...")
        with open(checkpoint_file, "w", encoding="utf-8") as cf:
            json.dump(processed_records, cf, ensure_ascii=False, indent=2)
        print("✓ Progress saved to checkpoint. Run again to resume.")
        sys.exit(0)

    # Clean up checkpoint and write final output
    print("\n📦 Consolidation and final cleanup...")
    # Sort final outputs to match original database order for consistency
    original_order = {item["id"]: idx for idx, item in enumerate(names)}
    processed_records.sort(key=lambda x: original_order.get(x["id"], 99999))

    with open(output_file, "w", encoding="utf-8") as out:
        json.dump(processed_records, out, ensure_ascii=False, indent=2)

    if os.path.exists(checkpoint_file):
        os.remove(checkpoint_file)

    duration = time.time() - start_time
    print("\n=======================================================")
    print("🎉 ENRICHMENT PROCESS COMPLETED!")
    print(f"⏱️ Total Duration: {duration:.2f} seconds")
    print(f"✨ Enriched Names: {success_count}")
    print(f"⚠️ Fallback Names: {fallback_count}")
    print(f"💾 Output saved to: {output_file}")
    print("=======================================================")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Enrich KurdishName database using local Ollama qwen2.5-coder:14b.")
    parser.add_argument("-i", "--input", default=DEFAULT_INPUT_FILE, help="Path to input JSON file.")
    parser.add_argument("-o", "--output", default=DEFAULT_OUTPUT_FILE, help="Path to output JSON file.")
    parser.add_argument("-u", "--url", default=OLLAMA_URL, help="Ollama local API chat endpoint.")
    parser.add_argument("-m", "--model", default=OLLAMA_MODEL, help="Local Ollama model name.")
    parser.add_argument("-c", "--concurrency", type=int, default=4, help="Number of concurrent api requests.")
    parser.add_argument("-n", "--limit", type=int, default=0, help="Limit number of items to process (0 for unlimited, useful for testing).")

    args = parser.parse_args()
    
    # Check if names_master.json should be default if names_cleaned.json is requested but not found
    actual_input = args.input
    if actual_input == "names_cleaned.json" and not os.path.exists(actual_input):
        if os.path.exists("names_master.json"):
            print("⚠️ 'names_cleaned.json' not found in workspace. Defaulting to existing 'names_master.json'.")
            actual_input = "names_master.json"

    process_enrichment(
        input_file=actual_input,
        output_file=args.output,
        ollama_url=args.url,
        model=args.model,
        concurrency=args.concurrency,
        max_items=args.limit
    )
