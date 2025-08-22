// Mock AI Service for STLC Assistant
// Simulates Azure OpenAI responses with intelligent, context-aware mock data

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const mockRequirements = [
  {
    id: 'REQ-001',
    title: 'User Authentication System',
    description: 'The system shall provide secure user authentication with email and password',
    type: 'functional',
    priority: 'high',
    category: 'Authentication',
    acceptance_criteria: [
      'Given a user with valid credentials, when they attempt to login, then they should be authenticated successfully',
      'Given a user with invalid credentials, when they attempt to login, then they should receive an error message',
      'Given a user session, when it expires after 30 minutes of inactivity, then the user should be logged out automatically'
    ],
    business_value: 'Critical for platform security and user access control',
    complexity: 'medium',
    risk_level: 'high'
  },
  {
    id: 'REQ-002',
    title: 'Product Catalog Management',
    description: 'The system shall allow administrators to manage product catalog including adding, editing, and deleting products',
    type: 'functional',
    priority: 'high',
    category: 'Catalog Management',
    acceptance_criteria: [
      'Given an administrator, when they add a new product with valid details, then the product should be saved and visible in the catalog',
      'Given an administrator, when they edit an existing product, then the changes should be reflected immediately',
      'Given an administrator, when they delete a product, then it should be removed from the catalog and customer view'
    ],
    business_value: 'Core functionality for e-commerce operations',
    complexity: 'medium',
    risk_level: 'medium'
  },
  {
    id: 'REQ-003',
    title: 'Shopping Cart Functionality',
    description: 'The system shall provide shopping cart functionality allowing users to add, remove, and modify quantities of products',
    type: 'functional',
    priority: 'high',
    category: 'Shopping',
    acceptance_criteria: [
      'Given a user browsing products, when they click "Add to Cart", then the product should be added to their cart',
      'Given a user with items in cart, when they change quantity, then the cart total should update automatically',
      'Given a user with items in cart, when they remove an item, then it should be deleted from the cart'
    ],
    business_value: 'Essential for customer purchasing experience',
    complexity: 'medium',
    risk_level: 'medium'
  },
  {
    id: 'REQ-004',
    title: 'Payment Processing',
    description: 'The system shall integrate with secure payment gateways to process customer payments',
    type: 'functional',
    priority: 'critical',
    category: 'Payment',
    acceptance_criteria: [
      'Given a user at checkout, when they provide valid payment information, then the payment should be processed securely',
      'Given a payment failure, when the transaction cannot be completed, then the user should receive appropriate error messaging',
      'Given a successful payment, when the transaction completes, then the user should receive confirmation and receipt'
    ],
    business_value: 'Critical for revenue generation and transaction completion',
    complexity: 'high',
    risk_level: 'high'
  },
  {
    id: 'REQ-005',
    title: 'Performance Requirements',
    description: 'The system shall handle at least 1000 concurrent users with page load times under 3 seconds',
    type: 'non-functional',
    priority: 'high',
    category: 'Performance',
    acceptance_criteria: [
      'Given 1000 concurrent users, when accessing the platform, then response times should remain under 3 seconds',
      'Given peak traffic conditions, when the system is under load, then it should maintain 99.9% uptime',
      'Given database operations, when queries are executed, then they should complete within 500ms'
    ],
    business_value: 'Ensures optimal user experience and platform scalability',
    complexity: 'high',
    risk_level: 'high'
  },
  {
    id: 'REQ-006',
    title: 'Security Requirements',
    description: 'The system shall implement comprehensive security measures including data encryption and secure communications',
    type: 'non-functional',
    priority: 'critical',
    category: 'Security',
    acceptance_criteria: [
      'Given sensitive data transmission, when data is sent between client and server, then it should be encrypted using TLS 1.3',
      'Given user passwords, when they are stored, then they should be hashed using bcrypt with salt',
      'Given user sessions, when they are inactive for 30 minutes, then they should be automatically terminated'
    ],
    business_value: 'Protects customer data and maintains regulatory compliance',
    complexity: 'high',
    risk_level: 'critical'
  }
];

const mockStakeholders = [
  'Product Manager',
  'Development Team Lead',
  'UX/UI Designer',
  'Business Analyst',
  'QA Manager',
  'DevOps Engineer',
  'Security Architect',
  'Customer Support Lead'
];

const mockBusinessDrivers = [
  'Increase customer satisfaction and retention',
  'Reduce cart abandonment rates',
  'Improve platform scalability and performance',
  'Ensure regulatory compliance and data security',
  'Accelerate time-to-market for new features',
  'Optimize operational efficiency and cost reduction'
];

export const aiService = {
  // Phase 1: Requirements Analysis
  async analyzeRequirements(fileContent, businessContext = '') {
    await delay(2000); // Simulate AI processing time

    // Simulate intelligent analysis based on content
    const analysis = {
      requirements: mockRequirements,
      quality_metrics: {
        total_requirements: mockRequirements.length,
        functional_count: mockRequirements.filter(r => r.type === 'functional').length,
        non_functional_count: mockRequirements.filter(r => r.type === 'non-functional').length,
        quality_score: 87,
        completeness_score: 92,
        clarity_score: 85,
        testability_score: 89
      },
      validation_results: {
        errors: [
          {
            type: 'ambiguity',
            requirement_id: 'REQ-003',
            message: 'The term "modify quantities" could be more specific about allowed range',
            severity: 'medium'
          }
        ],
        warnings: [
          {
            type: 'missing_criteria',
            requirement_id: 'REQ-004',
            message: 'Consider adding acceptance criteria for payment refunds',
            severity: 'low'
          }
        ],
        suggestions: [
          {
            type: 'enhancement',
            requirement_id: 'REQ-001',
            message: 'Consider adding two-factor authentication for enhanced security',
            severity: 'medium'
          }
        ]
      },
      stakeholders: mockStakeholders,
      business_drivers: mockBusinessDrivers,
      estimated_effort: {
        development_weeks: 12,
        testing_weeks: 4,
        total_story_points: 89
      },
      risk_assessment: {
        high_risk_count: mockRequirements.filter(r => r.risk_level === 'high' || r.risk_level === 'critical').length,
        medium_risk_count: mockRequirements.filter(r => r.risk_level === 'medium').length,
        low_risk_count: mockRequirements.filter(r => r.risk_level === 'low').length
      }
    };

    return analysis;
  },

  async validateRequirement(requirement) {
    await delay(800);

    const suggestions = [
      'Consider adding specific error handling scenarios',
      'Define clear success and failure criteria',
      'Specify performance expectations',
      'Add accessibility requirements',
      'Include security considerations'
    ];

    return {
      is_valid: true,
      quality_score: Math.floor(Math.random() * 20) + 80,
      suggestions: suggestions.slice(0, Math.floor(Math.random() * 3) + 1),
      improvements: [
        'Make acceptance criteria more specific',
        'Add edge case handling',
        'Define measurable success metrics'
      ]
    };
  },

  // Phase 2: Test Planning
  async generateTestPlan(projectInfo) {
    await delay(3000);

    return {
      objective: `Conduct comprehensive testing of the ${projectInfo.projectName || 'E-Commerce Platform'} to ensure all functional and non-functional requirements are met with high quality standards.`,
      scope: {
        inclusions: [
          'Functional testing of all user-facing features',
          'API testing for backend services',
          'Performance testing under expected load',
          'Security testing for authentication and data protection',
          'Cross-browser compatibility testing',
          'Mobile responsiveness testing'
        ],
        exclusions: [
          'Third-party payment gateway internal testing',
          'Load testing beyond 1000 concurrent users',
          'Penetration testing (handled by security team)',
          'Accessibility testing (separate initiative)'
        ]
      },
      approach: {
        strategy: 'Risk-based testing approach focusing on critical business functions',
        methodology: 'Agile testing with continuous integration',
        phases: [
          'Unit Testing (Development Team)',
          'Integration Testing (QA Team)',
          'System Testing (QA Team)',
          'User Acceptance Testing (Business Team)'
        ]
      },
      test_types: [
        'Functional Testing',
        'API Testing',
        'Performance Testing',
        'Security Testing',
        'Usability Testing',
        'Compatibility Testing'
      ],
      environment: {
        test_environments: ['Development', 'QA', 'Staging', 'Production'],
        tools: ['Selenium WebDriver', 'Postman', 'JMeter', 'OWASP ZAP'],
        infrastructure: 'Cloud-based testing infrastructure with containerized applications'
      },
      resources: {
        team_size: 6,
        roles: [
          'QA Lead (1)',
          'Senior QA Engineers (2)',
          'Junior QA Engineers (2)',
          'Automation Engineer (1)'
        ],
        duration: '8 weeks',
        effort: '48 person-weeks'
      },
      schedule: {
        phases: [
          { name: 'Test Planning & Design', duration: '2 weeks', start: 'Week 1' },
          { name: 'Test Environment Setup', duration: '1 week', start: 'Week 2' },
          { name: 'Test Execution', duration: '4 weeks', start: 'Week 3' },
          { name: 'Regression Testing', duration: '1 week', start: 'Week 7' },
          { name: 'Final Validation & Sign-off', duration: '1 week', start: 'Week 8' }
        ]
      },
      risks: [
        {
          risk: 'Delayed delivery of development builds',
          impact: 'High',
          probability: 'Medium',
          mitigation: 'Establish clear build delivery schedule with development team'
        },
        {
          risk: 'Environment instability',
          impact: 'Medium',
          probability: 'Medium',
          mitigation: 'Implement automated environment health checks'
        },
        {
          risk: 'Insufficient test data',
          impact: 'Medium',
          probability: 'Low',
          mitigation: 'Create comprehensive test data generation scripts'
        }
      ],
      tools: {
        test_management: 'TestRail',
        automation: 'Selenium WebDriver + TestNG',
        performance: 'Apache JMeter',
        api_testing: 'Postman + Newman',
        security: 'OWASP ZAP',
        ci_cd: 'Jenkins'
      },
      deliverables: [
        'Test Plan Document',
        'Test Cases and Test Scripts',
        'Test Data and Test Environment Setup',
        'Automated Test Suite',
        'Test Execution Reports',
        'Defect Reports and Status',
        'Test Completion Report'
      ],
      success_criteria: [
        'All critical and high priority test cases executed with 100% pass rate',
        'No critical or high severity defects in production release',
        'Performance requirements met under expected load',
        'Security vulnerabilities identified and resolved',
        'User acceptance criteria validated by business stakeholders'
      ]
    };
  },

  // Phase 3: Test Case Development
  async generateTestCases(requirements, configuration) {
    await delay(2500);

    const testCases = [];
    let testCaseId = 1;

    requirements.forEach(req => {
      // Generate positive test cases
      if (configuration.includePositive) {
        testCases.push({
          id: `TC-${String(testCaseId).padStart(3, '0')}`,
          title: `Verify ${req.title} - Positive Flow`,
          description: `Test the successful execution of ${req.title.toLowerCase()}`,
          requirement_id: req.id,
          type: 'positive',
          priority: req.priority,
          category: req.category,
          test_type: configuration.testTypes[0] || 'functional',
          preconditions: [
            'System is accessible and running',
            'Test user has appropriate permissions',
            'Test data is available'
          ],
          steps: [
            {
              step: 1,
              action: `Navigate to ${req.category.toLowerCase()} section`,
              expected: `${req.category} page loads successfully`
            },
            {
              step: 2,
              action: 'Execute primary function with valid inputs',
              expected: 'Function executes successfully'
            },
            {
              step: 3,
              action: 'Verify expected outcome',
              expected: 'System displays success confirmation'
            }
          ],
          expected_result: 'Feature works as expected with valid inputs',
          test_data: {
            valid_input: 'Sample valid data for testing',
            expected_output: 'Expected successful result'
          },
          tags: ['smoke', 'regression', req.category.toLowerCase()],
          estimated_time: '15 minutes',
          status: 'draft',
          created_date: new Date().toISOString(),
          automated: configuration.testTypes.includes('api') ? true : false
        });
        testCaseId++;
      }

      // Generate negative test cases
      if (configuration.includeNegative) {
        testCases.push({
          id: `TC-${String(testCaseId).padStart(3, '0')}`,
          title: `Verify ${req.title} - Negative Flow`,
          description: `Test error handling for ${req.title.toLowerCase()}`,
          requirement_id: req.id,
          type: 'negative',
          priority: req.priority === 'high' ? 'high' : 'medium',
          category: req.category,
          test_type: configuration.testTypes[0] || 'functional',
          preconditions: [
            'System is accessible and running',
            'Test user has appropriate permissions'
          ],
          steps: [
            {
              step: 1,
              action: `Navigate to ${req.category.toLowerCase()} section`,
              expected: `${req.category} page loads successfully`
            },
            {
              step: 2,
              action: 'Execute function with invalid inputs',
              expected: 'System displays appropriate error message'
            },
            {
              step: 3,
              action: 'Verify error handling',
              expected: 'Error is handled gracefully without system crash'
            }
          ],
          expected_result: 'System handles invalid inputs gracefully with appropriate error messages',
          test_data: {
            invalid_input: 'Sample invalid data for testing',
            expected_error: 'Expected error message'
          },
          tags: ['negative', 'error-handling', req.category.toLowerCase()],
          estimated_time: '10 minutes',
          status: 'draft',
          created_date: new Date().toISOString(),
          automated: false
        });
        testCaseId++;
      }

      // Generate boundary test cases
      if (configuration.includeBoundary && req.type === 'functional') {
        testCases.push({
          id: `TC-${String(testCaseId).padStart(3, '0')}`,
          title: `Verify ${req.title} - Boundary Conditions`,
          description: `Test boundary values for ${req.title.toLowerCase()}`,
          requirement_id: req.id,
          type: 'boundary',
          priority: 'medium',
          category: req.category,
          test_type: configuration.testTypes[0] || 'functional',
          preconditions: [
            'System is accessible and running',
            'Boundary test data is prepared'
          ],
          steps: [
            {
              step: 1,
              action: 'Test with minimum allowed values',
              expected: 'System accepts minimum values correctly'
            },
            {
              step: 2,
              action: 'Test with maximum allowed values',
              expected: 'System accepts maximum values correctly'
            },
            {
              step: 3,
              action: 'Test with values just outside boundaries',
              expected: 'System rejects invalid boundary values'
            }
          ],
          expected_result: 'System correctly handles boundary conditions',
          test_data: {
            min_value: 'Minimum boundary value',
            max_value: 'Maximum boundary value',
            invalid_min: 'Below minimum boundary',
            invalid_max: 'Above maximum boundary'
          },
          tags: ['boundary', 'edge-case', req.category.toLowerCase()],
          estimated_time: '20 minutes',
          status: 'draft',
          created_date: new Date().toISOString(),
          automated: true
        });
        testCaseId++;
      }
    });

    return {
      test_cases: testCases,
      summary: {
        total_generated: testCases.length,
        by_type: {
          positive: testCases.filter(tc => tc.type === 'positive').length,
          negative: testCases.filter(tc => tc.type === 'negative').length,
          boundary: testCases.filter(tc => tc.type === 'boundary').length
        },
        by_priority: {
          high: testCases.filter(tc => tc.priority === 'high').length,
          medium: testCases.filter(tc => tc.priority === 'medium').length,
          low: testCases.filter(tc => tc.priority === 'low').length
        },
        estimated_total_time: `${testCases.length * 15} minutes`,
        automation_candidates: testCases.filter(tc => tc.automated).length
      },
      recommendations: [
        'Consider implementing automated testing for repetitive test cases',
        'Prioritize execution of high-priority test cases in initial testing cycles',
        'Review and update test cases based on requirement changes',
        'Implement data-driven testing for boundary value scenarios'
      ]
    };
  },

  async optimizeTestCase(testCase) {
    await delay(1000);

    return {
      optimized_steps: testCase.steps.map((step, index) => ({
        ...step,
        action: step.action + ' (optimized for efficiency)',
        expected: step.expected + ' within expected timeframe'
      })),
      suggestions: [
        'Consider combining similar verification steps',
        'Add performance validation points',
        'Include accessibility checks where applicable',
        'Enhance error message validation'
      ],
      automation_potential: Math.random() > 0.5 ? 'High' : 'Medium',
      estimated_time_reduction: '20%'
    };
  }
};

export default aiService;