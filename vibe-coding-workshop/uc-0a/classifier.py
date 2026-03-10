#!/usr/bin/env python3
"""
UC-0A: Complaint Classifier
Classifies citizen complaints by severity (High/Medium/Low)
"""

import csv
import re
import json
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple, Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class ComplaintClassifier:
    """Main classifier for citizen complaints severity assessment"""
    
    def __init__(self):
        """Initialize the classifier with keywords and rules"""
        self.high_severity_keywords = [
            # Safety hazards
            'injury', 'accident', 'danger', 'hazard', 'unsafe', 'emergency',
            'fire', 'flood', 'burst', 'collapse', 'electrocution', 'poison',
            'gas leak', 'explosion', 'structural', 'falling', 'sharp',
            
            # Essential services
            'water supply', 'electricity', 'power outage', 'sewage', 'drainage',
            'hospital', 'ambulance', 'police', 'fire brigade', 'emergency services',
            
            # Vulnerable populations
            'school', 'children', 'elderly', 'hospital', 'clinic', 'disabled',
            'day care', 'nursing home', 'playground', 'school bus',
            
            # Infrastructure failures
            'bridge collapse', 'road damage', 'building collapse', 'pipe burst',
            'main break', 'transformer', 'power line', 'tree fall', 'street collapse'
        ]
        
        self.medium_severity_keywords = [
            # Quality of life
            'noise', 'street light', 'garbage', 'waste', 'cleaning', 'maintenance',
            'repair', 'pothole', 'traffic', 'parking', 'stray animals',
            
            # Service issues
            'delay', 'slow', 'inefficient', 'poor service', 'staff behavior',
            'response time', 'waiting', 'queue', 'appointment',
            
            # Environmental issues
            'pollution', 'air quality', 'water quality', 'smell', 'odor',
            'mosquito', 'pests', 'sanitation', 'hygiene'
        ]
        
        self.urgency_indicators = [
            'immediately', 'urgent', 'emergency', 'critical', 'life threatening',
            'right now', 'asap', 'today', 'cannot wait', 'serious', 'severe'
        ]
        
        self.context_rules = {
            'infrastructure': {'weight': 0.8, 'categories': ['road', 'bridge', 'building', 'pipe', 'cable']},
            'safety': {'weight': 0.9, 'categories': ['accident', 'injury', 'fire', 'flood']},
            'health': {'weight': 0.85, 'categories': ['hospital', 'clinic', 'medicine', 'emergency']},
            'education': {'weight': 0.7, 'categories': ['school', 'college', 'student']},
            'utilities': {'weight': 0.75, 'categories': ['water', 'electricity', 'gas', 'sewage']}
        }
        
        # Classification statistics
        self.stats = {
            'total_processed': 0,
            'high_severity': 0,
            'medium_severity': 0,
            'low_severity': 0,
            'unclassified': 0
        }

    def preprocess_text(self, text: str) -> str:
        """Clean and normalize complaint text"""
        if not text:
            return ""
        
        # Convert to lowercase
        text = text.lower().strip()
        
        # Remove special characters but keep spaces
        text = re.sub(r'[^\w\s]', ' ', text)
        
        # Normalize multiple spaces
        text = re.sub(r'\s+', ' ', text)
        
        # Handle common abbreviations
        abbreviations = {
            'rd': 'road',
            'st': 'street',
            'ave': 'avenue',
            'blvd': 'boulevard',
            'ln': 'lane',
            'dr': 'drive',
            'hwy': 'highway',
            'no': 'number',
            'dept': 'department',
            'govt': 'government'
        }
        
        for abbr, full in abbreviations.items():
            text = re.sub(r'\b' + abbr + r'\b', full, text)
        
        return text.strip()

    def extract_keywords(self, text: str) -> List[str]:
        """Extract relevant keywords from complaint text"""
        keywords = []
        processed_text = self.preprocess_text(text)
        
        # Check for high severity keywords
        for keyword in self.high_severity_keywords:
            if keyword in processed_text:
                keywords.append(('high', keyword))
        
        # Check for medium severity keywords
        for keyword in self.medium_severity_keywords:
            if keyword in processed_text:
                keywords.append(('medium', keyword))
        
        # Check for urgency indicators
        for urgency in self.urgency_indicators:
            if urgency in processed_text:
                keywords.append(('urgency', urgency))
        
        return keywords

    def analyze_context(self, complaint: Dict) -> Dict:
        """Analyze complaint context for better classification"""
        text = complaint.get('complaint_text', '')
        processed_text = self.preprocess_text(text)
        
        context_scores = {}
        
        # Check each context category
        for category, config in self.context_rules.items():
            score = 0
            for subcategory in config['categories']:
                if subcategory in processed_text:
                    score += config['weight']
            context_scores[category] = score
        
        # Determine primary context
        primary_context = max(context_scores.items(), key=lambda x: x[1]) if context_scores else ('general', 0)
        
        return {
            'context_scores': context_scores,
            'primary_context': primary_context[0],
            'context_strength': primary_context[1]
        }

    def calculate_severity_score(self, complaint: Dict) -> Tuple[float, str, str]:
        """Calculate severity score and return classification with reasoning"""
        text = complaint.get('complaint_text', '')
        
        if not text or len(text.strip()) < 3:
            return 0.0, 'Low', 'Insufficient information for classification'
        
        # Extract keywords
        keywords = self.extract_keywords(text)
        
        # Analyze context
        context = self.analyze_context(complaint)
        
        # Calculate base score from keywords
        high_score = len([k for k in keywords if k[0] == 'high']) * 0.3
        medium_score = len([k for k in keywords if k[0] == 'medium']) * 0.2
        urgency_score = len([k for k in keywords if k[0] == 'urgency']) * 0.4
        
        # Add context score
        context_score = context['context_strength'] * 0.1
        
        # Calculate total score
        total_score = high_score + medium_score + urgency_score + context_score
        
        # Normalize score to 0-1 range
        total_score = min(total_score, 1.0)
        
        # Determine classification
        if total_score >= 0.7:
            classification = 'High'
            reasoning = self._generate_high_reasoning(keywords, context)
        elif total_score >= 0.4:
            classification = 'Medium'
            reasoning = self._generate_medium_reasoning(keywords, context)
        else:
            classification = 'Low'
            reasoning = self._generate_low_reasoning(keywords, context)
        
        return total_score, classification, reasoning

    def _generate_high_reasoning(self, keywords: List, context: Dict) -> str:
        """Generate reasoning for high severity classification"""
        high_keywords = [k[1] for k in keywords if k[0] == 'high']
        urgency_keywords = [k[1] for k in keywords if k[0] == 'urgency']
        
        reasoning_parts = []
        
        if high_keywords:
            reasoning_parts.append(f"High-impact indicators: {', '.join(high_keywords[:3])}")
        
        if urgency_keywords:
            reasoning_parts.append(f"Urgency factors: {', '.join(urgency_keywords[:2])}")
        
        if context['context_strength'] > 0:
            reasoning_parts.append(f"Context: {context['primary_context']} (impact: {context['context_strength']:.1f})")
        
        return '; '.join(reasoning_parts) if reasoning_parts else "High severity based on overall assessment"

    def _generate_medium_reasoning(self, keywords: List, context: Dict) -> str:
        """Generate reasoning for medium severity classification"""
        medium_keywords = [k[1] for k in keywords if k[0] == 'medium']
        
        reasoning_parts = []
        
        if medium_keywords:
            reasoning_parts.append(f"Service quality issues: {', '.join(medium_keywords[:3])}")
        
        if context['context_strength'] > 0:
            reasoning_parts.append(f"Context: {context['primary_context']} (moderate impact)")
        
        return '; '.join(reasoning_parts) if reasoning_parts else "Medium severity based on service impact"

    def _generate_low_reasoning(self, keywords: List, context: Dict) -> str:
        """Generate reasoning for low severity classification"""
        reasoning_parts = []
        
        if keywords:
            reasoning_parts.append("Minor issues detected")
        else:
            reasoning_parts.append("No critical indicators found")
        
        reasoning_parts.append("Routine maintenance or cosmetic issue")
        
        return '; '.join(reasoning_parts)

    def classify_complaint(self, complaint: Dict) -> Dict:
        """Classify a single complaint"""
        try:
            score, severity, reasoning = self.calculate_severity_score(complaint)
            
            # Update statistics
            self.stats['total_processed'] += 1
            if severity == 'High':
                self.stats['high_severity'] += 1
            elif severity == 'Medium':
                self.stats['medium_severity'] += 1
            elif severity == 'Low':
                self.stats['low_severity'] += 1
            else:
                self.stats['unclassified'] += 1
            
            return {
                'original_complaint_id': complaint.get('id', ''),
                'complaint_text': complaint.get('complaint_text', ''),
                'severity': severity,
                'confidence_score': round(score, 3),
                'reasoning': reasoning,
                'classification_timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error classifying complaint: {e}")
            self.stats['unclassified'] += 1
            return {
                'original_complaint_id': complaint.get('id', ''),
                'complaint_text': complaint.get('complaint_text', ''),
                'severity': 'Unclassified',
                'confidence_score': 0.0,
                'reasoning': f'Classification error: {str(e)}',
                'classification_timestamp': datetime.now().isoformat()
            }

    def load_complaints(self, file_path: str) -> List[Dict]:
        """Load complaints from CSV file"""
        complaints = []
        
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                
                for row in reader:
                    # Standardize the complaint data
                    complaint = {
                        'id': row.get('id', row.get('complaint_id', f'complaint_{len(complaints)}')),
                        'complaint_text': row.get('complaint_text', row.get('text', row.get('description', ''))),
                        'category': row.get('category', row.get('type', 'general')),
                        'location': row.get('location', row.get('area', '')),
                        'date': row.get('date', row.get('timestamp', ''))
                    }
                    complaints.append(complaint)
                    
        except FileNotFoundError:
            logger.error(f"File not found: {file_path}")
            raise
        except Exception as e:
            logger.error(f"Error loading complaints: {e}")
            raise
        
        logger.info(f"Loaded {len(complaints)} complaints from {file_path}")
        return complaints

    def save_results(self, results: List[Dict], output_path: str) -> None:
        """Save classification results to CSV file"""
        if not results:
            logger.warning("No results to save")
            return
        
        try:
            fieldnames = [
                'original_complaint_id',
                'complaint_text',
                'severity',
                'confidence_score',
                'reasoning',
                'classification_timestamp'
            ]
            
            with open(output_path, 'w', newline='', encoding='utf-8') as file:
                writer = csv.DictWriter(file, fieldnames=fieldnames)
                writer.writeheader()
                writer.writerows(results)
            
            logger.info(f"Saved {len(results)} results to {output_path}")
            
        except Exception as e:
            logger.error(f"Error saving results: {e}")
            raise

    def process_file(self, input_file: str, output_file: str) -> None:
        """Process a file of complaints and classify them"""
        logger.info(f"Processing {input_file}")
        
        # Load complaints
        complaints = self.load_complaints(input_file)
        
        if not complaints:
            logger.warning("No complaints found in input file")
            return
        
        # Classify complaints
        results = []
        for i, complaint in enumerate(complaints):
            if i % 100 == 0:
                logger.info(f"Processed {i}/{len(complaints)} complaints")
            
            result = self.classify_complaint(complaint)
            results.append(result)
        
        # Save results
        self.save_results(results, output_file)
        
        # Log statistics
        self._log_statistics()

    def _log_statistics(self):
        """Log classification statistics"""
        total = self.stats['total_processed']
        if total == 0:
            return
        
        logger.info("=== Classification Statistics ===")
        logger.info(f"Total processed: {total}")
        logger.info(f"High severity: {self.stats['high_severity']} ({self.stats['high_severity']/total*100:.1f}%)")
        logger.info(f"Medium severity: {self.stats['medium_severity']} ({self.stats['medium_severity']/total*100:.1f}%)")
        logger.info(f"Low severity: {self.stats['low_severity']} ({self.stats['low_severity']/total*100:.1f}%)")
        logger.info(f"Unclassified: {self.stats['unclassified']} ({self.stats['unclassified']/total*100:.1f}%)")
        logger.info("================================")

def main():
    """Main execution function"""
    import sys
    
    # Check command line arguments
    if len(sys.argv) < 2:
        print("Usage: python classifier.py <city_name>")
        print("Available cities: pune, hyderabad, kolkata, ahmedabad")
        sys.exit(1)
    
    city = sys.argv[1].lower()
    valid_cities = ['pune', 'hyderabad', 'kolkata', 'ahmedabad']
    
    if city not in valid_cities:
        print(f"Error: Invalid city '{city}'. Valid cities: {', '.join(valid_cities)}")
        sys.exit(1)
    
    # File paths
    input_file = f"data/city-test-files/test_{city}.csv"
    output_file = f"results_{city}.csv"
    
    # Check if input file exists
    if not Path(input_file).exists():
        print(f"Error: Input file '{input_file}' not found")
        sys.exit(1)
    
    # Create classifier and process
    try:
        classifier = ComplaintClassifier()
        classifier.process_file(input_file, output_file)
        print(f"✅ Classification complete! Results saved to {output_file}")
        
    except Exception as e:
        logger.error(f"Classification failed: {e}")
        print(f"❌ Classification failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
