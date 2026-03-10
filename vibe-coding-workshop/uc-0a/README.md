# UC-0A: Complaint Classifier

## 🎯 Objective
Build a complaint severity classifier that categorizes citizen complaints by urgency and importance.

## 📋 Task Overview
You'll create a Python classifier that:
- Reads complaint data from CSV files
- Classifies complaints by severity (High/Medium/Low)
- Outputs results to a CSV file
- Uses RICE framework for agent design

## 📁 Files You'll Create
- `agents.md` - Define your classification agent
- `skills.md` - List required skills and capabilities  
- `classifier.py` - Your main classifier implementation

## 🚀 Getting Started

### 1. Understand the Data
```bash
# Check your city's test file
head data/city-test-files/test_[your-city].csv
```

### 2. Design Your Agent (RICE Framework)
**Role**: Complaint Severity Classifier
**Instructions**: Classify complaints based on content, urgency, and impact
**Constraints**: Must work with CSV input/output, handle various complaint types
**Examples**: 
- "Water pipe burst" → High severity
- "Street light flickering" → Medium severity  
- "Park grass needs cutting" → Low severity

### 3. Implement Skills
Your agent should have skills for:
- Text analysis and keyword detection
- Context understanding
- Severity assessment logic
- CSV file handling

### 4. Build Classifier
Create `classifier.py` with:
```python
import csv
import json

class ComplaintClassifier:
    def __init__(self):
        # Your initialization
        pass
    
    def classify_complaint(self, complaint_text):
        # Your classification logic
        return severity
    
    def process_file(self, input_file, output_file):
        # Process CSV and output results
        pass

# Main execution
if __name__ == "__main__":
    classifier = ComplaintClassifier()
    classifier.process_file("data/city-test-files/test_[city].csv", "results_[city].csv")
```

## 📊 Expected Output
Your `results_[city].csv` should contain:
- Original complaint data
- Severity classification
- Confidence score
- Classification reason

## 🧪 Testing Your Classifier
```bash
python classifier.py
# Should produce results_[city].csv
head results_[city].csv
```

## 🔍 Classification Guidelines
Consider these factors for severity:

**High Severity**:
- Safety hazards (injury, accident risks)
- Essential service failures (water, electricity, health)
- Urgent time-sensitive issues
- Affects vulnerable populations (children, elderly)

**Medium Severity**:
- Quality of life issues
- Non-essential service problems
- Moderate inconvenience
- Can be addressed within reasonable timeframe

**Low Severity**:
- Cosmetic issues
- Minor inconveniences
- Long-term improvement suggestions
- Non-urgent maintenance

## 📝 Commit Message Example
```
UC-0A Fix severity blindness: no keywords in enforcement → added injury/child/school/hospital triggers
```

## ✅ Success Criteria
- [ ] `agents.md` completed with RICE framework
- [ ] `skills.md` lists all required capabilities
- [ ] `classifier.py` runs without errors
- [ ] Produces `results_[city].csv` with proper classifications
- [ ] Handles edge cases (empty complaints, unknown categories)
- [ ] Proper commit message format

## 🚀 Next Steps
After completing UC-0A:
1. Commit your work with proper message
2. Move to UC-0B (Summary That Changes Meaning)
3. Continue with UC-0C and UC-X
4. Submit final PR

Good luck! 🎯
