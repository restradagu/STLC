import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Edit, 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  Circle,
  Tag,
  ArrowUpDown,
  Plus
} from 'lucide-react';

const RequirementsTable = ({ requirements, onEdit, onView, onAdd }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');

  // Filter and search requirements
  const filteredRequirements = requirements.filter(req => {
    const matchesSearch = req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || req.type === filterType;
    const matchesPriority = filterPriority === 'all' || req.priority === filterPriority;
    
    return matchesSearch && matchesType && matchesPriority;
  });

  // Sort requirements
  const sortedRequirements = [...filteredRequirements].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (sortField === 'priority') {
      const priorityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
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

  const getPriorityColor = (priority) => {
    const colors = {
      critical: 'bg-red-100 text-red-800 border-red-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getTypeIcon = (type) => {
    return type === 'functional' ? 
      <CheckCircle className="w-4 h-4 text-blue-600" /> : 
      <Circle className="w-4 h-4 text-purple-600" />;
  };

  const getRiskIcon = (riskLevel) => {
    if (riskLevel === 'high' || riskLevel === 'critical') {
      return <AlertTriangle className="w-4 h-4 text-red-600" />;
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Requirements Analysis</h3>
        <button
          onClick={onAdd}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Requirement</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-lg">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search requirements..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Type Filter */}
        <select
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="functional">Functional</option>
          <option value="non-functional">Non-Functional</option>
        </select>

        {/* Priority Filter */}
        <select
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
        >
          <option value="all">All Priorities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Requirements Table */}
      <div className="overflow-x-auto bg-white rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center space-x-1">
                  <span>ID</span>
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('title')}
              >
                <div className="flex items-center space-x-1">
                  <span>Title</span>
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('priority')}
              >
                <div className="flex items-center space-x-1">
                  <span>Priority</span>
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Risk
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedRequirements.map((requirement) => (
              <tr key={requirement.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {requirement.id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div>
                    <div className="font-medium">{requirement.title}</div>
                    <div className="text-gray-500 truncate max-w-xs">
                      {requirement.description}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(requirement.type)}
                    <span className="capitalize">{requirement.type}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(requirement.priority)}`}>
                    {requirement.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center space-x-1">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <span>{requirement.category}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center space-x-1">
                    {getRiskIcon(requirement.risk_level)}
                    <span className="capitalize">{requirement.risk_level}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onView(requirement)}
                      className="text-primary-600 hover:text-primary-900 p-1 hover:bg-primary-50 rounded"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(requirement)}
                      className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-100 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sortedRequirements.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No requirements found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-gray-900">{requirements.length}</div>
          <div className="text-sm text-gray-600">Total Requirements</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-blue-600">
            {requirements.filter(r => r.type === 'functional').length}
          </div>
          <div className="text-sm text-gray-600">Functional</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-purple-600">
            {requirements.filter(r => r.type === 'non-functional').length}
          </div>
          <div className="text-sm text-gray-600">Non-Functional</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-red-600">
            {requirements.filter(r => r.risk_level === 'high' || r.risk_level === 'critical').length}
          </div>
          <div className="text-sm text-gray-600">High Risk</div>
        </div>
      </div>
    </div>
  );
};

export default RequirementsTable;