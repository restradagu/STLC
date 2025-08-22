import jsPDF from 'jspdf';

export const exportService = {
  // Export to JSON format
  exportToJSON: (data, filename = 'stlc-export') => {
    try {
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (error) {
      console.error('JSON export error:', error);
      return { success: false, error: error.message };
    }
  },

  // Export requirements analysis to PDF
  exportRequirementsToPDF: (requirementsData, projectName = 'STLC Project') => {
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.width;
      const margin = 20;
      let currentY = margin;

      // Helper function to add text with word wrapping
      const addText = (text, x, y, maxWidth, fontSize = 10) => {
        pdf.setFontSize(fontSize);
        const lines = pdf.splitTextToSize(text, maxWidth);
        pdf.text(lines, x, y);
        return y + (lines.length * fontSize * 0.4);
      };

      // Helper function to check page overflow and add new page
      const checkPageOverflow = (nextY, lineHeight = 20) => {
        if (nextY + lineHeight > pdf.internal.pageSize.height - margin) {
          pdf.addPage();
          return margin;
        }
        return nextY;
      };

      // Title
      pdf.setFontSize(20);
      pdf.setFont(undefined, 'bold');
      pdf.text('Requirements Analysis Report', margin, currentY);
      currentY += 30;

      // Project Information
      pdf.setFontSize(16);
      pdf.text('Project Information', margin, currentY);
      currentY += 15;
      
      pdf.setFontSize(10);
      pdf.setFont(undefined, 'normal');
      currentY = addText(`Project: ${projectName}`, margin, currentY, pageWidth - 2 * margin);
      currentY = addText(`Generated: ${new Date().toLocaleDateString()}`, margin, currentY + 5, pageWidth - 2 * margin);
      currentY += 20;

      // Quality Metrics
      if (requirementsData.qualityScore) {
        currentY = checkPageOverflow(currentY);
        pdf.setFontSize(16);
        pdf.setFont(undefined, 'bold');
        pdf.text('Quality Metrics', margin, currentY);
        currentY += 15;

        pdf.setFontSize(10);
        pdf.setFont(undefined, 'normal');
        currentY = addText(`Quality Score: ${requirementsData.qualityScore}%`, margin, currentY, pageWidth - 2 * margin);
        currentY = addText(`Total Requirements: ${requirementsData.requirements?.length || 0}`, margin, currentY + 5, pageWidth - 2 * margin);
        currentY = addText(`Functional: ${requirementsData.functionalCount || 0}`, margin, currentY + 5, pageWidth - 2 * margin);
        currentY = addText(`Non-Functional: ${requirementsData.nonFunctionalCount || 0}`, margin, currentY + 5, pageWidth - 2 * margin);
        currentY += 20;
      }

      // Requirements List
      if (requirementsData.requirements && requirementsData.requirements.length > 0) {
        currentY = checkPageOverflow(currentY);
        pdf.setFontSize(16);
        pdf.setFont(undefined, 'bold');
        pdf.text('Requirements', margin, currentY);
        currentY += 15;

        requirementsData.requirements.forEach((req, index) => {
          currentY = checkPageOverflow(currentY, 40);
          
          pdf.setFontSize(12);
          pdf.setFont(undefined, 'bold');
          currentY = addText(`${req.id}: ${req.title}`, margin, currentY, pageWidth - 2 * margin, 12);
          currentY += 5;
          
          pdf.setFontSize(10);
          pdf.setFont(undefined, 'normal');
          currentY = addText(`Description: ${req.description}`, margin, currentY, pageWidth - 2 * margin);
          currentY = addText(`Type: ${req.type} | Priority: ${req.priority} | Risk: ${req.risk_level}`, margin, currentY + 3, pageWidth - 2 * margin);
          
          if (req.acceptance_criteria && req.acceptance_criteria.length > 0) {
            currentY += 5;
            currentY = addText('Acceptance Criteria:', margin, currentY, pageWidth - 2 * margin);
            req.acceptance_criteria.forEach((criteria, idx) => {
              currentY = addText(`${idx + 1}. ${criteria}`, margin + 10, currentY + 3, pageWidth - 2 * margin - 10);
            });
          }
          currentY += 15;
        });
      }

      // Stakeholders
      if (requirementsData.stakeholders && requirementsData.stakeholders.length > 0) {
        currentY = checkPageOverflow(currentY);
        pdf.setFontSize(16);
        pdf.setFont(undefined, 'bold');
        pdf.text('Stakeholders', margin, currentY);
        currentY += 15;

        pdf.setFontSize(10);
        pdf.setFont(undefined, 'normal');
        requirementsData.stakeholders.forEach((stakeholder, index) => {
          currentY = addText(`• ${stakeholder}`, margin, currentY, pageWidth - 2 * margin);
          currentY += 2;
        });
        currentY += 10;
      }

      // Business Drivers
      if (requirementsData.businessDrivers && requirementsData.businessDrivers.length > 0) {
        currentY = checkPageOverflow(currentY);
        pdf.setFontSize(16);
        pdf.setFont(undefined, 'bold');
        pdf.text('Business Drivers', margin, currentY);
        currentY += 15;

        pdf.setFontSize(10);
        pdf.setFont(undefined, 'normal');
        requirementsData.businessDrivers.forEach((driver, index) => {
          currentY = addText(`• ${driver}`, margin, currentY, pageWidth - 2 * margin);
          currentY += 2;
        });
      }

      pdf.save(`requirements-analysis-${new Date().toISOString().split('T')[0]}.pdf`);
      return { success: true };
    } catch (error) {
      console.error('PDF export error:', error);
      return { success: false, error: error.message };
    }
  },

  // Export test plan to PDF
  exportTestPlanToPDF: (testPlan, projectName = 'STLC Project') => {
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.width;
      const margin = 20;
      let currentY = margin;

      // Helper functions (same as above)
      const addText = (text, x, y, maxWidth, fontSize = 10) => {
        pdf.setFontSize(fontSize);
        const lines = pdf.splitTextToSize(text, maxWidth);
        pdf.text(lines, x, y);
        return y + (lines.length * fontSize * 0.4);
      };

      const checkPageOverflow = (nextY, lineHeight = 20) => {
        if (nextY + lineHeight > pdf.internal.pageSize.height - margin) {
          pdf.addPage();
          return margin;
        }
        return nextY;
      };

      // Title
      pdf.setFontSize(20);
      pdf.setFont(undefined, 'bold');
      pdf.text('Test Plan Document', margin, currentY);
      currentY += 30;

      // Project Information
      pdf.setFontSize(16);
      pdf.text('Project Information', margin, currentY);
      currentY += 15;
      
      pdf.setFontSize(10);
      pdf.setFont(undefined, 'normal');
      currentY = addText(`Project: ${projectName}`, margin, currentY, pageWidth - 2 * margin);
      currentY = addText(`Generated: ${new Date().toLocaleDateString()}`, margin, currentY + 5, pageWidth - 2 * margin);
      currentY += 20;

      // Objective
      if (testPlan.objective) {
        currentY = checkPageOverflow(currentY);
        pdf.setFontSize(16);
        pdf.setFont(undefined, 'bold');
        pdf.text('Objective', margin, currentY);
        currentY += 15;

        pdf.setFontSize(10);
        pdf.setFont(undefined, 'normal');
        currentY = addText(testPlan.objective, margin, currentY, pageWidth - 2 * margin);
        currentY += 20;
      }

      // Scope
      if (testPlan.scope) {
        currentY = checkPageOverflow(currentY);
        pdf.setFontSize(16);
        pdf.setFont(undefined, 'bold');
        pdf.text('Scope', margin, currentY);
        currentY += 15;

        pdf.setFontSize(12);
        pdf.setFont(undefined, 'bold');
        currentY = addText('Inclusions:', margin, currentY, pageWidth - 2 * margin, 12);
        currentY += 5;

        pdf.setFontSize(10);
        pdf.setFont(undefined, 'normal');
        testPlan.scope.inclusions?.forEach(item => {
          currentY = addText(`• ${item}`, margin, currentY, pageWidth - 2 * margin);
          currentY += 2;
        });
        currentY += 10;

        pdf.setFontSize(12);
        pdf.setFont(undefined, 'bold');
        currentY = addText('Exclusions:', margin, currentY, pageWidth - 2 * margin, 12);
        currentY += 5;

        pdf.setFontSize(10);
        pdf.setFont(undefined, 'normal');
        testPlan.scope.exclusions?.forEach(item => {
          currentY = addText(`• ${item}`, margin, currentY, pageWidth - 2 * margin);
          currentY += 2;
        });
        currentY += 20;
      }

      // Test Types
      if (testPlan.test_types) {
        currentY = checkPageOverflow(currentY);
        pdf.setFontSize(16);
        pdf.setFont(undefined, 'bold');
        pdf.text('Test Types', margin, currentY);
        currentY += 15;

        pdf.setFontSize(10);
        pdf.setFont(undefined, 'normal');
        testPlan.test_types.forEach(type => {
          currentY = addText(`• ${type}`, margin, currentY, pageWidth - 2 * margin);
          currentY += 3;
        });
        currentY += 20;
      }

      // Resources
      if (testPlan.resources) {
        currentY = checkPageOverflow(currentY);
        pdf.setFontSize(16);
        pdf.setFont(undefined, 'bold');
        pdf.text('Resources', margin, currentY);
        currentY += 15;

        pdf.setFontSize(10);
        pdf.setFont(undefined, 'normal');
        currentY = addText(`Team Size: ${testPlan.resources.team_size}`, margin, currentY, pageWidth - 2 * margin);
        currentY = addText(`Duration: ${testPlan.resources.duration}`, margin, currentY + 5, pageWidth - 2 * margin);
        currentY = addText(`Effort: ${testPlan.resources.effort}`, margin, currentY + 5, pageWidth - 2 * margin);
        currentY += 15;

        if (testPlan.resources.roles) {
          pdf.setFontSize(12);
          pdf.setFont(undefined, 'bold');
          currentY = addText('Team Roles:', margin, currentY, pageWidth - 2 * margin, 12);
          currentY += 5;

          pdf.setFontSize(10);
          pdf.setFont(undefined, 'normal');
          testPlan.resources.roles.forEach(role => {
            currentY = addText(`• ${role}`, margin, currentY, pageWidth - 2 * margin);
            currentY += 3;
          });
        }
        currentY += 20;
      }

      // Risks
      if (testPlan.risks && testPlan.risks.length > 0) {
        currentY = checkPageOverflow(currentY);
        pdf.setFontSize(16);
        pdf.setFont(undefined, 'bold');
        pdf.text('Risks and Mitigation', margin, currentY);
        currentY += 15;

        testPlan.risks.forEach(risk => {
          currentY = checkPageOverflow(currentY, 30);
          
          pdf.setFontSize(12);
          pdf.setFont(undefined, 'bold');
          currentY = addText(risk.risk, margin, currentY, pageWidth - 2 * margin, 12);
          currentY += 5;

          pdf.setFontSize(10);
          pdf.setFont(undefined, 'normal');
          currentY = addText(`Impact: ${risk.impact} | Probability: ${risk.probability}`, margin, currentY, pageWidth - 2 * margin);
          currentY = addText(`Mitigation: ${risk.mitigation}`, margin, currentY + 3, pageWidth - 2 * margin);
          currentY += 15;
        });
      }

      pdf.save(`test-plan-${new Date().toISOString().split('T')[0]}.pdf`);
      return { success: true };
    } catch (error) {
      console.error('PDF export error:', error);
      return { success: false, error: error.message };
    }
  },

  // Export test cases to PDF
  exportTestCasesToPDF: (testCasesData, projectName = 'STLC Project') => {
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.width;
      const margin = 20;
      let currentY = margin;

      // Helper functions (same as above)
      const addText = (text, x, y, maxWidth, fontSize = 10) => {
        pdf.setFontSize(fontSize);
        const lines = pdf.splitTextToSize(text, maxWidth);
        pdf.text(lines, x, y);
        return y + (lines.length * fontSize * 0.4);
      };

      const checkPageOverflow = (nextY, lineHeight = 20) => {
        if (nextY + lineHeight > pdf.internal.pageSize.height - margin) {
          pdf.addPage();
          return margin;
        }
        return nextY;
      };

      // Title
      pdf.setFontSize(20);
      pdf.setFont(undefined, 'bold');
      pdf.text('Test Cases Document', margin, currentY);
      currentY += 30;

      // Project Information
      pdf.setFontSize(16);
      pdf.text('Project Information', margin, currentY);
      currentY += 15;
      
      pdf.setFontSize(10);
      pdf.setFont(undefined, 'normal');
      currentY = addText(`Project: ${projectName}`, margin, currentY, pageWidth - 2 * margin);
      currentY = addText(`Generated: ${new Date().toLocaleDateString()}`, margin, currentY + 5, pageWidth - 2 * margin);
      currentY = addText(`Total Test Cases: ${testCasesData.testCases?.length || 0}`, margin, currentY + 5, pageWidth - 2 * margin);
      currentY += 20;

      // Summary Statistics
      if (testCasesData.statistics) {
        currentY = checkPageOverflow(currentY);
        pdf.setFontSize(16);
        pdf.setFont(undefined, 'bold');
        pdf.text('Summary', margin, currentY);
        currentY += 15;

        pdf.setFontSize(10);
        pdf.setFont(undefined, 'normal');
        const stats = testCasesData.statistics;
        currentY = addText(`High Priority: ${stats.byPriority?.high || 0}`, margin, currentY, pageWidth - 2 * margin);
        currentY = addText(`Medium Priority: ${stats.byPriority?.medium || 0}`, margin, currentY + 5, pageWidth - 2 * margin);
        currentY = addText(`Low Priority: ${stats.byPriority?.low || 0}`, margin, currentY + 5, pageWidth - 2 * margin);
        currentY += 20;
      }

      // Test Cases
      if (testCasesData.testCases && testCasesData.testCases.length > 0) {
        currentY = checkPageOverflow(currentY);
        pdf.setFontSize(16);
        pdf.setFont(undefined, 'bold');
        pdf.text('Test Cases', margin, currentY);
        currentY += 15;

        testCasesData.testCases.forEach((testCase, index) => {
          currentY = checkPageOverflow(currentY, 60);
          
          pdf.setFontSize(12);
          pdf.setFont(undefined, 'bold');
          currentY = addText(`${testCase.id}: ${testCase.title}`, margin, currentY, pageWidth - 2 * margin, 12);
          currentY += 5;
          
          pdf.setFontSize(10);
          pdf.setFont(undefined, 'normal');
          currentY = addText(`Description: ${testCase.description}`, margin, currentY, pageWidth - 2 * margin);
          currentY = addText(`Type: ${testCase.type} | Priority: ${testCase.priority}`, margin, currentY + 3, pageWidth - 2 * margin);
          currentY += 10;
          
          if (testCase.preconditions && testCase.preconditions.length > 0) {
            pdf.setFontSize(10);
            pdf.setFont(undefined, 'bold');
            currentY = addText('Preconditions:', margin, currentY, pageWidth - 2 * margin, 10);
            pdf.setFont(undefined, 'normal');
            testCase.preconditions.forEach(condition => {
              currentY = addText(`• ${condition}`, margin + 10, currentY + 3, pageWidth - 2 * margin - 10);
            });
            currentY += 5;
          }
          
          if (testCase.steps && testCase.steps.length > 0) {
            pdf.setFont(undefined, 'bold');
            currentY = addText('Test Steps:', margin, currentY, pageWidth - 2 * margin, 10);
            pdf.setFont(undefined, 'normal');
            testCase.steps.forEach((step, stepIndex) => {
              currentY = addText(`${stepIndex + 1}. Action: ${step.action}`, margin + 10, currentY + 3, pageWidth - 2 * margin - 10);
              currentY = addText(`   Expected: ${step.expected}`, margin + 10, currentY + 2, pageWidth - 2 * margin - 10);
            });
            currentY += 5;
          }
          
          if (testCase.expected_result) {
            pdf.setFont(undefined, 'bold');
            currentY = addText('Expected Result:', margin, currentY, pageWidth - 2 * margin, 10);
            pdf.setFont(undefined, 'normal');
            currentY = addText(testCase.expected_result, margin, currentY + 3, pageWidth - 2 * margin);
          }
          
          currentY += 20;
        });
      }

      pdf.save(`test-cases-${new Date().toISOString().split('T')[0]}.pdf`);
      return { success: true };
    } catch (error) {
      console.error('PDF export error:', error);
      return { success: false, error: error.message };
    }
  },

  // Export to Word format (simplified HTML for Word compatibility)
  exportToWord: (data, filename = 'stlc-export', type = 'general') => {
    try {
      let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${filename}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { color: #2d5a27; border-bottom: 2px solid #2d5a27; }
            h2 { color: #2d5a27; margin-top: 30px; }
            h3 { color: #333; }
            .requirement { margin: 20px 0; padding: 15px; border-left: 4px solid #2d5a27; background: #f9f9f9; }
            .test-case { margin: 20px 0; padding: 15px; border: 1px solid #ccc; }
            .metadata { background: #f5f5f5; padding: 10px; margin: 10px 0; }
            ul { margin: 10px 0; }
            li { margin: 5px 0; }
          </style>
        </head>
        <body>
      `;

      // Add content based on type
      if (type === 'requirements' && data.requirements) {
        htmlContent += `
          <h1>Requirements Analysis Report</h1>
          <div class="metadata">
            <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Total Requirements:</strong> ${data.requirements.length}</p>
            <p><strong>Quality Score:</strong> ${data.qualityScore || 'N/A'}%</p>
          </div>
        `;
        
        data.requirements.forEach(req => {
          htmlContent += `
            <div class="requirement">
              <h3>${req.id}: ${req.title}</h3>
              <p><strong>Description:</strong> ${req.description}</p>
              <p><strong>Type:</strong> ${req.type} | <strong>Priority:</strong> ${req.priority} | <strong>Risk:</strong> ${req.risk_level}</p>
              ${req.acceptance_criteria ? `
                <h4>Acceptance Criteria:</h4>
                <ul>
                  ${req.acceptance_criteria.map(criteria => `<li>${criteria}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `;
        });
      } else if (type === 'testcases' && data.testCases) {
        htmlContent += `
          <h1>Test Cases Document</h1>
          <div class="metadata">
            <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Total Test Cases:</strong> ${data.testCases.length}</p>
          </div>
        `;
        
        data.testCases.forEach(tc => {
          htmlContent += `
            <div class="test-case">
              <h3>${tc.id}: ${tc.title}</h3>
              <p><strong>Description:</strong> ${tc.description}</p>
              <p><strong>Type:</strong> ${tc.type} | <strong>Priority:</strong> ${tc.priority}</p>
              ${tc.preconditions ? `
                <h4>Preconditions:</h4>
                <ul>
                  ${tc.preconditions.map(condition => `<li>${condition}</li>`).join('')}
                </ul>
              ` : ''}
              ${tc.steps ? `
                <h4>Test Steps:</h4>
                <ol>
                  ${tc.steps.map(step => `
                    <li>
                      <strong>Action:</strong> ${step.action}<br>
                      <strong>Expected:</strong> ${step.expected}
                    </li>
                  `).join('')}
                </ol>
              ` : ''}
              <p><strong>Expected Result:</strong> ${tc.expected_result}</p>
            </div>
          `;
        });
      } else {
        htmlContent += `
          <h1>STLC Project Export</h1>
          <div class="metadata">
            <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Export Type:</strong> Complete Project Data</p>
          </div>
          <pre>${JSON.stringify(data, null, 2)}</pre>
        `;
      }

      htmlContent += `
        </body>
        </html>
      `;

      const blob = new Blob([htmlContent], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.doc`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (error) {
      console.error('Word export error:', error);
      return { success: false, error: error.message };
    }
  }
};

export default exportService;