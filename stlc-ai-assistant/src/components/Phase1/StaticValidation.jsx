import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, Info, RefreshCw, FileText, Brain } from 'lucide-react';
import Chart from '../common/Chart';
import aiService from '../../services/aiService';

const StaticValidation = ({ requirements, onValidationComplete }) => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResults, setValidationResults] = useState(null);

  const handleValidate = async () => {
    setIsValidating(true);
    
    try {
      // Prepare requirements for validation
      const requirementsText = requirements.map(req => ({
        id: req.id,
        title: req.title,
        description: req.description,
        user_story: req.user_story,
        acceptance_criteria: req.acceptance_criteria,
        type: req.type,
        priority: req.priority
      }));

      // Call AI service for static validation
      const validation = await aiService.validateRequirements(requirementsText);
      
      setValidationResults(validation);
      
      // Notify parent component
      if (onValidationComplete) {
        onValidationComplete(validation);
      }
      
    } catch (error) {
      console.error('Validation error:', error);
      setValidationResults({
        overall_score: 0,
        summary: {
          total_issues: 1,
          critical_issues: 1,
          warnings: 0,
          suggestions: 0
        },
        findings: [{
          id: 'error-001',
          type: 'error',
          category: 'system',
          title: 'Validation Service Error',
          description: 'Failed to connect to validation service. Please try again.',
          severity: 'critical',
          requirement_id: null,
          suggestions: ['Check your internet connection', 'Verify AI service configuration']
        }]
      });
    } finally {
      setIsValidating(false);
    }
  };

  const renderValidationButton = () => (
    <div className="text-center py-8">
      <Brain className="w-16 h-16 text-primary-600 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Static Requirements Validation
      </h3>
      <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
        Analyze your requirements for formal errors, ambiguities, contradictions, and gaps. 
        Our AI will provide suggestions for improvement and classify findings by severity.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
        <div className="bg-blue-50 p-4 rounded-lg">
          <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <h4 className="font-medium text-blue-900">Formal Analysis</h4>
          <p className="text-sm text-blue-700">Detect structural issues and format problems</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <AlertTriangle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
          <h4 className="font-medium text-orange-900">Ambiguity Detection</h4>
          <p className="text-sm text-orange-700">Identify unclear or vague requirements</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <h4 className="font-medium text-green-900">Quality Improvements</h4>
          <p className="text-sm text-green-700">Get suggestions for better requirements</p>
        </div>
      </div>

      <button
        onClick={handleValidate}
        disabled={isValidating || requirements.length === 0}
        className="btn-primary px-8 py-3 text-lg flex items-center space-x-2 mx-auto"
      >
        {isValidating ? (
          <>
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Validating Requirements...</span>
          </>
        ) : (
          <>
            <Brain className="w-5 h-5" />
            <span>Start Validation</span>
          </>
        )}
      </button>

      {requirements.length === 0 && (
        <p className="text-sm text-gray-500 mt-4">
          Add some requirements first to enable validation
        </p>
      )}
    </div>
  );

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'bg-red-100 text-red-800 border-red-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200', 
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-blue-100 text-blue-800 border-blue-200',
      info: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[severity] || colors.info;
  };

  const getTypeIcon = (type) => {
    const icons = {
      error: <AlertTriangle className="w-5 h-5 text-red-600" />,
      warning: <AlertTriangle className="w-5 h-5 text-orange-600" />,
      suggestion: <Info className="w-5 h-5 text-blue-600" />
    };
    return icons[type] || icons.suggestion;
  };

  const renderValidationResults = () => {
    if (!validationResults) return null;

    const { overall_score, summary, findings = [] } = validationResults;

    return (
      <div className="space-y-6">
        {/* Overall Score */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Validation Results</h3>
            <button
              onClick={handleValidate}
              className="btn-secondary text-sm flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Re-validate</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Score Visualization */}
            <div className="text-center">
              <Chart.ProgressRing progress={overall_score} size={120} strokeWidth={8} />
              <p className="text-sm text-gray-600 mt-2">Overall Quality Score</p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{summary.critical_issues || 0}</div>
                <div className="text-sm text-red-700">Critical Issues</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{summary.warnings || 0}</div>
                <div className="text-sm text-orange-700">Warnings</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{summary.suggestions || 0}</div>
                <div className="text-sm text-blue-700">Suggestions</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">{summary.total_issues || 0}</div>
                <div className="text-sm text-gray-700">Total Issues</div>
              </div>
            </div>
          </div>
        </div>

        {/* Findings */}
        {findings.length > 0 && (
          <div className="card">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Detailed Findings</h4>
            <div className="space-y-4">
              {findings.map((finding, index) => (
                <div 
                  key={finding.id || index}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getTypeIcon(finding.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{finding.title}</h5>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getSeverityColor(finding.severity)}`}>
                            {finding.severity}
                          </span>
                          {finding.requirement_id && (
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                              {finding.requirement_id}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-3">{finding.description}</p>
                      
                      {finding.suggestions && finding.suggestions.length > 0 && (
                        <div>
                          <h6 className="text-sm font-medium text-gray-800 mb-1">Suggestions:</h6>
                          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            {finding.suggestions.map((suggestion, idx) => (
                              <li key={idx}>{suggestion}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Insights */}
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex items-start space-x-3">
            <Brain className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h4 className="font-medium text-blue-900 mb-2">AI Analysis Summary</h4>
              <div className="text-blue-800 text-sm space-y-1">
                <p>• Analyzed {requirements.length} requirements for quality and consistency</p>
                <p>• Overall quality score: {overall_score}% based on formal criteria</p>
                <p>• {findings.filter(f => f.type === 'error').length} critical issues requiring immediate attention</p>
                <p>• {findings.filter(f => f.type === 'warning').length} warnings that may impact implementation</p>
                <p>• {findings.filter(f => f.type === 'suggestion').length} improvement suggestions provided</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {!validationResults ? renderValidationButton() : renderValidationResults()}
    </div>
  );
};

export default StaticValidation;