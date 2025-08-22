import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Edit, 
  Eye, 
  Play, 
  Plus,
  MoreHorizontal,
  CheckCircle,
  Circle,
  AlertCircle,
  Clock,
  Tag,
  ArrowUpDown,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const TestCaseTable = ({ testCases, onEdit, onView, onAdd, onExecute, onBulkAction }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedItems, setSelectedItems] = useState([]);
  const [expandedRows, setExpandedRows] = useState(new Set());

  // Filter and search test cases
  const filteredTestCases = testCases.filter(tc => {
    const matchesSearch = tc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tc.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || tc.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || tc.priority === filterPriority;
    const matchesType = filterType === 'all' || tc.type === filterType;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesType;
  });

  // Sort test cases
  const sortedTestCases = [...filteredTestCases].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (sortField === 'priority') {
      const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
      aValue = priorityOrder[aValue] || 0;
      bValue = priorityOrder[bValue] || 0;
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(sortedTestCases.map(tc => tc.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id, checked) => {
    if (checked) {
      setSelectedItems(prev => [...prev, id]);
    } else {
      setSelectedItems(prev => prev.filter(item => item !== id));
    }
  };

  const toggleRowExpansion = (id) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'review':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'draft':
        return <Circle className="w-4 h-4 text-gray-400" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      positive: 'bg-green-100 text-green-800',
      negative: 'bg-red-100 text-red-800',
      boundary: 'bg-blue-100 text-blue-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const renderTestSteps = (steps) => (
    <div className="mt-2">
      <h5 className="font-medium text-gray-900 mb-2">Test Steps:</h5>
      <ol className="list-decimal list-inside space-y-1">
        {steps.map((step, index) => (
          <li key={index} className="text-sm text-gray-700">
            <span className="font-medium">Action:</span> {step.action}
            <br />
            <span className="font-medium">Expected:</span> {step.expected}
          </li>
        ))}
      </ol>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Test Cases</h3>
          <p className="text-sm text-gray-600">
            {sortedTestCases.length} of {testCases.length} test cases
          </p>
        </div>
        
        <div className="flex space-x-2">
          {selectedItems.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">{selectedItems.length} selected</span>
              <button
                onClick={() => onBulkAction('approve', selectedItems)}
                className="btn-secondary text-sm"
              >
                Bulk Approve
              </button>
              <button
                onClick={() => onBulkAction('execute', selectedItems)}
                className="btn-secondary text-sm"
              >
                Bulk Execute
              </button>
            </div>
          )}
          <button
            onClick={onAdd}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Test Case</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-lg">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search test cases..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters */}
        <select
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="review">Review</option>
          <option value="approved">Approved</option>
        </select>

        <select
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
        >
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="positive">Positive</option>
          <option value="negative">Negative</option>
          <option value="boundary">Boundary</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedItems.length === sortedTestCases.length && sortedTestCases.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('id')}
                  className="flex items-center space-x-1 hover:text-gray-700"
                >
                  <span>ID</span>
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('title')}
                  className="flex items-center space-x-1 hover:text-gray-700"
                >
                  <span>Title</span>
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('priority')}
                  className="flex items-center space-x-1 hover:text-gray-700"
                >
                  <span>Priority</span>
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedTestCases.map((testCase) => (
              <React.Fragment key={testCase.id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(testCase.id)}
                      onChange={(e) => handleSelectItem(testCase.id, e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleRowExpansion(testCase.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {expandedRows.has(testCase.id) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                      <span>{testCase.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div>
                      <div className="font-medium">{testCase.title}</div>
                      <div className="text-gray-500 truncate max-w-xs">
                        {testCase.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(testCase.type)}`}>
                      {testCase.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(testCase.priority)}`}>
                      {testCase.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(testCase.status)}
                      <span className="text-sm text-gray-900 capitalize">{testCase.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {testCase.estimated_time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onView(testCase)}
                        className="text-primary-600 hover:text-primary-900 p-1 hover:bg-primary-50 rounded"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(testCase)}
                        className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-100 rounded"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onExecute(testCase)}
                        className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded"
                        title="Execute"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                
                {/* Expanded Row */}
                {expandedRows.has(testCase.id) && (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 bg-gray-50">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Preconditions:</h5>
                            <ul className="list-disc list-inside text-sm text-gray-700">
                              {testCase.preconditions?.map((condition, index) => (
                                <li key={index}>{condition}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Tags:</h5>
                            <div className="flex flex-wrap gap-1">
                              {testCase.tags?.map((tag, index) => (
                                <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-200 text-gray-800">
                                  <Tag className="w-3 h-3 mr-1" />
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {testCase.steps && renderTestSteps(testCase.steps)}
                        
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Expected Result:</h5>
                          <p className="text-sm text-gray-700">{testCase.expected_result}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {sortedTestCases.length === 0 && (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No test cases found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-gray-900">{testCases.length}</div>
          <div className="text-sm text-gray-600">Total Test Cases</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-green-600">
            {testCases.filter(tc => tc.status === 'approved').length}
          </div>
          <div className="text-sm text-gray-600">Approved</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-red-600">
            {testCases.filter(tc => tc.priority === 'high').length}
          </div>
          <div className="text-sm text-gray-600">High Priority</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-blue-600">
            {testCases.filter(tc => tc.automated).length}
          </div>
          <div className="text-sm text-gray-600">Automated</div>
        </div>
      </div>
    </div>
  );
};

export default TestCaseTable;