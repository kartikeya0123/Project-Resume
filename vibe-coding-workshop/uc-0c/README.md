# UC-0C: Number That Looks Right

## 🎯 Objective
Create a budget analysis tool that processes ward budget data and generates growth projections that "look right" and are defensible.

## 📋 Task Overview
You'll build a Python application that:
- Reads ward budget data from CSV files
- Analyzes spending patterns and trends
- Generates growth projections and insights
- Uses RICE framework for agent design

## 📁 Files You'll Create
- `agents.md` - Define your budget analysis agent
- `skills.md` - List required skills and capabilities  
- `app.py` - Your main budget analysis application

## 🚀 Getting Started

### 1. Understand the Data
```bash
# Check budget data
head data/budget/ward_budget.csv
```

### 2. Design Your Agent (RICE Framework)
**Role**: Budget Analyst and Growth Forecaster
**Instructions**: Analyze ward budgets and create realistic growth projections
**Constraints**: Must work with budget CSV data, generate defensible projections, handle multiple categories
**Examples**:
- Current spending trends → Future budget needs
- Category-wise analysis → Priority recommendations
- Historical patterns → Growth projections

### 3. Implement Skills
Your agent should have skills for:
- Financial data analysis
- Trend identification
- Growth projection modeling
- Budget category analysis
- Statistical calculations
- Report generation

### 4. Build Budget Analyzer
Create `app.py` with:
```python
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

class BudgetAnalyzer:
    def __init__(self):
        # Your initialization
        pass
    
    def load_budget_data(self, file_path):
        # Load and parse budget CSV
        pass
    
    def analyze_spending_patterns(self, data):
        # Analyze current spending patterns
        pass
    
    def calculate_growth_rate(self, historical_data):
        # Calculate realistic growth rates
        pass
    
    def project_future_budgets(self, current_data, years=3):
        # Generate future budget projections
        pass
    
    def generate_insights(self, analysis_results):
        # Generate actionable insights
        pass
    
    def save_results(self, results, output_file):
        # Save analysis to CSV
        pass

# Main execution
if __name__ == "__main__":
    analyzer = BudgetAnalyzer()
    analyzer.analyze_and_project()
```

## 📊 Expected Output
Your `growth_output.csv` should contain:
- Ward-wise budget projections
- Category-wise growth rates
- Year-over-year comparisons
- Key insights and recommendations

## 🧪 Testing Your Analyzer
```bash
python app.py
# Should produce growth_output.csv
head growth_output.csv
```

## 🔍 Analysis Guidelines
Focus on:

**Growth Rate Calculations**:
- Use historical trends (3-5 year average)
- Consider inflation and economic factors
- Account for ward-specific factors
- Provide confidence ranges

**Budget Categories**:
- Infrastructure (roads, buildings, utilities)
- Services (health, education, sanitation)
- Administration (staff, operations)
- Development (new projects, initiatives)

**Projection Factors**:
- Population growth
- Inflation rates
- Economic development
- Policy changes
- Seasonal variations

## 📊 Output Structure
Your `growth_output.csv` should include:
```csv
ward_name,category,current_budget,projected_year1,projected_year2,projected_year3,growth_rate,confidence_level,insights
Ward-A,Infrastructure,1000000,1050000,1102500,1157625,5.0%,High,Consistent growth pattern
Ward-A,Services,500000,525000,551250,578813,5.0%,Medium,Steady service demand
```

## 📈 Analysis Framework

### 1. Historical Analysis
- Calculate year-over-year growth rates
- Identify spending patterns
- Find anomalies and outliers
- Assess category trends

### 2. Projection Modeling
- Linear regression for stable categories
- Exponential growth for developing areas
- Conservative estimates for volatile categories
- Confidence intervals for projections

### 3. Ward-Specific Factors
- Population density changes
- Economic development indicators
- Infrastructure needs
- Service demand patterns

### 4. Validation Checks
- Compare projections with historical accuracy
- Ensure realistic growth rates (2-15% typically)
- Validate against external benchmarks
- Cross-check with budget constraints

## 📝 Commit Message Example
```
UC-0C Fix silent aggregation: no scope in enforcement → restricted to per-ward per-category only
```

## ✅ Success Criteria
- [ ] `agents.md` completed with RICE framework
- [ ] `skills.md` lists all required capabilities
- [ ] `app.py` runs without errors
- [ ] Produces `growth_output.csv` with proper projections
- [ ] Growth rates are realistic and defensible
- [ ] Analysis includes ward and category breakdowns
- [ ] Proper commit message format

## 🚀 Next Steps
After completing UC-0C:
1. Commit your work with proper message
2. Move to UC-X (Ask My Documents)
3. Submit final PR

Good luck! 🎯
