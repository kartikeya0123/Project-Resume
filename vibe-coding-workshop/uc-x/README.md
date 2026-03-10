# UC-X: Ask My Documents

## 🎯 Objective
Create an intelligent document Q&A system that can answer questions about policy documents, budget data, and complaint patterns.

## 📋 Task Overview
You'll build a Python application that:
- Indexes multiple document types (policies, budgets, complaints)
- Answers natural language questions about the documents
- Provides source attribution for answers
- Uses RICE framework for agent design

## 📁 Files You'll Create
- `agents.md` - Define your document Q&A agent
- `skills.md` - List required skills and capabilities  
- `app.py` - Your main Q&A application

## 🚀 Getting Started

### 1. Understand the Data
```bash
# Check all available documents
ls data/city-test-files/
ls data/policy-documents/
ls data/budget/
```

### 2. Design Your Agent (RICE Framework)
**Role**: Document Intelligence Assistant
**Instructions**: Answer questions about city documents with proper source attribution
**Constraints**: Must work with multiple document types, provide accurate sources, handle various question types
**Examples**:
- "What is the leave policy for sick days?" → Answer with policy source
- "Which ward has the highest budget?" → Answer with budget data source
- "How many water complaints were filed?" → Answer with complaint data source

### 3. Implement Skills
Your agent should have skills for:
- Document indexing and search
- Natural language understanding
- Information extraction
- Source attribution
- Cross-document analysis
- Question answering

### 4. Build Q&A System
Create `app.py` with:
```python
import os
import re
import json
from typing import Dict, List, Tuple

class DocumentQA:
    def __init__(self):
        # Your initialization
        self.document_index = {}
        self.policy_docs = {}
        self.budget_data = {}
        self.complaint_data = {}
    
    def index_documents(self):
        # Index all available documents
        pass
    
    def search_policies(self, query):
        # Search policy documents
        pass
    
    def search_budgets(self, query):
        # Search budget data
        pass
    
    def search_complaints(self, query):
        # Search complaint data
        pass
    
    def answer_question(self, question):
        # Main Q&A logic with source attribution
        pass
    
    def format_answer(self, answer, sources):
        # Format answer with proper citations
        pass
    
    def interactive_mode(self):
        # Interactive Q&A session
        pass

# Main execution
if __name__ == "__main__":
    qa_system = DocumentQA()
    qa_system.interactive_mode()
```

## 📊 Expected Functionality
Your system should:
- Index all document types automatically
- Answer questions with proper source attribution
- Handle different question types (policy, budget, complaints)
- Provide confidence scores for answers
- Support follow-up questions

## 🧪 Testing Your Q&A System
```bash
python app.py
# Should start interactive Q&A mode
> What is the annual leave policy?
> Which ward spends the most on infrastructure?
> How many complaints were about water supply?
```

## 🔍 Question Types to Handle

### Policy Questions
- "What is the leave policy for sick days?"
- "How do I request reimbursement?"
- "What are the IT acceptable use rules?"
- "What documents do I need for leave?"

### Budget Questions
- "Which ward has the highest budget?"
- "How much is spent on education?"
- "What is the infrastructure budget?"
- "Compare budgets between wards"

### Complaint Questions
- "How many complaints about water supply?"
- "What are the most common complaint types?"
- "Which ward has the most complaints?"
- "What are the high-priority complaints?"

### Cross-Document Questions
- "How does the budget support complaint resolution?"
- "What policies address common complaints?"
- "Are there budget allocations for policy implementation?"

## 📝 Answer Format
Your answers should include:
```
ANSWER: [Clear, direct answer to the question]

CONFIDENCE: [High/Medium/Low]

SOURCES:
- Document: [policy_hr_leave.txt, Section 2.1]
- Data: [ward_budget.csv, Ward-A row]
- Reference: [test_pune.csv, complaint #123]

ADDITIONAL CONTEXT:
[Relevant additional information if helpful]
```

## 🔍 Search Strategy

### 1. Keyword Matching
- Extract key terms from questions
- Match against document content
- Rank by relevance and frequency

### 2. Semantic Search
- Understand question intent
- Find conceptually related content
- Handle synonyms and variations

### 3. Source Attribution
- Always cite specific sources
- Include document names and sections
- Provide confidence levels
- Cross-reference when needed

### 4. Answer Generation
- Extract relevant information
- Synthesize from multiple sources
- Ensure accuracy and completeness
- Format for clarity

## 📝 Commit Message Example
```
UC-X Fix cross-doc blending: no single-source rule → added single-source attribution enforcement
```

## ✅ Success Criteria
- [ ] `agents.md` completed with RICE framework
- [ ] `skills.md` lists all required capabilities
- [ ] `app.py` runs without errors
- [ ] Handles all three document types
- [ ] Provides proper source attribution
- [ ] Interactive Q&A mode works
- [ ] Answers are accurate and well-sourced
- [ ] Proper commit message format

## 🚀 Final Steps
After completing UC-X:
1. Commit your work with proper message
2. Ensure all 4 UCs are complete
3. Submit final PR with template filled
4. Celebrate your completion! 🎉

Good luck! 🎯
