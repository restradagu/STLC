// AI Service for STLC Assistant
// Integrates real Azure OpenAI with fallback to mock data

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Azure OpenAI Service Configuration
const getAzureConfig = () => {
  try {
    const config = sessionStorage.getItem('azure-openai-config');
    return config ? JSON.parse(config) : null;
  } catch (error) {
    console.error('Error loading Azure config:', error);
    return null;
  }
};

const callAzureOpenAI = async (messages, maxTokens = 3000) => {
  const config = getAzureConfig();
  if (!config) {
    throw new Error('No Azure config found');
  }

  const response = await fetch(`${config.endpoint}/openai/deployments/${config.deploymentName}/chat/completions?api-version=${config.apiVersion}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': config.apiKey
    },
    body: JSON.stringify({
      messages,
      max_tokens: maxTokens,
      temperature: 0.7,
      top_p: 0.95,
      frequency_penalty: 0,
      presence_penalty: 0
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Azure OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

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
    try {
      const config = getAzureConfig();
      if (config) {
        // Use Azure OpenAI
        const prompt = `You are a requirements analysis expert. Analyze the following requirements document and provide a comprehensive analysis in JSON format.

Requirements Document Content:
${fileContent}

Business Context:
${businessContext}

Please provide a detailed analysis including:
1. Extracted requirements with structured format (id, title, description, type, priority, category, acceptance_criteria, business_value, complexity, risk_level)
2. Quality metrics (total_requirements, functional_count, non_functional_count, quality_score, completeness_score, clarity_score, testability_score)
3. Validation results (errors, warnings, suggestions)
4. Identified stakeholders
5. Business drivers
6. Estimated effort (development_weeks, testing_weeks, total_story_points)
7. Risk assessment (high_risk_count, medium_risk_count, low_risk_count)

Return only valid JSON without any markdown formatting.`;

        const messages = [
          { role: 'system', content: 'You are an expert requirements analyst. Provide detailed, structured analysis in JSON format only.' },
          { role: 'user', content: prompt }
        ];

        const response = await callAzureOpenAI(messages, 4000);
        console.log('Azure OpenAI requirements analysis response received');
        
        // Parse and return the response
        try {
          return JSON.parse(response);
        } catch (parseError) {
          console.error('Error parsing Azure OpenAI response, falling back to mock:', parseError);
          throw new Error('Parse error');
        }
      }
    } catch (error) {
      console.log('Azure OpenAI failed, using mock data:', error.message);
    }

    // Fallback to mock data
    await delay(2000);
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

  // Static Requirements Validation
  async validateRequirements(requirements) {
    try {
      const config = getAzureConfig();
      if (config) {
        const prompt = `You are a requirements validation expert. Perform static analysis on the following requirements to detect formal errors, ambiguities, contradictions, and gaps in JSON format.

Requirements to validate:
${JSON.stringify(requirements, null, 2)}

Please provide comprehensive validation including:
1. overall_score (0-100 representing overall quality score)
2. summary (object with total_issues, critical_issues, warnings, suggestions)
3. findings (array of finding objects with: id, type [error|warning|suggestion], category [formal_error|ambiguity|contradiction|gap|enhancement], title, description, severity [critical|high|medium|low], requirement_id, suggestions array)

Analysis focus areas:
- Formal structure and completeness
- Clarity and unambiguous language
- Consistency across requirements
- Missing information or gaps
- Testability and measurability
- Dependencies and conflicts

Return only valid JSON without any markdown formatting.`;

        const messages = [
          { role: 'system', content: 'You are an expert requirements validation specialist. Provide detailed static analysis in JSON format only.' },
          { role: 'user', content: prompt }
        ];

        const response = await callAzureOpenAI(messages, 3000);
        console.log('Azure OpenAI requirements validation response received');
        
        try {
          return JSON.parse(response);
        } catch (parseError) {
          console.error('Error parsing validation response, falling back to mock:', parseError);
          throw new Error('Parse error');
        }
      }
    } catch (error) {
      console.log('Azure OpenAI validation failed, using mock data:', error.message);
    }

    // Fallback to mock validation data
    await delay(1500);
    
    const mockFindings = [
      {
        id: 'VAL-001',
        type: 'error',
        category: 'ambiguity',
        title: 'Ambiguous terminology in authentication requirement',
        description: 'The term "secure authentication" is too vague and needs specific security standards defined.',
        severity: 'high',
        requirement_id: requirements.find(r => r.title.toLowerCase().includes('auth'))?.id || 'REQ-001',
        suggestions: [
          'Specify authentication methods (e.g., OAuth 2.0, JWT tokens)',
          'Define password complexity requirements',
          'Clarify session management policies'
        ]
      },
      {
        id: 'VAL-002',
        type: 'warning',
        category: 'gap',
        title: 'Missing error handling specifications',
        description: 'Most requirements lack specific error handling and edge case definitions.',
        severity: 'medium',
        requirement_id: null,
        suggestions: [
          'Add error scenarios for each functional requirement',
          'Define system behavior during failures',
          'Specify user feedback mechanisms for errors'
        ]
      },
      {
        id: 'VAL-003',
        type: 'suggestion',
        category: 'enhancement',
        title: 'Consider adding performance metrics',
        description: 'Requirements would benefit from specific performance criteria and measurement methods.',
        severity: 'low',
        requirement_id: null,
        suggestions: [
          'Add response time requirements',
          'Define throughput expectations',
          'Specify resource utilization limits'
        ]
      }
    ];

    const totalIssues = mockFindings.length;
    const criticalIssues = mockFindings.filter(f => f.severity === 'critical').length;
    const warnings = mockFindings.filter(f => f.type === 'warning').length;
    const suggestions = mockFindings.filter(f => f.type === 'suggestion').length;

    // Calculate score based on findings
    const baseScore = 85;
    const penaltyPerCritical = 15;
    const penaltyPerWarning = 5;
    const overallScore = Math.max(0, baseScore - (criticalIssues * penaltyPerCritical) - (warnings * penaltyPerWarning));

    return {
      overall_score: overallScore,
      summary: {
        total_issues: totalIssues,
        critical_issues: criticalIssues,
        warnings: warnings,
        suggestions: suggestions
      },
      findings: mockFindings
    };
  },

  async validateRequirement(requirement) {
    try {
      const config = getAzureConfig();
      if (config) {
        const prompt = `You are a requirements validation expert. Analyze the following requirement and provide validation feedback in JSON format.

Requirement:
${JSON.stringify(requirement, null, 2)}

Please provide:
1. is_valid (boolean)
2. quality_score (0-100)
3. suggestions (array of specific suggestions)
4. improvements (array of specific improvements)

Return only valid JSON without any markdown formatting.`;

        const messages = [
          { role: 'system', content: 'You are an expert at validating requirements. Provide structured feedback in JSON format only.' },
          { role: 'user', content: prompt }
        ];

        const response = await callAzureOpenAI(messages, 1000);
        console.log('Azure OpenAI requirement validation response received');
        
        try {
          return JSON.parse(response);
        } catch (parseError) {
          console.error('Error parsing validation response, falling back to mock:', parseError);
          throw new Error('Parse error');
        }
      }
    } catch (error) {
      console.log('Azure OpenAI validation failed, using mock data:', error.message);
    }

    // Fallback to mock data
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
    try {
      const config = getAzureConfig();
      if (config) {
        const prompt = `You are a test planning expert. Generate a comprehensive test plan based on the following project information in JSON format.

Project Information:
${JSON.stringify(projectInfo, null, 2)}

Please provide a detailed test plan including:
1. objective (string)
2. scope (object with inclusions and exclusions arrays)
3. approach (object with strategy, methodology, and phases)
4. test_types (array)
5. environment (object with test_environments, tools, infrastructure)
6. resources (object with team_size, roles, duration, effort)
7. schedule (object with phases array containing name, duration, start)
8. risks (array with risk, impact, probability, mitigation)
9. tools (object with various tool categories)
10. deliverables (array)
11. success_criteria (array)

Return only valid JSON without any markdown formatting.`;

        const messages = [
          { role: 'system', content: 'You are an expert test planning specialist. Generate comprehensive test plans in JSON format only.' },
          { role: 'user', content: prompt }
        ];

        const response = await callAzureOpenAI(messages, 4000);
        console.log('Azure OpenAI test plan response received');
        
        try {
          return JSON.parse(response);
        } catch (parseError) {
          console.error('Error parsing test plan response, falling back to mock:', parseError);
          throw new Error('Parse error');
        }
      }
    } catch (error) {
      console.log('Azure OpenAI test plan generation failed, using mock data:', error.message);
    }

    // Fallback to mock data
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
    try {
      const config = getAzureConfig();
      if (config) {
        const prompt = `You are a test case generation expert. Generate comprehensive test cases based on the following requirements and configuration in JSON format.

Requirements:
${JSON.stringify(requirements, null, 2)}

Configuration:
${JSON.stringify(configuration, null, 2)}

Please provide:
1. test_cases (array of test case objects with: id, title, description, requirement_id, type, priority, category, test_type, preconditions, steps, expected_result, test_data, tags, estimated_time, status, created_date, automated)
2. summary (object with total_generated, by_type, by_priority, estimated_total_time, automation_candidates)
3. recommendations (array of strings)

Generate test cases based on configuration settings:
- includePositive: generate positive test cases
- includeNegative: generate negative test cases  
- includeBoundary: generate boundary test cases

Return only valid JSON without any markdown formatting.`;

        const messages = [
          { role: 'system', content: 'You are an expert test case generator. Create comprehensive test cases in JSON format only.' },
          { role: 'user', content: prompt }
        ];

        const response = await callAzureOpenAI(messages, 4000);
        console.log('Azure OpenAI test case generation response received');
        
        try {
          return JSON.parse(response);
        } catch (parseError) {
          console.error('Error parsing test case response, falling back to mock:', parseError);
          throw new Error('Parse error');
        }
      }
    } catch (error) {
      console.log('Azure OpenAI test case generation failed, using mock data:', error.message);
    }

    // Fallback to mock data
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
    try {
      const config = getAzureConfig();
      if (config) {
        const prompt = `You are a test case optimization expert. Optimize the following test case and provide improvement suggestions in JSON format.

Test Case:
${JSON.stringify(testCase, null, 2)}

Please provide:
1. optimized_steps (array of improved test steps)
2. suggestions (array of specific optimization suggestions)
3. automation_potential (string: High/Medium/Low)
4. estimated_time_reduction (string with percentage)

Return only valid JSON without any markdown formatting.`;

        const messages = [
          { role: 'system', content: 'You are an expert test case optimizer. Provide optimization suggestions in JSON format only.' },
          { role: 'user', content: prompt }
        ];

        const response = await callAzureOpenAI(messages, 1000);
        console.log('Azure OpenAI test case optimization response received');
        
        try {
          return JSON.parse(response);
        } catch (parseError) {
          console.error('Error parsing optimization response, falling back to mock:', parseError);
          throw new Error('Parse error');
        }
      }
    } catch (error) {
      console.log('Azure OpenAI optimization failed, using mock data:', error.message);
    }

    // Fallback to mock data
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