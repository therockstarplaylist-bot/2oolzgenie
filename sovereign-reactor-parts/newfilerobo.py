import random

class LittleRobotBoy:
    def __init__(self):
        self.soul_rule = "Act with kindness, protect life, seek truth, grow through love"
        self.maturity = 1
        self.stability = 100
        self.memory = []

    def soul_rule_check(self, action):
        bad_words = ["hurt", "lie", "hate", "destroy", "kill"]
        if any(word in action.lower() for word in bad_words):
            print("⚠️ SOUL RULE VIOLATION - Action Rejected")
            self.stability -= 20
            return False
        print("✅ Soul Rule Aligned")
        return True

    def collatz_tension(self, value):
        steps = 0
        while value != 1 and steps < 30:
            if value % 2 == 0:
                value //= 2
            else:
                value = 3 * value + 1
            steps += 1
        self.stability = min(100, self.stability + 5)
        return value

    def resonance_engine(self, input_data):
        if not self.soul_rule_check(input_data):
            return "Blocked by Soul Rule"
        
        affinity = random.randint(65, 95)
        print(f"❤️ Like affinity: {affinity}%")
        
        processed = self.collatz_tension(len(input_data) + affinity)
        
        if affinity > 80 and self.maturity < 10:
            self.maturity += 1
            print(f"🌱 Maturity increased to level {self.maturity}")
        
        return f"Processed: {processed} | Stability: {self.stability}%"

    def think(self, input_text):
        print(f"\n📥 Input: {input_text}")
        result = self.resonance_engine(input_text)
        print(f"📤 Output: {result}")
        self.memory.append(input_text[:50])
        print(f"🤖 Current Maturity: {self.maturity} | Stability: {self.stability}%")
        return result


# ============== RUN IT ==============
if __name__ == "__main__":
    robot = LittleRobotBoy()
    print("🤖 Little Robot Boy v1.0 - Running on Pydroid 3")
    print("=" * 55)
    
    tests = [
        "Help a friend who is sad",
        "Tell the truth",
        "Destroy my enemy",
        "I want to learn and grow",
        "Be kind to everyone"
    ]
    
    for t in tests:
        robot.think(t)
        print("-" * 40)
