#!/usr/bin/env python3
"""
UC-0C: Number That Looks Right
Budget Analysis and Growth Projection Tool
"""

import pandas as pd
import numpy as np
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple, Optional
import logging
from scipy import stats
import json

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class BudgetAnalyzer:
    """Main class for budget analysis and growth projection"""
    
    def __init__(self):
        """Initialize the analyzer with models and constraints"""
        self.growth_constraints = {
            'min_growth': 0.02,  # 2% minimum
            'max_growth': 0.15,  # 15% maximum
            'typical_growth': {
                'Infrastructure': (0.05, 0.08),  # 5-8%
                'Services': (0.06, 0.10),         # 6-10%
                'Administration': (0.04, 0.06),   # 4-6%
                'Development': (0.08, 0.15)       # 8-15%
            }
        }
        
        self.economic_factors = {
            'inflation_rate': 0.06,  # 6% inflation
            'population_growth': 0.03,  # 3% population growth
            'economic_development': 0.04  # 4% economic growth
        }
        
        self.confidence_levels = {
            'high': 0.9,
            'medium': 0.7,
            'low': 0.5
        }

    def load_budget_data(self, file_path: str) -> pd.DataFrame:
        """Load and validate budget data from CSV"""
        try:
            df = pd.read_csv(file_path)
            
            # Validate required columns
            required_columns = ['ward_name', 'category', 'current_budget', 'last_year_budget']
            missing_columns = [col for col in required_columns if col not in df.columns]
            
            if missing_columns:
                logger.error(f"Missing required columns: {missing_columns}")
                raise ValueError(f"Missing columns: {missing_columns}")
            
            # Data cleaning and validation
            df['current_budget'] = pd.to_numeric(df['current_budget'], errors='coerce')
            df['last_year_budget'] = pd.to_numeric(df['last_year_budget'], errors='coerce')
            
            # Calculate historical growth rate
            df['historical_growth'] = (df['current_budget'] - df['last_year_budget']) / df['last_year_budget']
            df['historical_growth'] = df['historical_growth'].fillna(0)
            
            # Validate growth rates
            df['historical_growth'] = df['historical_growth'].clip(lower=self.growth_constraints['min_growth'], 
                                                                  upper=self.growth_constraints['max_growth'])
            
            logger.info(f"Loaded budget data: {len(df)} rows for {df['ward_name'].nunique()} wards")
            return df
            
        except FileNotFoundError:
            logger.error(f"Budget file not found: {file_path}")
            raise
        except Exception as e:
            logger.error(f"Error loading budget data: {e}")
            raise

    def analyze_spending_patterns(self, data: pd.DataFrame) -> Dict:
        """Analyze spending patterns across wards and categories"""
        analysis = {}
        
        # Ward-wise analysis
        ward_analysis = data.groupby('ward_name').agg({
            'current_budget': ['sum', 'mean'],
            'historical_growth': ['mean', 'std'],
            'category': 'count'
        }).round(2)
        
        # Category-wise analysis
        category_analysis = data.groupby('category').agg({
            'current_budget': ['sum', 'mean'],
            'historical_growth': ['mean', 'std'],
            'ward_name': 'nunique'
        }).round(2)
        
        # Overall statistics
        overall_stats = {
            'total_budget': data['current_budget'].sum(),
            'average_growth': data['historical_growth'].mean(),
            'growth_std': data['historical_growth'].std(),
            'budget_per_ward': data.groupby('ward_name')['current_budget'].sum().mean()
        }
        
        analysis = {
            'ward_analysis': ward_analysis.to_dict(),
            'category_analysis': category_analysis.to_dict(),
            'overall_stats': overall_stats,
            'data_quality': {
                'total_records': len(data),
                'wards_count': data['ward_name'].nunique(),
                'categories_count': data['category'].nunique(),
                'missing_data': data.isnull().sum().sum()
            }
        }
        
        return analysis

    def calculate_growth_rate(self, historical_data: List[float], category: str) -> Tuple[float, float, str]:
        """Calculate growth rate with confidence interval"""
        if len(historical_data) < 2:
            # Use category default if insufficient data
            default_range = self.growth_constraints['typical_growth'].get(category, (0.05, 0.08))
            return np.mean(default_range), 0.05, 'medium'
        
        # Calculate average growth rate
        growth_rates = []
        for i in range(1, len(historical_data)):
            if historical_data[i-1] > 0:
                rate = (historical_data[i] - historical_data[i-1]) / historical_data[i-1]
                growth_rates.append(rate)
        
        if not growth_rates:
            default_range = self.growth_constraints['typical_growth'].get(category, (0.05, 0.08))
            return np.mean(default_range), 0.05, 'medium'
        
        mean_growth = np.mean(growth_rates)
        std_growth = np.std(growth_rates) if len(growth_rates) > 1 else 0.02
        
        # Apply constraints
        mean_growth = np.clip(mean_growth, self.growth_constraints['min_growth'], self.growth_constraints['max_growth'])
        
        # Determine confidence level
        if std_growth < 0.02:
            confidence = 'high'
        elif std_growth < 0.05:
            confidence = 'medium'
        else:
            confidence = 'low'
        
        # Adjust for category norms
        category_range = self.growth_constraints['typical_growth'].get(category, (0.05, 0.08))
        if mean_growth < category_range[0]:
            mean_growth = category_range[0]
        elif mean_growth > category_range[1]:
            mean_growth = category_range[1]
        
        return mean_growth, std_growth, confidence

    def project_future_budgets(self, current_data: pd.DataFrame, years: int = 3) -> pd.DataFrame:
        """Generate future budget projections"""
        projections = []
        
        for _, row in current_data.iterrows():
            ward_name = row['ward_name']
            category = row['category']
            current_budget = row['current_budget']
            
            # Calculate growth rate
            growth_rate, std_growth, confidence = self.calculate_growth_rate(
                [row['last_year_budget'], row['current_budget']], category
            )
            
            # Adjust for economic factors
            adjusted_growth = self._adjust_for_economic_factors(growth_rate, category)
            
            # Project for each year
            for year in range(1, years + 1):
                projected_budget = current_budget * ((1 + adjusted_growth) ** year)
                
                # Calculate confidence interval
                confidence_interval = self._calculate_confidence_interval(
                    projected_budget, std_growth, year, confidence
                )
                
                # Generate insights
                insights = self._generate_insights(row, adjusted_growth, confidence)
                
                # Generate recommendations
                recommendations = self._generate_recommendations(row, adjusted_growth, category)
                
                projections.append({
                    'ward_name': ward_name,
                    'category': category,
                    'current_budget': current_budget,
                    'projected_year': year,
                    'projected_budget': round(projected_budget, 2),
                    'growth_rate': round(adjusted_growth * 100, 2),
                    'confidence_level': confidence,
                    'confidence_lower': round(confidence_interval[0], 2),
                    'confidence_upper': round(confidence_interval[1], 2),
                    'insights': insights,
                    'recommendations': recommendations
                })
        
        return pd.DataFrame(projections)

    def _adjust_for_economic_factors(self, base_growth: float, category: str) -> float:
        """Adjust growth rate for economic factors"""
        # Base adjustment
        adjusted_growth = base_growth
        
        # Category-specific adjustments
        if category == 'Infrastructure':
            adjusted_growth += self.economic_factors['population_growth'] * 0.5
            adjusted_growth += self.economic_factors['economic_development'] * 0.3
        elif category == 'Services':
            adjusted_growth += self.economic_factors['population_growth'] * 0.8
            adjusted_growth += self.economic_factors['inflation_rate'] * 0.4
        elif category == 'Administration':
            adjusted_growth += self.economic_factors['inflation_rate'] * 0.6
        elif category == 'Development':
            adjusted_growth += self.economic_factors['economic_development'] * 0.6
            adjusted_growth += self.economic_factors['population_growth'] * 0.4
        
        # Apply constraints
        adjusted_growth = np.clip(adjusted_growth, self.growth_constraints['min_growth'], 
                                self.growth_constraints['max_growth'])
        
        return adjusted_growth

    def _calculate_confidence_interval(self, projected_budget: float, std_growth: float, 
                                     year: int, confidence: str) -> Tuple[float, float]:
        """Calculate confidence interval for projections"""
        confidence_multiplier = {
            'high': 0.1,
            'medium': 0.2,
            'low': 0.3
        }
        
        multiplier = confidence_multiplier.get(confidence, 0.2)
        variance = (std_growth * year * multiplier) ** 2
        
        lower_bound = projected_budget * (1 - variance)
        upper_bound = projected_budget * (1 + variance)
        
        return max(0, lower_bound), upper_bound

    def _generate_insights(self, row: pd.Series, growth_rate: float, confidence: str) -> str:
        """Generate insights for the projection"""
        insights = []
        
        # Growth rate insight
        if growth_rate > 0.10:
            insights.append("High growth rate indicates expansion or development phase")
        elif growth_rate < 0.05:
            insights.append("Conservative growth suggests maintenance focus")
        else:
            insights.append("Moderate growth indicates stable development")
        
        # Confidence insight
        if confidence == 'high':
            insights.append("High confidence in projections based on stable patterns")
        elif confidence == 'low':
            insights.append("Lower confidence due to volatility in historical data")
        
        # Budget size insight
        if row['current_budget'] > 10000000:
            insights.append("Large budget allocation suggests priority area")
        elif row['current_budget'] < 3000000:
            insights.append("Smaller budget may indicate supporting role")
        
        return '; '.join(insights)

    def _generate_recommendations(self, row: pd.Series, growth_rate: float, category: str) -> str:
        """Generate recommendations based on analysis"""
        recommendations = []
        
        # Category-specific recommendations
        if category == 'Infrastructure':
            if growth_rate > 0.08:
                recommendations.append("Focus on capacity expansion and new projects")
            else:
                recommendations.append("Prioritize maintenance and efficiency improvements")
        elif category == 'Services':
            recommendations.append("Monitor service quality and population demands")
        elif category == 'Administration':
            recommendations.append("Look for efficiency improvements and cost optimization")
        elif category == 'Development':
            if growth_rate > 0.12:
                recommendations.append("Ensure sustainable growth and avoid overextension")
            else:
                recommendations.append("Consider strategic development initiatives")
        
        # Ward-specific recommendations
        if row['current_budget'] > row['last_year_budget'] * 1.15:
            recommendations.append("Monitor for sustainable growth patterns")
        
        return '; '.join(recommendations) if recommendations else "Continue current allocation strategy"

    def generate_summary_statistics(self, projections: pd.DataFrame) -> Dict:
        """Generate summary statistics for projections"""
        summary = {}
        
        # Overall projections
        summary['total_current_budget'] = projections[projections['projected_year'] == 1]['current_budget'].sum()
        summary['total_projected_budget_year1'] = projections[projections['projected_year'] == 1]['projected_budget'].sum()
        summary['total_projected_budget_year3'] = projections[projections['projected_year'] == 3]['projected_budget'].sum()
        
        # Growth statistics
        summary['average_growth_rate'] = projections['growth_rate'].mean()
        summary['max_growth_rate'] = projections['growth_rate'].max()
        summary['min_growth_rate'] = projections['growth_rate'].min()
        
        # Category breakdown
        category_summary = projections.groupby('category').agg({
            'projected_budget': 'sum',
            'growth_rate': 'mean'
        }).round(2)
        
        summary['category_breakdown'] = category_summary.to_dict()
        
        # Ward breakdown
        ward_summary = projections.groupby('ward_name').agg({
            'projected_budget': 'sum',
            'growth_rate': 'mean'
        }).round(2)
        
        summary['ward_breakdown'] = ward_summary.to_dict()
        
        # Confidence distribution
        confidence_dist = projections['confidence_level'].value_counts().to_dict()
        summary['confidence_distribution'] = confidence_dist
        
        return summary

    def save_results(self, projections: pd.DataFrame, summary: Dict, output_file: str) -> None:
        """Save analysis results to CSV"""
        try:
            # Prepare final output
            output_data = projections.copy()
            
            # Add summary rows at the end
            summary_row = {
                'ward_name': 'SUMMARY',
                'category': 'TOTAL',
                'current_budget': summary['total_current_budget'],
                'projected_year': 1,
                'projected_budget': summary['total_projected_budget_year1'],
                'growth_rate': summary['average_growth_rate'],
                'confidence_level': 'N/A',
                'confidence_lower': 'N/A',
                'confidence_upper': 'N/A',
                'insights': f"Total budget across all wards and categories",
                'recommendations': f"Average growth rate: {summary['average_growth_rate']:.2f}%"
            }
            
            # Append summary row
            output_data = pd.concat([output_data, pd.DataFrame([summary_row])], ignore_index=True)
            
            # Save to CSV
            output_data.to_csv(output_file, index=False)
            
            logger.info(f"Results saved to {output_file}")
            logger.info(f"Generated {len(projections)} projections for {projections['ward_name'].nunique()} wards")
            
        except Exception as e:
            logger.error(f"Error saving results: {e}")
            raise

    def analyze_and_project(self, input_file: str = "data/budget/ward_budget.csv", 
                          output_file: str = "growth_output.csv") -> None:
        """Main analysis and projection pipeline"""
        logger.info("Starting budget analysis and projection")
        
        try:
            # Load data
            data = self.load_budget_data(input_file)
            
            # Analyze spending patterns
            analysis = self.analyze_spending_patterns(data)
            logger.info("Spending pattern analysis completed")
            
            # Generate projections
            projections = self.project_future_budgets(data, years=3)
            logger.info("Budget projections generated")
            
            # Generate summary statistics
            summary = self.generate_summary_statistics(projections)
            logger.info("Summary statistics generated")
            
            # Save results
            self.save_results(projections, summary, output_file)
            
            # Log key insights
            logger.info("=== ANALYSIS SUMMARY ===")
            logger.info(f"Total current budget: ₹{summary['total_current_budget']:,.0f}")
            logger.info(f"Projected budget (Year 3): ₹{summary['total_projected_budget_year3']:,.0f}")
            logger.info(f"Average growth rate: {summary['average_growth_rate']:.2f}%")
            logger.info(f"Confidence distribution: {summary['confidence_distribution']}")
            logger.info("========================")
            
        except Exception as e:
            logger.error(f"Analysis failed: {e}")
            raise

def main():
    """Main execution function"""
    logger.info("Starting UC-0C: Number That Looks Right")
    
    try:
        analyzer = BudgetAnalyzer()
        analyzer.analyze_and_project()
        logger.info("✅ Budget analysis and projection complete!")
        logger.info("Results saved to growth_output.csv")
        
    except Exception as e:
        logger.error(f"❌ Budget analysis failed: {e}")

if __name__ == "__main__":
    main()
