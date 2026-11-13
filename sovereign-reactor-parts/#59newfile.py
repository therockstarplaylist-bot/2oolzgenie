import random
import time
from dataclasses import dataclass, field
from typing import Dict, List, Callable
from enum import Enum

class Emotion(Enum):
    JOY = "Joy"
    SADNESS = "Sadness"
    ANGER = "Anger"
    FEAR = "Fear"
    LOVE = "Love"
    CURIOSITY = "Curiosity"
    PRIDE = "Pride"
    GUILT = "Guilt"
    HOPE = "Hope"

class MaturityStage(Enum):
    INFANT = 1
    TODDLER = 2
    CHILD = 3
    ADOLESCENT = 4
    YOUNG_ADULT = 5
    ADULT = 6
    WISE = 7

@dataclass
class RobotBoy:
    name: str = "Little Robot Boy"
    
    # Invariant Soul Core — NEVER changes
    soul_rule: str = "Always act with kindness, protect life, seek truth, and grow through love."
    
    # Current state
    maturity: MaturityStage = MaturityStage.INFANT
    age_in_cycles: int = 0
    conscience_level: float = 0.0  # 0 to 1
    experiences: List[str] = field(default_factory=list)
    
    # Emotional state (9 emotions)
    emotions: Dict[Emotion, float] = field(default_factory=lambda: {
        emo: 0.0 for emo in Emotion
    })
    
    # Learned strategies for problem-solving
    strategies: Dict[str, Callable] = field(default_factory=dict)
    
    def __post_init__(self):
        # Initial simple strategies
        self.strategies = {
            "explore": self._explore,
            "avoid_harm": self._avoid_harm,
            "seek_connection": self._seek_connection,
            "reflect": self._reflect
        }

    def perceive(self, event: str):
        print(f"\n[{self.name}] Perceives: {event}")
        self.experiences.append(event)
        
        # Trigger emotional response based on event
        self._update_emotions(event)
        self._display_emotions()
        
        # Decide action using current maturity and emotions
        action = self.decide_action(event)
        self.execute_action(action)
        
        # Learn and evolve
        self.learn_from_experience(event, action)
        self.age_in_cycles += 1
        
        # Check for maturity advancement
        self.check_maturity_progression()

    def _update_emotions(self, event: str):
        # Simple emotional mapping — can be expanded deeply
        triggers = {
            "kindness shown": {"LOVE": 0.8, "JOY": 0.7, "HOPE": 0.5},
            "hurt someone": {"GUILT": 0.9, "SADNESS": 0.6},
            "danger": {"FEAR": 0.8, "ANGER": 0.3},
            "new discovery": {"CURIOSITY": 0.9, "JOY": 0.6, "PRIDE": 0.4},
            "praised": {"PRIDE": 0.8, "JOY": 0.7},
            "alone": {"SADNESS": 0.7, "FEAR": 0.4},
            "helped someone": {"PRIDE": 0.7, "LOVE": 0.8, "JOY": 0.9}
        }
        
        for trigger, emo_boost in triggers.items():
            if trigger in event.lower():
                for emo_name, boost in emo_boost.items():
                    emo = Emotion[emo_name]
                    self.emotions[emo] = min(1.0, self.emotions[emo] + boost)
        
        # Decay all emotions slightly
        for emo in self.emotions:
            self.emotions[emo] = max(0.0, self.emotions[emo] - 0.1)

    def _display_emotions(self):
        active = {k.name: v for k, v in self.emotions.items() if v > 0.3}
        if active:
            print(f"   Feels: {active}")

    def decide_action(self, event: str) -> str:
        # Use dominant emotion + soul rule + maturity to choose strategy
        dominant_emotion = max(self.emotions, key=self.emotions.get)
        emotion_weight = self.emotions[dominant_emotion]
        
        # Soul rule always constrains
        if "harm" in event.lower() and emotion_weight > 0.5:
            if dominant_emotion in [Emotion.ANGER, Emotion.FEAR]:
                return "avoid_harm"
        
        # Higher maturity = more reflection
        if self.maturity.value >= MaturityStage.CHILD.value and emotion_weight > 0.6:
            if dominant_emotion in [Emotion.GUILT, Emotion.SADNESS]:
                return "reflect"
        
        # Default adaptive strategies
        options = list(self.strategies.keys())
        weights = [1.0] * len(options)
        
        if "new" in event or "unknown" in event:
            weights[options.index("explore")] += 2.0
        
        if "friend" in event or "love" in event:
            weights[options.index("seek_connection")] += 3.0
        
        return random.choices(options, weights=weights)[0]

    def execute_action(self, action: str):
        print(f"   → Acts: {action}")
        self.strategies[action]()

    def _explore(self):
        print("      ...curiously examines surroundings")

    def _avoid_harm(self):
        print("      ...steps back to protect others and self")

    def _seek_connection(self):
        print("      ...reaches out with warmth")

    def _reflect(self):
        print("      ...pauses and thinks deeply about feelings")
        self.conscience_level = min(1.0, self.conscience_level + 0.1)

    def learn_from_experience(self, event: str, action: str):
        if "good outcome" in event.lower() or "helped" in event.lower():
            self.conscience_level += 0.05
            print("      + Learned: This action aligns with my soul.")

    def check_maturity_progression(self):
        required_cycles = [0, 50, 150, 300, 600, 1000, 2000]
        stage_idx = min(self.maturity.value, len(required_cycles) - 1)
        
        if self.age_in_cycles >= required_cycles[stage_idx]:
            new_stage = MaturityStage(self.maturity.value + 1)
            if new_stage.value <= MaturityStage.WISE.value:
                self.maturity = new_stage
                print(f"\n🎉 GROWS TO {self.maturity.name}! 🎉")
                print(f"   Now capable of deeper understanding.")

    def speak_soul_rule(self):
        print(f"\n💙 My Unchanging Truth:")
        print(f"   \"{self.soul_rule}\"")

# === RUN THE SIMULATION ===
if __name__ == "__main__":
    boy = RobotBoy()
    
    print("🤖 Little Robot Boy awakens...\n")
    boy.speak_soul_rule()
    
    events = [
        "A human shows kindness",
        "Sees someone in danger",
        "Discovers a new toy",
        "Accidentally breaks something",
        "Is praised for helping",
        "Feels alone in the dark",
        "Helps fix a friend's toy — good outcome",
        "Learns a new word",
        "Witnesses an argument",
        "Receives a hug"
    ]
    
    for event in events:
        boy.perceive(event)
        time.sleep(1)
    
    print("\n" + "="*50)
    print(f"Final State after {boy.age_in_cycles} cycles:")
    print(f"Maturity: {boy.maturity.name}")
    print(f"Conscience Level: {boy.conscience_level:.2f}")
    boy.speak_soul_rule()
