#!/usr/bin/env python3
"""
Setup script for Vibe Coding Workshop
Creates necessary directories and validates setup
"""

import os
import sys
from pathlib import Path

def create_directories():
    """Create necessary directories"""
    directories = [
        'data/city-test-files',
        'data/policy-documents', 
        'data/budget',
        'uc-0a',
        'uc-0b',
        'uc-0c',
        'uc-x',
        '.github/PULL_REQUEST_TEMPLATE'
    ]
    
    for directory in directories:
        Path(directory).mkdir(parents=True, exist_ok=True)
        print(f"✅ Created directory: {directory}")

def check_python_version():
    """Check Python version"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 9):
        print("❌ Python 3.9+ is required")
        return False
    else:
        print(f"✅ Python version: {version.major}.{version.minor}.{version.micro}")
        return True

def check_files():
    """Check if all required files exist"""
    required_files = [
        'README.md',
        'FAQ.md',
        'requirements.txt',
        'uc-0a/README.md',
        'uc-0a/agents.md',
        'uc-0a/skills.md',
        'uc-0a/classifier.py',
        'uc-0b/README.md',
        'uc-0b/agents.md',
        'uc-0b/skills.md',
        'uc-0b/app.py',
        'uc-0c/README.md',
        'uc-0c/agents.md',
        'uc-0c/skills.md',
        'uc-0c/app.py',
        'uc-x/README.md',
        'uc-x/agents.md',
        'uc-x/skills.md',
        'uc-x/app.py',
        'data/city-test-files/test_pune.csv',
        'data/city-test-files/test_hyderabad.csv',
        'data/city-test-files/test_kolkata.csv',
        'data/city-test-files/test_ahmedabad.csv',
        'data/policy-documents/policy_hr_leave.txt',
        'data/policy-documents/policy_it_acceptable_use.txt',
        'data/policy-documents/policy_finance_reimbursement.txt',
        'data/budget/ward_budget.csv',
        '.github/PULL_REQUEST_TEMPLATE/submission.md'
    ]
    
    missing_files = []
    for file_path in required_files:
        if not Path(file_path).exists():
            missing_files.append(file_path)
    
    if missing_files:
        print("❌ Missing files:")
        for file_path in missing_files:
            print(f"   - {file_path}")
        return False
    else:
        print("✅ All required files present")
        return True

def test_uc_0a():
    """Test UC-0A classifier"""
    try:
        sys.path.append('uc-0a')
        from classifier import ComplaintClassifier
        
        classifier = ComplaintClassifier()
        print("✅ UC-0A classifier imports successfully")
        return True
    except Exception as e:
        print(f"❌ UC-0A import error: {e}")
        return False

def test_uc_0b():
    """Test UC-0B summarizer"""
    try:
        sys.path.append('uc-0b')
        from app import PolicySummarizer
        
        summarizer = PolicySummarizer()
        print("✅ UC-0B summarizer imports successfully")
        return True
    except Exception as e:
        print(f"❌ UC-0B import error: {e}")
        return False

def test_uc_0c():
    """Test UC-0C analyzer"""
    try:
        sys.path.append('uc-0c')
        from app import BudgetAnalyzer
        
        analyzer = BudgetAnalyzer()
        print("✅ UC-0C analyzer imports successfully")
        return True
    except Exception as e:
        print(f"❌ UC-0C import error: {e}")
        return False

def test_uc_x():
    """Test UC-X Q&A system"""
    try:
        sys.path.append('uc-x')
        from app import DocumentQA
        
        qa_system = DocumentQA()
        print("✅ UC-X Q&A system imports successfully")
        return True
    except Exception as e:
        print(f"❌ UC-X import error: {e}")
        return False

def main():
    """Main setup validation"""
    print("🚀 Vibe Coding Workshop Setup Validation")
    print("=" * 50)
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Create directories
    create_directories()
    
    # Check files
    if not check_files():
        print("\n❌ Setup incomplete. Missing files detected.")
        sys.exit(1)
    
    # Test imports
    print("\n🧪 Testing UC imports:")
    uc_tests = [
        test_uc_0a(),
        test_uc_0b(),
        test_uc_0c(),
        test_uc_x()
    ]
    
    if all(uc_tests):
        print("\n✅ All UCs import successfully!")
        print("\n🎉 Setup validation complete!")
        print("\n📋 Next steps:")
        print("1. Choose your city (pune, hyderabad, kolkata, ahmedabad)")
        print("2. Run: python uc-0a/classifier.py [city_name]")
        print("3. Run: python uc-0b/app.py")
        print("4. Run: python uc-0c/app.py")
        print("5. Run: python uc-x/app.py")
        print("6. Commit your work with proper messages")
        print("7. Submit PR when all UCs are complete")
    else:
        print("\n❌ Some UCs have import errors. Please check the error messages above.")
        sys.exit(1)

if __name__ == "__main__":
    main()
