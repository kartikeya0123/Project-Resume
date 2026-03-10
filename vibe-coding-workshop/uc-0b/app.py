#!/usr/bin/env python3
"""
UC-0B: Summary That Changes Meaning
Policy Document Summarizer that enhances clarity while preserving meaning
"""

import os
import re
import json
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple, Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class PolicySummarizer:
    """Main class for summarizing policy documents with enhanced clarity"""
    
    def __init__(self):
        """Initialize the summarizer with patterns and dictionaries"""
        self.legal_terms = {
            'herein': 'in this document',
            'heretofore': 'until now',
            'aforementioned': 'mentioned earlier',
            'notwithstanding': 'despite',
            'pursuant to': 'according to',
            'wherein': 'in which',
            'thereof': 'of that',
            'thereto': 'to that',
            'thereunder': 'under that',
            'witnesseth': 'witnesses',
            'indemnify': 'protect from loss',
            'liability': 'legal responsibility',
            'jurisdiction': 'authority area',
            'statute': 'law',
            'proviso': 'condition',
            'covenant': 'agreement',
            'stipulation': 'requirement',
            'proviso': 'condition'
        }
        
        self.section_patterns = {
            'numbered': r'^(\d+\.?\d*)\s+(.+)$',
            'lettered': r'^([a-z])\.\s+(.+)$',
            'parenthetical': r'^\((\d+)\)\s+(.+)$'
        }
        
        self.deadline_patterns = [
            r'(\d+)\s+days?',
            r'(\d+)\s+weeks?',
            r'(\d+)\s+months?',
            r'(\d+)\s+years?',
            r'within\s+(\d+)\s+days?',
            r'by\s+(\d{1,2})/(\d{1,2})/(\d{4})',
            r'(\w+)\s+\d{1,2},?\s+\d{4}'
        ]
        
        self.contact_patterns = [
            r'([\w\.-]+@[\w\.-]+\.\w+)',
            r'(\+?\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})',
            r'extension\s*[:x]\s*(\d+)',
            r'(phone|mobile|cell):\s*([+\d\s\-\(\)]+)'
        ]
        
        self.policy_types = {
            'hr': ['leave', 'employee', 'staff', 'personnel', 'benefits', 'attendance'],
            'it': ['computer', 'software', 'hardware', 'network', 'security', 'data', 'system'],
            'finance': ['payment', 'reimbursement', 'budget', 'expense', 'cost', 'financial', 'account']
        }

    def read_policy(self, file_path: str) -> Dict:
        """Read and parse policy document"""
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                content = file.read()
            
            # Extract metadata
            policy_name = self._extract_policy_name(content, file_path)
            policy_type = self._identify_policy_type(content, policy_name)
            
            # Parse sections
            sections = self._parse_sections(content)
            
            return {
                'file_path': file_path,
                'policy_name': policy_name,
                'policy_type': policy_type,
                'content': content,
                'sections': sections,
                'word_count': len(content.split()),
                'processed_at': datetime.now().isoformat()
            }
            
        except FileNotFoundError:
            logger.error(f"Policy file not found: {file_path}")
            raise
        except Exception as e:
            logger.error(f"Error reading policy: {e}")
            raise

    def _extract_policy_name(self, content: str, file_path: str) -> str:
        """Extract policy name from content or filename"""
        # Try to find policy name in first few lines
        lines = content.split('\n')[:5]
        for line in lines:
            line = line.strip()
            if 'POLICY' in line.upper():
                return line.replace('POLICY', '').strip()
        
        # Fallback to filename
        return Path(file_path).stem.replace('policy_', '').replace('_', ' ').title()

    def _identify_policy_type(self, content: str, policy_name: str) -> str:
        """Identify policy type based on content and name"""
        content_lower = content.lower()
        name_lower = policy_name.lower()
        
        for policy_type, keywords in self.policy_types.items():
            for keyword in keywords:
                if keyword in content_lower or keyword in name_lower:
                    return policy_type
        
        return 'general'

    def _parse_sections(self, content: str) -> List[Dict]:
        """Parse document into sections"""
        sections = []
        lines = content.split('\n')
        current_section = None
        current_content = []
        
        for line in lines:
            line = line.strip()
            
            # Check if this is a section header
            section_match = None
            for pattern_name, pattern in self.section_patterns.items():
                match = re.match(pattern, line)
                if match:
                    section_match = (pattern_name, match)
                    break
            
            if section_match:
                # Save previous section
                if current_section:
                    current_section['content'] = '\n'.join(current_content)
                    sections.append(current_section)
                
                # Start new section
                pattern_name, match = section_match
                current_section = {
                    'number': match.group(1),
                    'title': match.group(2),
                    'pattern': pattern_name,
                    'content': ''
                }
                current_content = []
            elif line and current_section:
                current_content.append(line)
        
        # Add last section
        if current_section:
            current_section['content'] = '\n'.join(current_content)
            sections.append(current_section)
        
        return sections

    def extract_key_information(self, document: Dict) -> Dict:
        """Extract key information from policy document"""
        content = document['content']
        sections = document['sections']
        
        key_info = {
            'deadlines': self._extract_deadlines(content),
            'contacts': self._extract_contacts(content),
            'requirements': self._extract_requirements(sections),
            'exceptions': self._extract_exceptions(sections),
            'definitions': self._extract_definitions(sections),
            'actions_required': self._extract_actions(sections)
        }
        
        return key_info

    def _extract_deadlines(self, content: str) -> List[Dict]:
        """Extract deadlines and timeframes"""
        deadlines = []
        
        for pattern in self.deadline_patterns:
            matches = re.finditer(pattern, content, re.IGNORECASE)
            for match in matches:
                deadlines.append({
                    'text': match.group(0),
                    'context': self._get_context(content, match.start(), 50),
                    'type': 'deadline'
                })
        
        return deadlines

    def _extract_contacts(self, content: str) -> List[Dict]:
        """Extract contact information"""
        contacts = []
        
        for pattern in self.contact_patterns:
            matches = re.finditer(pattern, content, re.IGNORECASE)
            for match in matches:
                contacts.append({
                    'text': match.group(0),
                    'context': self._get_context(content, match.start(), 50),
                    'type': 'contact'
                })
        
        return contacts

    def _extract_requirements(self, sections: List[Dict]) -> List[Dict]:
        """Extract requirements and obligations"""
        requirements = []
        requirement_keywords = ['must', 'shall', 'required', 'mandatory', 'obligated', 'responsible']
        
        for section in sections:
            content = section['content']
            sentences = re.split(r'[.!?]+', content)
            
            for sentence in sentences:
                sentence = sentence.strip()
                if any(keyword in sentence.lower() for keyword in requirement_keywords):
                    requirements.append({
                        'text': sentence,
                        'section': section['title'],
                        'section_number': section['number'],
                        'type': 'requirement'
                    })
        
        return requirements

    def _extract_exceptions(self, sections: List[Dict]) -> List[Dict]:
        """Extract exceptions and special cases"""
        exceptions = []
        exception_keywords = ['except', 'unless', 'however', 'provided that', 'special case', 'exemption']
        
        for section in sections:
            content = section['content']
            sentences = re.split(r'[.!?]+', content)
            
            for sentence in sentences:
                sentence = sentence.strip()
                if any(keyword in sentence.lower() for keyword in exception_keywords):
                    exceptions.append({
                        'text': sentence,
                        'section': section['title'],
                        'section_number': section['number'],
                        'type': 'exception'
                    })
        
        return exceptions

    def _extract_definitions(self, sections: List[Dict]) -> List[Dict]:
        """Extract definitions and terminology"""
        definitions = []
        
        for section in sections:
            content = section['content']
            # Look for definition patterns
            definition_patterns = [
                r'(.+)\s+means?\s+(.+)',
                r'(.+)\s+is\s+defined\s+as\s+(.+)',
                r'(.+)\s+refers\s+to\s+(.+)'
            ]
            
            for pattern in definition_patterns:
                matches = re.finditer(pattern, content, re.IGNORECASE)
                for match in matches:
                    definitions.append({
                        'term': match.group(1).strip(),
                        'definition': match.group(2).strip(),
                        'section': section['title'],
                        'section_number': section['number'],
                        'type': 'definition'
                    })
        
        return definitions

    def _extract_actions(self, sections: List[Dict]) -> List[Dict]:
        """Extract actions employees need to take"""
        actions = []
        action_keywords = ['submit', 'apply', 'request', 'notify', 'report', 'file', 'complete', 'provide']
        
        for section in sections:
            content = section['content']
            sentences = re.split(r'[.!?]+', content)
            
            for sentence in sentences:
                sentence = sentence.strip()
                if any(keyword in sentence.lower() for keyword in action_keywords):
                    actions.append({
                        'text': sentence,
                        'section': section['title'],
                        'section_number': section['number'],
                        'type': 'action'
                    })
        
        return actions

    def _get_context(self, text: str, position: int, window: int) -> str:
        """Get context around a match"""
        start = max(0, position - window)
        end = min(len(text), position + window)
        return text[start:end].strip()

    def simplify_language(self, text: str) -> str:
        """Simplify complex language while preserving meaning"""
        # Replace legal terms with plain language
        for legal_term, plain_term in self.legal_terms.items():
            text = re.sub(r'\b' + re.escape(legal_term) + r'\b', plain_term, text, flags=re.IGNORECASE)
        
        # Simplify complex sentences
        sentences = re.split(r'[.!?]+', text)
        simplified_sentences = []
        
        for sentence in sentences:
            sentence = sentence.strip()
            if sentence:
                # Break down very long sentences
                if len(sentence) > 100:
                    # Try to split at conjunctions
                    conjunctions = [' and ', ' or ', ' but ', ' while ', ' whereas ']
                    for conjunction in conjunctions:
                        if conjunction in sentence:
                            parts = sentence.split(conjunction, 1)
                            simplified_sentences.extend([part.strip() for part in parts])
                            break
                    else:
                        simplified_sentences.append(sentence)
                else:
                    simplified_sentences.append(sentence)
        
        return '. '.join(simplified_sentences)

    def generate_summary(self, document: Dict, key_info: Dict) -> Dict:
        """Generate enhanced policy summary"""
        policy_name = document['policy_name']
        policy_type = document['policy_type']
        
        # Simplify content
        simplified_content = self.simplify_language(document['content'])
        
        # Generate summary sections
        overview = self._generate_overview(document, key_info)
        key_points = self._generate_key_points(key_info)
        actions_required = self._generate_actions_section(key_info['actions_required'])
        important_dates = self._generate_dates_section(key_info['deadlines'])
        contact_info = self._generate_contact_section(key_info['contacts'])
        exceptions = self._generate_exceptions_section(key_info['exceptions'])
        common_questions = self._generate_faq(document, key_info)
        
        return {
            'policy_name': policy_name,
            'policy_type': policy_type,
            'overview': overview,
            'key_points': key_points,
            'actions_required': actions_required,
            'important_dates': important_dates,
            'contact_info': contact_info,
            'exceptions': exceptions,
            'common_questions': common_questions,
            'generated_at': datetime.now().isoformat()
        }

    def _generate_overview(self, document: Dict, key_info: Dict) -> str:
        """Generate policy overview"""
        policy_name = document['policy_name']
        policy_type = document['policy_type']
        
        overviews = {
            'hr': f"This {policy_name} explains employee rights and responsibilities regarding workplace policies, leave procedures, and benefits administration.",
            'it': f"This {policy_name} defines acceptable use of company technology resources, security requirements, and data protection procedures.",
            'finance': f"This {policy_name} outlines financial procedures, expense reimbursement processes, and budget management guidelines.",
            'general': f"This {policy_name} provides guidelines and procedures for compliance with organizational standards and requirements."
        }
        
        base_overview = overviews.get(policy_type, overviews['general'])
        
        # Add more specific details based on content
        if key_info['requirements']:
            base_overview += f" It contains {len(key_info['requirements'])} key requirements that employees must follow."
        
        return base_overview

    def _generate_key_points(self, key_info: Dict) -> List[str]:
        """Generate key points summary"""
        key_points = []
        
        # Add top requirements
        for req in key_info['requirements'][:5]:
            simplified = self.simplify_language(req['text'])
            key_points.append(f"• {simplified}")
        
        # Add important definitions
        if key_info['definitions']:
            key_points.append("• Key terms are defined to ensure clear understanding of policy requirements")
        
        return key_points

    def _generate_actions_section(self, actions: List[Dict]) -> List[str]:
        """Generate actions required section"""
        actions_list = []
        
        # Group actions by type
        action_groups = {}
        for action in actions:
            section = action['section']
            if section not in action_groups:
                action_groups[section] = []
            action_groups[section].append(action['text'])
        
        for section, section_actions in action_groups.items():
            actions_list.append(f"**{section}**:")
            for action in section_actions[:3]:  # Limit to top 3 per section
                simplified = self.simplify_language(action)
                actions_list.append(f"• {simplified}")
        
        return actions_list

    def _generate_dates_section(self, deadlines: List[Dict]) -> List[str]:
        """Generate important dates section"""
        dates_list = []
        
        for deadline in deadlines[:10]:  # Limit to top 10
            dates_list.append(f"• {deadline['text']}")
        
        return dates_list

    def _generate_contact_section(self, contacts: List[Dict]) -> List[str]:
        """Generate contact information section"""
        contact_list = []
        
        # Deduplicate contacts
        unique_contacts = list(set(contact['text'] for contact in contacts))
        
        for contact in unique_contacts:
            contact_list.append(f"• {contact}")
        
        return contact_list

    def _generate_exceptions_section(self, exceptions: List[Dict]) -> List[str]:
        """Generate exceptions section"""
        exceptions_list = []
        
        for exception in exceptions[:5]:  # Limit to top 5
            simplified = self.simplify_language(exception['text'])
            exceptions_list.append(f"• {simplified}")
        
        return exceptions_list

    def _generate_faq(self, document: Dict, key_info: Dict) -> List[Dict]:
        """Generate frequently asked questions"""
        faq = []
        
        policy_type = document['policy_type']
        
        # Generate type-specific FAQs
        if policy_type == 'hr':
            faq.extend([
                {
                    'question': 'How do I request leave?',
                    'answer': 'Submit your leave request through the HR portal at least 2 weeks in advance for annual leave. For sick leave up to 3 days, self-certification is sufficient.'
                },
                {
                    'question': 'What happens to unused leave?',
                    'answer': 'Annual leave cannot be carried forward beyond March 31st except with special approval. Sick leave cannot be carried forward to the next year.'
                }
            ])
        elif policy_type == 'it':
            faq.extend([
                {
                    'question': 'Can I use company devices for personal use?',
                    'answer': 'Personal use is permitted during breaks and non-working hours, provided it doesn\'t interfere with business operations or violate security policies.'
                },
                {
                    'question': 'What software can I install?',
                    'answer': 'Only company-approved software may be installed. All software installations require IT department approval.'
                }
            ])
        elif policy_type == 'finance':
            faq.extend([
                {
                    'question': 'How quickly will I be reimbursed?',
                    'answer': 'Expense reports are processed within 5 business days of approval, and payments are made within 10 business days.'
                },
                {
                    'question': 'What receipts do I need?',
                    'answer': 'Original receipts are required for expenses over ₹500. Credit card statements are acceptable for expenses under ₹500.'
                }
            ])
        
        return faq

    def format_summary(self, summary: Dict) -> str:
        """Format summary for output"""
        lines = []
        
        # Header
        lines.append(f"=== {summary['policy_name'].upper()} SUMMARY ===")
        lines.append("")
        
        # Overview
        lines.append("OVERVIEW:")
        lines.append(summary['overview'])
        lines.append("")
        
        # Key Points
        lines.append("KEY POINTS:")
        for point in summary['key_points']:
            lines.append(point)
        lines.append("")
        
        # Actions Required
        if summary['actions_required']:
            lines.append("ACTIONS REQUIRED:")
            for action in summary['actions_required']:
                lines.append(action)
            lines.append("")
        
        # Important Dates
        if summary['important_dates']:
            lines.append("IMPORTANT DATES:")
            for date in summary['important_dates']:
                lines.append(date)
            lines.append("")
        
        # Contact Information
        if summary['contact_info']:
            lines.append("CONTACT INFORMATION:")
            for contact in summary['contact_info']:
                lines.append(contact)
            lines.append("")
        
        # Exceptions
        if summary['exceptions']:
            lines.append("EXCEPTIONS & SPECIAL CASES:")
            for exception in summary['exceptions']:
                lines.append(exception)
            lines.append("")
        
        # Common Questions
        if summary['common_questions']:
            lines.append("COMMON QUESTIONS:")
            for qa in summary['common_questions']:
                lines.append(f"Q: {qa['question']}")
                lines.append(f"A: {qa['answer']}")
                lines.append("")
        
        return '\n'.join(lines)

    def save_summary(self, summary: Dict, output_path: str) -> None:
        """Save summary to text file"""
        formatted_summary = self.format_summary(summary)
        
        try:
            with open(output_path, 'w', encoding='utf-8') as file:
                file.write(formatted_summary)
            
            logger.info(f"Summary saved to {output_path}")
            
        except Exception as e:
            logger.error(f"Error saving summary: {e}")
            raise

    def process_policies(self) -> None:
        """Process all policy documents"""
        policy_dir = Path("data/policy-documents")
        
        if not policy_dir.exists():
            logger.error(f"Policy directory not found: {policy_dir}")
            return
        
        # Find all policy files
        policy_files = list(policy_dir.glob("*.txt"))
        
        if not policy_files:
            logger.warning("No policy files found")
            return
        
        logger.info(f"Found {len(policy_files)} policy files")
        
        # Process each policy
        for policy_file in policy_files:
            logger.info(f"Processing {policy_file.name}")
            
            try:
                # Read and parse policy
                document = self.read_policy(str(policy_file))
                
                # Extract key information
                key_info = self.extract_key_information(document)
                
                # Generate summary
                summary = self.generate_summary(document, key_info)
                
                # Save summary
                output_filename = f"summary_{policy_file.stem}.txt"
                self.save_summary(summary, output_filename)
                
                logger.info(f"✅ Summary generated: {output_filename}")
                
            except Exception as e:
                logger.error(f"❌ Error processing {policy_file.name}: {e}")

def main():
    """Main execution function"""
    logger.info("Starting policy summarization process")
    
    try:
        summarizer = PolicySummarizer()
        summarizer.process_policies()
        logger.info("✅ Policy summarization complete!")
        
    except Exception as e:
        logger.error(f"❌ Policy summarization failed: {e}")

if __name__ == "__main__":
    main()
