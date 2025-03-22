import React from 'react';
import PropTypes from 'prop-types';

const AgentReportCard = ({ 
  title, 
  value, 
  icon, 
  comparison = null, 
  trend = null,
  onClick = null,
  bgColor = 'bg-primary',
  textColor = 'text-white',
  chartData = null
}) => {
  // Calculate trend styling
  const getTrendClass = () => {
    if (!trend) return '';
    return trend > 0 ? 'trend-up' : trend < 0 ? 'trend-down' : 'trend-neutral';
  };
  
  // Format value (add commas, truncate decimals, etc.)
  const formatValue = (val) => {
    if (typeof val === 'number') {
      // Format currency
      if (title.toLowerCase().includes('revenue') || 
          title.toLowerCase().includes('earning') || 
          title.toLowerCase().includes('amount')) {
        return new Intl.NumberFormat('en-US', { 
          style: 'currency', 
          currency: 'PHP',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(val);
      }
      
      // Format regular number
      return new Intl.NumberFormat('en-US').format(val);
    }
    
    return val;
  };
  
  // Format comparison text
  const formatComparison = () => {
    if (!comparison) return null;
    
    const { period, value: compValue } = comparison;
    const diff = trend !== null ? `${trend > 0 ? '+' : ''}${trend}%` : '';
    
    return `${diff} vs ${period}`;
  };
  
  return (
    <div 
      className={`agent-report-card ${bgColor} ${textColor} ${onClick ? 'clickable' : ''}`}
      onClick={onClick}
    >
      <div className="report-card-content">
        <div className="report-title">{title}</div>
        
        <div className="report-body">
          <div className="report-value">{formatValue(value)}</div>
          
          {icon && (
            <div className="report-icon">
              <i className={`fas fa-${icon}`}></i>
            </div>
          )}
        </div>
        
        {comparison && (
          <div className={`report-comparison ${getTrendClass()}`}>
            {trend !== null && (
              <i className={`fas fa-${trend > 0 ? 'arrow-up' : trend < 0 ? 'arrow-down' : 'equals'}`}></i>
            )}
            <span>{formatComparison()}</span>
          </div>
        )}
        
        {chartData && (
          <div className="report-chart">
            {/* Mini chart would go here - could use a simple SVG sparkline */}
            <svg width="100%" height="30" viewBox="0 0 100 30" preserveAspectRatio="none">
              <path
                d={`M0,30 ${chartData.map((point, index) => {
                  const x = index * (100 / (chartData.length - 1));
                  const y = 30 - (point / Math.max(...chartData) * 30);
                  return `L${x},${y}`;
                }).join(' ')} V30 H0 Z`}
                fill="rgba(255,255,255,0.2)"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="1"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

AgentReportCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  icon: PropTypes.string,
  comparison: PropTypes.shape({
    period: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired
  }),
  trend: PropTypes.number, // percentage change, positive or negative
  onClick: PropTypes.func,
  bgColor: PropTypes.string,
  textColor: PropTypes.string,
  chartData: PropTypes.arrayOf(PropTypes.number) // Data points for mini chart
};

export default AgentReportCard;