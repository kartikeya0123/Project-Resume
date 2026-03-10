#!/usr/bin/env python3
"""
UC-X: Ask My Documents
Document Q&A System with Multi-Source Search and Attribution
"""

import os
import re
import json
import csv
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple, Optional
import logging
from collections import defaultdict
import difflib

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class DocumentQA:
    """Main class for document Q&A system"""
    
    def __init__(self):
        """Initialize the Q&A system"""
        self.document_index = {}
        self.policy_docs = {}
        self.budget_data = {}
        self.complaint_data = {}
        self.conversation_context = []
        self.search_history = []
        
        # Question patterns
        self.question_patterns = {
            'policy': [
                r'what is (the )?policy',
                r'what are (the )?rules',
                r'how to (apply for|request)',
                r'what (is the )?procedure',
                r'leave policy',
                r'it policy',
                r'finance policy',
                r'reimbursement'
            ],
            'budget': [
                r'which ward',
                r'how much',
                r'budget',
                r'spending',
                r'allocation',
                r'cost',
                r'financial'
            ],
            'complaint': [
                r'how many complaints',
                r'complaints about',
                r'issues with',
                r'problems with',
                r'concerns about'
            ],
            'cross_document': [
                r'how does',
                r'relationship between',
                r'impact of',
                r'connection between'
            ]
        }
        
        # Document type priorities
        self.source_priorities = {
            'policy': 0.9,
            'budget': 0.8,
            'complaint': 0.7
        }

    def index_documents(self):
        """Index all available documents"""
        logger.info("Starting document indexing")
        
        # Index policy documents
        self._index_policy_documents()
        
        # Index budget data
        self._index_budget_data()
        
        # Index complaint data
        self._index_complaint_data()
        
        logger.info(f"Document indexing complete: {len(self.document_index)} documents indexed")

    def _index_policy_documents(self):
        """Index policy documents"""
        policy_dir = Path("data/policy-documents")
        
        if not policy_dir.exists():
            logger.warning(f"Policy directory not found: {policy_dir}")
            return
        
        for policy_file in policy_dir.glob("*.txt"):
            try:
                with open(policy_file, 'r', encoding='utf-8') as file:
                    content = file.read()
                
                policy_name = policy_file.stem.replace('policy_', '').replace('_', ' ').title()
                
                # Parse sections
                sections = self._parse_policy_sections(content)
                
                self.policy_docs[policy_name] = {
                    'file_path': str(policy_file),
                    'content': content,
                    'sections': sections,
                    'word_count': len(content.split()),
                    'type': 'policy'
                }
                
                # Add to main index
                self.document_index[f"policy_{policy_name}"] = {
                    'name': policy_name,
                    'type': 'policy',
                    'content': content,
                    'sections': sections,
                    'source': str(policy_file)
                }
                
                logger.info(f"Indexed policy: {policy_name}")
                
            except Exception as e:
                logger.error(f"Error indexing policy {policy_file}: {e}")

    def _index_budget_data(self):
        """Index budget data"""
        budget_file = Path("data/budget/ward_budget.csv")
        
        if not budget_file.exists():
            logger.warning(f"Budget file not found: {budget_file}")
            return
        
        try:
            with open(budget_file, 'r', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                budget_rows = list(reader)
            
            self.budget_data['ward_budget'] = {
                'file_path': str(budget_file),
                'data': budget_rows,
                'total_records': len(budget_rows),
                'type': 'budget'
            }
            
            # Add to main index
            self.document_index['budget_ward_budget'] = {
                'name': 'ward_budget',
                'type': 'budget',
                'data': budget_rows,
                'source': str(budget_file)
            }
            
            logger.info(f"Indexed budget data: {len(budget_rows)} records")
            
        except Exception as e:
            logger.error(f"Error indexing budget data: {e}")

    def _index_complaint_data(self):
        """Index complaint data"""
        complaint_dir = Path("data/city-test-files")
        
        if not complaint_dir.exists():
            logger.warning(f"Complaint directory not found: {complaint_dir}")
            return
        
        for complaint_file in complaint_dir.glob("test_*.csv"):
            try:
                city_name = complaint_file.stem.replace('test_', '')
                
                with open(complaint_file, 'r', encoding='utf-8') as file:
                    reader = csv.DictReader(file)
                    complaint_rows = list(reader)
                
                self.complaint_data[city_name] = {
                    'file_path': str(complaint_file),
                    'data': complaint_rows,
                    'total_records': len(complaint_rows),
                    'type': 'complaint'
                }
                
                # Add to main index
                self.document_index[f'complaint_{city_name}'] = {
                    'name': city_name,
                    'type': 'complaint',
                    'data': complaint_rows,
                    'source': str(complaint_file)
                }
                
                logger.info(f"Indexed complaint data for {city_name}: {len(complaint_rows)} records")
                
            except Exception as e:
                logger.error(f"Error indexing complaint data {complaint_file}: {e}")

    def _parse_policy_sections(self, content: str) -> List[Dict]:
        """Parse policy document into sections"""
        sections = []
        lines = content.split('\n')
        current_section = None
        current_content = []
        
        for line in lines:
            line = line.strip()
            
            # Check for section headers
            if re.match(r'^\d+\.', line) or re.match(r'^[a-z]\.', line):
                # Save previous section
                if current_section:
                    current_section['content'] = '\n'.join(current_content)
                    sections.append(current_section)
                
                # Start new section
                current_section = {
                    'title': line,
                    'content': '',
                    'line_number': len(sections) + 1
                }
                current_content = []
            elif line and current_section:
                current_content.append(line)
        
        # Add last section
        if current_section:
            current_section['content'] = '\n'.join(current_content)
            sections.append(current_section)
        
        return sections

    def classify_question(self, question: str) -> str:
        """Classify question type"""
        question_lower = question.lower()
        
        for q_type, patterns in self.question_patterns.items():
            for pattern in patterns:
                if re.search(pattern, question_lower):
                    return q_type
        
        return 'general'

    def search_policies(self, query: str) -> List[Dict]:
        """Search policy documents"""
        results = []
        query_lower = query.lower()
        
        for policy_name, policy_info in self.policy_docs.items():
            content = policy_info['content'].lower()
            sections = policy_info['sections']
            
            # Full-text search
            score = 0
            matches = []
            
            # Check main content
            if query_lower in content:
                score += len(query_lower.split()) * 2
                matches.append(('content', 'Main document'))
            
            # Check sections
            for section in sections:
                section_content = section['content'].lower()
                if query_lower in section_content:
                    score += len(query_lower.split())
                    matches.append(('section', section['title']))
            
            if score > 0:
                results.append({
                    'document_type': 'policy',
                    'document_name': policy_name,
                    'score': score,
                    'matches': matches,
                    'source': policy_info['file_path'],
                    'confidence': 'high' if score > 10 else 'medium'
                })
        
        return sorted(results, key=lambda x: x['score'], reverse=True)

    def search_budgets(self, query: str) -> List[Dict]:
        """Search budget data"""
        results = []
        query_lower = query.lower()
        
        if 'ward_budget' not in self.budget_data:
            return results
        
        budget_data = self.budget_data['ward_budget']['data']
        
        for row in budget_data:
            score = 0
            matches = []
            
            # Search ward name
            ward_name = row.get('ward_name', '').lower()
            if query_lower in ward_name:
                score += 3
                matches.append(('ward', ward_name))
            
            # Search category
            category = row.get('category', '').lower()
            if query_lower in category:
                score += 2
                matches.append(('category', category))
            
            # Search for budget-related terms
            if any(term in query_lower for term in ['budget', 'spending', 'cost', 'amount']):
                score += 1
                matches.append(('data', 'Budget information'))
            
            if score > 0:
                results.append({
                    'document_type': 'budget',
                    'document_name': 'ward_budget',
                    'score': score,
                    'matches': matches,
                    'data': row,
                    'source': self.budget_data['ward_budget']['file_path'],
                    'confidence': 'high' if score > 3 else 'medium'
                })
        
        return sorted(results, key=lambda x: x['score'], reverse=True)

    def search_complaints(self, query: str) -> List[Dict]:
        """Search complaint data"""
        results = []
        query_lower = query.lower()
        
        for city_name, complaint_info in self.complaint_data.items():
            complaint_data = complaint_info['data']
            
            city_matches = 0
            city_results = []
            
            for row in complaint_data:
                score = 0
                matches = []
                
                # Search complaint text
                complaint_text = row.get('complaint_text', '').lower()
                if query_lower in complaint_text:
                    score += len(query_lower.split())
                    matches.append(('complaint_text', complaint_text[:100] + '...'))
                
                # Search category
                category = row.get('category', '').lower()
                if query_lower in category:
                    score += 2
                    matches.append(('category', category))
                
                # Search location
                location = row.get('location', '').lower()
                if query_lower in location:
                    score += 1
                    matches.append(('location', location))
                
                if score > 0:
                    city_results.append({
                        'score': score,
                        'matches': matches,
                        'data': row
                    })
                    city_matches += 1
            
            if city_matches > 0:
                results.append({
                    'document_type': 'complaint',
                    'document_name': city_name,
                    'score': sum(r['score'] for r in city_results),
                    'matches': city_matches,
                    'results': city_results,
                    'source': complaint_info['file_path'],
                    'confidence': 'high' if city_matches > 5 else 'medium'
                })
        
        return sorted(results, key=lambda x: x['score'], reverse=True)

    def answer_question(self, question: str) -> Dict:
        """Main Q&A logic with source attribution"""
        # Classify question
        q_type = self.classify_question(question)
        
        # Search all document types
        policy_results = self.search_policies(question)
        budget_results = self.search_budgets(question)
        complaint_results = self.search_complaints(question)
        
        # Combine and rank results
        all_results = policy_results + budget_results + complaint_results
        all_results = sorted(all_results, key=lambda x: x['score'], reverse=True)
        
        # Generate answer based on question type and results
        if q_type == 'policy':
            answer = self._generate_policy_answer(question, policy_results)
        elif q_type == 'budget':
            answer = self._generate_budget_answer(question, budget_results)
        elif q_type == 'complaint':
            answer = self._generate_complaint_answer(question, complaint_results)
        else:
            answer = self._generate_general_answer(question, all_results)
        
        # Add to conversation context
        self.conversation_context.append({
            'question': question,
            'answer': answer,
            'timestamp': datetime.now().isoformat()
        })
        
        return answer

    def _generate_policy_answer(self, question: str, results: List[Dict]) -> Dict:
        """Generate answer for policy questions"""
        if not results:
            return {
                'answer': "I couldn't find specific information about that policy in the available documents.",
                'confidence': 'low',
                'sources': [],
                'question_type': 'policy'
            }
        
        best_result = results[0]
        policy_name = best_result['document_name']
        policy_info = self.policy_docs[policy_name]
        
        # Extract relevant content
        relevant_content = []
        for match_type, match_detail in best_result['matches']:
            if match_type == 'section':
                for section in policy_info['sections']:
                    if section['title'] == match_detail:
                        relevant_content.append(f"From {match_detail}: {section['content'][:200]}...")
                        break
            elif match_type == 'content':
                relevant_content.append(f"From policy document: {policy_info['content'][:300]}...")
        
        answer_text = '\n\n'.join(relevant_content) if relevant_content else "Policy information found but content extraction failed."
        
        return {
            'answer': answer_text,
            'confidence': best_result['confidence'],
            'sources': [{
                'type': 'policy',
                'name': policy_name,
                'file': best_result['source'],
                'matches': best_result['matches']
            }],
            'question_type': 'policy'
        }

    def _generate_budget_answer(self, question: str, results: List[Dict]) -> Dict:
        """Generate answer for budget questions"""
        if not results:
            return {
                'answer': "I couldn't find specific budget information matching your query.",
                'confidence': 'low',
                'sources': [],
                'question_type': 'budget'
            }
        
        best_result = results[0]
        data = best_result['data']
        
        # Format budget information
        answer_parts = []
        
        if 'ward_name' in data:
            answer_parts.append(f"Ward: {data['ward_name']}")
        
        if 'category' in data:
            answer_parts.append(f"Category: {data['category']}")
        
        if 'current_budget' in data:
            budget = data['current_budget']
            try:
                budget_value = float(budget)
                answer_parts.append(f"Current Budget: ₹{budget_value:,.0f}")
            except:
                answer_parts.append(f"Current Budget: {budget}")
        
        if 'last_year_budget' in data:
            last_budget = data['last_year_budget']
            try:
                last_value = float(last_budget)
                answer_parts.append(f"Last Year Budget: ₹{last_value:,.0f}")
            except:
                answer_parts.append(f"Last Year Budget: {last_budget}")
        
        answer_text = '\n'.join(answer_parts)
        
        return {
            'answer': answer_text,
            'confidence': best_result['confidence'],
            'sources': [{
                'type': 'budget',
                'name': 'ward_budget',
                'file': best_result['source'],
                'data': data
            }],
            'question_type': 'budget'
        }

    def _generate_complaint_answer(self, question: str, results: List[Dict]) -> Dict:
        """Generate answer for complaint questions"""
        if not results:
            return {
                'answer': "I couldn't find specific complaint information matching your query.",
                'confidence': 'low',
                'sources': [],
                'question_type': 'complaint'
            }
        
        best_result = results[0]
        city_name = best_result['document_name']
        complaint_info = self.complaint_data[city_name]
        
        # Count relevant complaints
        relevant_complaints = best_result['results']
        total_complaints = len(relevant_complaints)
        
        answer_parts = [f"Found {total_complaints} relevant complaints in {city_name}:"]
        
        # Show top 3 complaints
        for i, complaint in enumerate(relevant_complaints[:3]):
            data = complaint['data']
            complaint_text = data.get('complaint_text', 'No text available')
            category = data.get('category', 'Unknown')
            location = data.get('location', 'Unknown')
            
            answer_parts.append(f"{i+1}. [{category}] {location}: {complaint_text[:100]}...")
        
        answer_text = '\n'.join(answer_parts)
        
        return {
            'answer': answer_text,
            'confidence': best_result['confidence'],
            'sources': [{
                'type': 'complaint',
                'name': city_name,
                'file': best_result['source'],
                'total_matches': total_complaints
            }],
            'question_type': 'complaint'
        }

    def _generate_general_answer(self, question: str, results: List[Dict]) -> Dict:
        """Generate answer for general questions"""
        if not results:
            return {
                'answer': "I couldn't find relevant information to answer your question in the available documents.",
                'confidence': 'low',
                'sources': [],
                'question_type': 'general'
            }
        
        # Combine information from different sources
        answer_parts = ["I found information from multiple sources:"]
        sources = []
        
        for result in results[:3]:  # Top 3 results
            source_type = result['document_type']
            source_name = result['document_name']
            
            if source_type == 'policy':
                answer_parts.append(f"Policy document '{source_name}' contains relevant information.")
            elif source_type == 'budget':
                answer_parts.append(f"Budget data '{source_name}' has related financial information.")
            elif source_type == 'complaint':
                answer_parts.append(f"Complaint data for '{source_name}' contains relevant issues.")
            
            sources.append({
                'type': source_type,
                'name': source_name,
                'file': result['source'],
                'score': result['score']
            })
        
        answer_text = '\n'.join(answer_parts)
        
        return {
            'answer': answer_text,
            'confidence': 'medium',
            'sources': sources,
            'question_type': 'general'
        }

    def format_answer(self, answer: Dict) -> str:
        """Format answer for display"""
        lines = []
        
        # Main answer
        lines.append(f"ANSWER: {answer['answer']}")
        lines.append("")
        
        # Confidence
        lines.append(f"CONFIDENCE: {answer['confidence'].upper()}")
        lines.append("")
        
        # Sources
        lines.append("SOURCES:")
        for source in answer['sources']:
            if source['type'] == 'policy':
                lines.append(f"- Policy Document: {source['name']} ({source['file']})")
            elif source['type'] == 'budget':
                lines.append(f"- Budget Data: {source['name']} ({source['file']})")
            elif source['type'] == 'complaint':
                lines.append(f"- Complaint Data: {source['name']} ({source['file']})")
        lines.append("")
        
        # Additional context
        if len(self.conversation_context) > 1:
            lines.append("PREVIOUS QUESTIONS:")
            for i, ctx in enumerate(self.conversation_context[-3:-1], 1):
                lines.append(f"{i}. {ctx['question']}")
            lines.append("")
        
        return '\n'.join(lines)

    def interactive_mode(self):
        """Interactive Q&A mode"""
        print("=== Document Q&A System ===")
        print("Available documents: Policies, Budget Data, Complaint Data")
        print("Type 'quit' to exit, 'help' for commands")
        print()
        
        while True:
            try:
                question = input("Ask a question: ").strip()
                
                if question.lower() == 'quit':
                    print("Goodbye!")
                    break
                elif question.lower() == 'help':
                    print("\nAvailable commands:")
                    print("- Ask about policies: 'What is the leave policy?'")
                    print("- Ask about budgets: 'Which ward has the highest budget?'")
                    print("- Ask about complaints: 'How many water complaints?'")
                    print("- Type 'quit' to exit")
                    print()
                    continue
                elif not question:
                    continue
                
                # Process question
                answer = self.answer_question(question)
                formatted_answer = self.format_answer(answer)
                
                print("\n" + "="*50)
                print(formatted_answer)
                print("="*50)
                print()
                
            except KeyboardInterrupt:
                print("\nGoodbye!")
                break
            except Exception as e:
                print(f"Error: {e}")

def main():
    """Main execution function"""
    logger.info("Starting UC-X: Ask My Documents")
    
    try:
        qa_system = DocumentQA()
        
        # Index documents
        qa_system.index_documents()
        
        # Start interactive mode
        qa_system.interactive_mode()
        
    except Exception as e:
        logger.error(f"Document Q&A system failed: {e}")
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
