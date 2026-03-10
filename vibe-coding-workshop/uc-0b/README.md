# UC-0B: Summary That Changes Meaning

## 🎯 Objective
Create an AI agent that summarizes policy documents while potentially changing or enhancing the meaning for better understanding.

## 📋 Task Overview
You'll build a Python application that:
- Reads policy documents from text files
- Generates summaries that may rephrase or enhance meaning
- Outputs summaries to text files
- Uses RICE framework for agent design

## 📁 Files You'll Create
- `agents.md` - Define your summarization agent
- `skills.md` - List required skills and capabilities  
- `app.py` - Your main summarization application

## 🚀 Getting Started

### 1. Understand the Data
```bash
# Check policy documents
ls data/policy-documents/
cat data/policy-documents/policy_hr_leave.txt
```

### 2. Design Your Agent (RICE Framework)
**Role**: Policy Document Summarizer
**Instructions**: Read policy documents and create clear, actionable summaries
**Constraints**: Must preserve core meaning while improving clarity, handle various policy types
**Examples**:
- Complex legal language → Plain English summary
- Long policy → Key points summary
- Technical policy → User-friendly explanation

### 3. Implement Skills
Your agent should have skills for:
- Text comprehension and analysis
- Key point extraction
- Language simplification
- Policy structure understanding
- Meaning preservation while enhancing clarity

### 4. Build Summarizer
Create `app.py` with:
```python
import os
import re
from typing import Dict, List

class PolicySummarizer:
    def __init__(self):
        # Your initialization
        pass
    
    def read_policy(self, file_path):
        # Read and parse policy document
        pass
    
    def extract_key_points(self, content):
        # Extract main points from policy
        pass
    
    def generate_summary(self, content, policy_type):
        # Generate enhanced summary
        pass
    
    def process_policies(self):
        # Process all policy documents
        pass

# Main execution
if __name__ == "__main__":
    summarizer = PolicySummarizer()
    summarizer.process_policies()
```

## 📊 Expected Output
Your summaries should be saved as:
- `summary_hr_leave.txt` - HR leave policy summary
- `summary_it_acceptable_use.txt` - IT policy summary  
- `summary_finance_reimbursement.txt` - Finance policy summary

## 🧪 Testing Your Summarizer
```bash
python app.py
# Should produce summary_*.txt files
ls summary_*.txt
cat summary_hr_leave.txt
```

## 🔍 Summarization Guidelines
Focus on:

**Meaning Enhancement**:
- Simplify complex legal language
- Add practical examples
- Clarify ambiguous terms
- Structure for easy reading

**Key Information to Preserve**:
- Eligibility criteria
- Important deadlines
- Required actions
- Contact information
- Exceptions and special cases

**Structure Your Summary**:
1. **Overview** - What this policy covers
2. **Key Points** - Main takeaways in bullet points
3. **Actions Required** - What employees need to do
4. **Important Dates** - Deadlines and timeframes
5. **Contact Info** - Who to ask for help
6. **Exceptions** - Special cases or exemptions

## 📝 Example Summary Structure
```
=== HR LEAVE POLICY SUMMARY ===

OVERVIEW:
This policy explains how employees can request and use leave time.

KEY POINTS:
• Employees are entitled to 12 days of annual leave
• Sick leave requires doctor's note after 3 days
• Emergency leave available for family situations

ACTIONS REQUIRED:
• Submit leave requests 2 weeks in advance
• Provide documentation for extended sick leave
• Update leave calendar after approval

IMPORTANT DATES:
• Leave year: April 1 to March 31
• Carry-over deadline: March 15
• Documentation submission: Within 5 days of return

CONTACT:
HR Department: hr@company.com
Extension: x234
```

## 📝 Commit Message Example
```
UC-0B Fix clause omission: completeness not enforced → added every-numbered-clause rule
```

## ✅ Success Criteria
- [ ] `agents.md` completed with RICE framework
- [ ] `skills.md` lists all required capabilities
- [ ] `app.py` runs without errors
- [ ] Produces `summary_*.txt` files for all policies
- [ ] Summaries are clear and actionable
- [ ] Core meaning is preserved while enhancing clarity
- [ ] Proper commit message format

## 🚀 Next Steps
After completing UC-0B:
1. Commit your work with proper message
2. Move to UC-0C (Number That Looks Right)
3. Continue with UC-X
4. Submit final PR

Good luck! 🎯
