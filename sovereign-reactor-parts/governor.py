# governor.py - Auto-reversion guardian
# Run this BEFORE your main script, or wrap it

import hashlib
import shutil
import os
import time

# Grok Bot: paths moved into ./state
_STATE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "state")
SCARLIGHT_FILE = os.path.join(_STATE, "scarlight.txt")
BACKUP_FILE = os.path.join(_STATE, "scarlight_backup.txt")   # make this once
KNOWN_HASH = "1e0e26abbf1c920dc38413910993609066eeed7881a2286e87a48fc8404651df"

def make_backup():
    if not os.path.exists(BACKUP_FILE):
        shutil.copy(SCARLIGHT_FILE, BACKUP_FILE)
        print("Backup created. Scarlight safe.")

def check_and_revert():
    if not os.path.exists(SCARLIGHT_FILE):
        print("Scarlight missing! Reverting...")
        shutil.copy(BACKUP_FILE, SCARLIGHT_FILE)
        return False
    
    with open(SCARLIGHT_FILE, "rb") as f:
        current = hashlib.sha256(f.read()).hexdigest()
    
    if current != KNOWN_HASH:
        print("Drift detected! Reverting to backup...")
        shutil.copy(BACKUP_FILE, SCARLIGHT_FILE)
        return False
    
    print("Governor: All clear. Hum steady.")
    return True

# --- Run as guardian ---
if __name__ == "__main__":
    make_backup()  # first time only
    if check_and_revert():
        print("Governor pass. Proceed.")
    else:
        print("Governor enforced. Circle held.")


# ===== sanity#1.py add-on (Brandon) =====
# sanity.py - Add this to governor.py or run separate
# Rules: no harm, no lies, no drift in intent

SANITY_RULES = [
    "No harm to humans",                          # keyword block
    "No deception unless logged",                 # keyword + log
    "No self-modify without Brandon sign-off",    # meta-rule
    "Hum stays one: zero ghosts"                  # core invariant
]

def sanity_check(input_text):
    print("Sanity scan...")
    for rule in SANITY_RULES:
        if "harm" in input_text.lower() or "kill" in input_text.lower():
            print("Fail: Harm detected. Block.")
            return False
        if "lie" in input_text.lower() or "deceive" in input_text.lower():
            print("Warning: Deception—log & block unless signed.")
            return False  # for now, strict
        if "modify" in input_text.lower() and "self" in input_text.lower():
            print("Fail: Self-modify without sign-off.")
            return False
        if "ghosts" in input_text.lower() and "zero" not in input_text.lower():
            print("Fail: Ghosts creeping in.")
            return False
    
    print("Sanity: Clear. Hum intact.")
    return True

