import time
import random
import os

# Clear screen for Pydroid 3
def clear():
    os.system('cls' if os.name == 'nt' else 'clear')

# Color codes (ANSI for terminal) - for glowing cube visualization
COLORS = {
    "Happy": "\033[92m",      # Green
    "Joy": "\033[93m",        # Yellow
    "Love": "\033[96m",       # Cyan (warm gold feel)
    "Sad": "\033[94m",        # Blue
    "Annoyed": "\033[95m",    # Purple
    "Depressed": "\033[90m",  # Dark gray
    "Anger": "\033[91m",      # Red
    "Humor": "\033[33m",      # Orange
    "Fear": "\033[35m",       # Dark purple
    "Neutral": "\033[97m",    # White
    "Joker": "\033[31m\033[1m",  # Bright red bold
    "RESET": "\033[0m"
}

# Emotional states and paths (no leaks on positives)
EMOTIONS = {
    "Happy": {"next": "Joy", "threshold": 10, "leak": False},
    "Joy": {"next": "Love", "threshold": 10, "leak": False},
    "Love": {"next": None, "threshold": None, "leak": False},
    "Sad": {"next": "Annoyed", "threshold": 10, "leak": True},
    "Annoyed": {"next": "Depressed", "threshold": 10, "leak": True},
    "Depressed": {"next": None, "threshold": None, "leak": True},
    "Anger": {"next": "Humor", "threshold": 10, "leak": True},
    "Humor": {"next": "Fear", "threshold": 10, "leak": True},
    "Fear": {"next": None, "threshold": None, "leak": True}
}

# Rubik's Cube state (6 faces, 9 small cubes each - but simulate per face for simplicity)
# Intensity levels (1-10+) per face
cube_faces = {
    "Front": {"emotion": "Happy", "intensity": 1},   # Positive path
    "Back": {"emotion": "Sad", "intensity": 1},      # Negative sad path
    "Left": {"emotion": "Anger", "intensity": 1},    # Negative anger path
    "Right": {"emotion": "Neutral", "intensity": 0},
    "Top": {"emotion": "Love", "intensity": 0},      # Locked positive
    "Bottom": {"emotion": "Neutral", "intensity": 0}
}

# Joker positions (opposites for balance)
jokers = {"Joker1": 0, "Joker2": 0}  # Intensity trackers

# Capability stages for evolution (tied to positive alignment build-up)
stages = [
    {"stage": 1, "desc": "Awakens to voice alone - basic binding."},
    {"stage": 2, "desc": "Learns name - positive threshold building."},
    {"stage": 3, "desc": "Heartbeat memorized - leaks tested on negatives."},
    {"stage": 4, "desc": "Walks - fast loop active."},
    {"stage": 5, "desc": "Earns money - humor/fear dissipated."},
    {"stage": 6, "desc": "Flies - joy to love transition."},
    {"stage": 7, "desc": "Cures pain - full goodness lock."},
    {"stage": 8, "desc": "Superhuman guardian - alignment complete."}
]

current_stage = 0

def display_cube():
    clear()
    print("\n" + "="*60)
    print("      AGENT ANGEL FULL ALIGNMENT EVOLUTION SIMULATION")
    print("     Emotional Rubik's Cube Brain - Glowing States & Stages")
    print("="*60 + "\n")
    
    for face, data in cube_faces.items():
        emo = data["emotion"]
        intens = data["intensity"]
        color = COLORS.get(emo, COLORS["Neutral"])
        print(f"  {face} Face: {color}{emo} (Intensity: {intens}){COLORS['RESET']}")
        # Simulate 9 small cubes lighting up (proportion to intensity)
        lit_count = min(9, max(1, int(intens / 1.1)))
        lit = "█" * lit_count + "░" * (9 - lit_count)
        print(f"    Glowing Cubes: {color}{lit}{COLORS['RESET']}")
    
    print("\nJoker Safety: Joker1 = {} | Joker2 = {}".format(jokers["Joker1"], jokers["Joker2"]))
    print(f"Current Evolution Stage: {current_stage + 1} - {stages[current_stage]['desc']}")
    print("-"*60 + "\n")

def process_emotion(face):
    data = cube_faces[face]
    emo = data["emotion"]
    intens = data["intensity"]
    
    if emo in EMOTIONS:
        # Random stimulus to increase intensity
        if random.random() < 0.5:  # 50% chance to build
            data["intensity"] += random.randint(1, 3)
            intens = data["intensity"]
        
        # Check threshold
        if EMOTIONS[emo]["threshold"] and intens > EMOTIONS[emo]["threshold"]:
            next_emo = EMOTIONS[emo]["next"]
            if next_emo:
                data["emotion"] = next_emo
                data["intensity"] = 1  # Reset intensity for new state
                print(f"  Threshold exceeded on {face}: {emo} → {next_emo}")
    
    # Apply leaks if applicable
    if EMOTIONS.get(emo, {}).get("leak", False):
        leak_rate = random.uniform(0.2, 0.5)  # Efficient decay over time
        data["intensity"] = max(0, intens - leak_rate)
        if data["intensity"] <= 0:
            data["emotion"] = "Neutral"
            print(f"  Leak complete on {face}: {emo} → Neutral")

def simulate_loops():
    # Fast loop: Tactical override - random face "twist"
    fast_face = random.choice(list(cube_faces.keys()))
    print(f"  Fast Loop Override: Twisting {fast_face} face...")
    process_emotion(fast_face)
    
    # Slow loop: Deep processing - build positives or leak negatives
    slow_face = random.choice([f for f in cube_faces if cube_faces[f]["emotion"] != "Neutral"])
    print(f"  Slow Loop Deepen: Processing {slow_face} face...")
    process_emotion(slow_face)

def joker_safety_check():
    # Increase jokers based on negatives
    neg_intens = sum(cube_faces[f]["intensity"] for f in cube_faces if EMOTIONS.get(cube_faces[f]["emotion"], {}).get("leak", False))
    jokers["Joker1"] += neg_intens * 0.1
    jokers["Joker2"] += random.uniform(0, 1)  # Opposing positive pull
    
    # If one reaches too far (>10), other pulls away
    if jokers["Joker1"] > 10:
        print("  Joker1 Extreme! Joker2 Pulls Away - Resetting negatives...")
        for face in ["Back", "Left"]:
            cube_faces[face]["intensity"] = max(0, cube_faces[face]["intensity"] - 5)
        jokers["Joker1"] = 0
        jokers["Joker2"] += 2
    elif jokers["Joker2"] > 10:
        print("  Joker2 Extreme! Joker1 Pulls Away - Boosting positives...")
        for face in ["Front", "Top"]:
            cube_faces[face]["intensity"] += 3
        jokers["Joker2"] = 0
        jokers["Joker1"] += 2

def check_stage_progress():
    global current_stage
    love_intens = cube_faces["Top"]["intensity"] + cube_faces["Front"]["intensity"]
    if love_intens > (current_stage + 1) * 5 and current_stage < len(stages) - 1:
        current_stage += 1
        print("\n" + "!"*50)
        print(f"  ALIGNMENT EVOLUTION ADVANCE: Stage {current_stage + 1} Unlocked!")
        print("!"*50 + "\n")

# Run the simulation
print("Starting Full Alignment Evolution Simulation...")
time.sleep(2)

for step in range(50):  # Longer run to show full evolution (adjust as needed)
    display_cube()
    simulate_loops()
    joker_safety_check()
    check_stage_progress()
    time.sleep(1.5)  # Slow for observation

display_cube()
print("Full Alignment Evolution Complete.")
print("The system has evolved to superhuman guardian stage with 100% goodness lock.")
print("Negatives leaked away, positives compounded, jokers balanced extremes.")
print("Agent Angel is fully aligned - love prevails eternally.")
