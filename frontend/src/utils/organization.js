/**
 * Organization calculation utilities
 * Service functions for organization statistics (departments, divisions, employees)
 */

/**
 * Calculate department statistics
 * @param {Array} departments - Array of department objects
 * @returns {Object} Department statistics
 */
export const calculateDepartmentStats = (departments) => {
  if (!Array.isArray(departments) || departments.length === 0) {
    return {
      totalDepartments: 0,
      totalEmployees: 0,
      averageEmployeesPerDepartment: 0,
      largestDepartment: null,
      smallestDepartment: null
    };
  }

  const totalDepartments = departments.length;
  const totalEmployees = departments.reduce((sum, dept) => sum + (dept.employeeCount || 0), 0);
  const averageEmployeesPerDepartment = totalDepartments > 0 ? totalEmployees / totalDepartments : 0;
  
  const sortedBySize = [...departments].sort((a, b) => (b.employeeCount || 0) - (a.employeeCount || 0));
  const largestDepartment = sortedBySize[0] || null;
  const smallestDepartment = sortedBySize[sortedBySize.length - 1] || null;

  return {
    totalDepartments,
    totalEmployees,
    averageEmployeesPerDepartment: Math.round(averageEmployeesPerDepartment),
    largestDepartment,
    smallestDepartment
  };
};

/**
 * Calculate division statistics
 * @param {Array} divisions - Array of division objects
 * @returns {Object} Division statistics
 */
export const calculateDivisionStats = (divisions) => {
  if (!Array.isArray(divisions) || divisions.length === 0) {
    return {
      totalDivisions: 0,
      totalEmployees: 0,
      averageEmployeesPerDivision: 0,
      activeDepartments: 0,
      divisionsByDepartment: {}
    };
  }

  const totalDivisions = divisions.length;
  const totalEmployees = divisions.reduce((sum, div) => sum + (div.employeeCount || 0), 0);
  const averageEmployeesPerDivision = totalDivisions > 0 ? totalEmployees / totalDivisions : 0;
  const activeDepartments = [...new Set(divisions.map(div => div.departmentId))].length;
  
  // Group divisions by department
  const divisionsByDepartment = {};
  divisions.forEach(division => {
    const deptId = division.departmentId;
    if (!divisionsByDepartment[deptId]) {
      divisionsByDepartment[deptId] = {
        departmentName: division.departmentName,
        divisions: [],
        totalEmployees: 0
      };
    }
    divisionsByDepartment[deptId].divisions.push(division);
    divisionsByDepartment[deptId].totalEmployees += division.employeeCount || 0;
  });

  return {
    totalDivisions,
    totalEmployees,
    averageEmployeesPerDivision: Math.round(averageEmployeesPerDivision),
    activeDepartments,
    divisionsByDepartment
  };
};

/**
 * Calculate user/employee statistics by role
 * @param {Array} users - Array of user objects
 * @returns {Object} User statistics by role
 */
export const calculateUserStats = (users) => {
  if (!Array.isArray(users) || users.length === 0) {
    return {
      totalUsers: 0,
      usersByRole: {},
      activeUsers: 0,
      inactiveUsers: 0
    };
  }

  const totalUsers = users.length;
  const usersByRole = {};
  let activeUsers = 0;
  let inactiveUsers = 0;

  users.forEach(user => {
    // Count by role
    const role = user.role || 'Unknown';
    if (!usersByRole[role]) {
      usersByRole[role] = 0;
    }
    usersByRole[role] += 1;

    // Count by status
    if (user.status === 'active' || !user.status) {
      activeUsers += 1;
    } else {
      inactiveUsers += 1;
    }
  });

  return {
    totalUsers,
    usersByRole,
    activeUsers,
    inactiveUsers
  };
};

/**
 * Calculate article statistics
 * @param {Array} articles - Array of article objects
 * @returns {Object} Article statistics
 */
export const calculateArticleStats = (articles) => {
  if (!Array.isArray(articles) || articles.length === 0) {
    return {
      totalArticles: 0,
      publishedArticles: 0,
      draftArticles: 0,
      archivedArticles: 0,
      articlesByCategory: {},
      thisMonthArticles: 0
    };
  }

  const totalArticles = articles.length;
  const publishedArticles = articles.filter(a => a.status === 'Published').length;
  const draftArticles = articles.filter(a => a.status === 'Draft').length;
  const archivedArticles = articles.filter(a => a.status === 'Archived').length;

  // Group by category
  const articlesByCategory = {};
  articles.forEach(article => {
    const category = article.category || 'Uncategorized';
    if (!articlesByCategory[category]) {
      articlesByCategory[category] = 0;
    }
    articlesByCategory[category] += 1;
  });

  // This month articles
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthArticles = articles.filter(article => {
    const articleDate = new Date(article.date || article.createdAt);
    return articleDate.getMonth() === currentMonth && 
           articleDate.getFullYear() === currentYear;
  }).length;

  return {
    totalArticles,
    publishedArticles,
    draftArticles,
    archivedArticles,
    articlesByCategory,
    thisMonthArticles
  };
};

/**
 * Calculate event statistics
 * @param {Array} events - Array of event objects
 * @returns {Object} Event statistics
 */
export const calculateEventStats = (events) => {
  if (!Array.isArray(events) || events.length === 0) {
    return {
      totalEvents: 0,
      upcomingEvents: 0,
      activeEvents: 0,
      completedEvents: 0,
      cancelledEvents: 0,
      eventsByCategory: {},
      thisMonthEvents: 0
    };
  }

  const totalEvents = events.length;
  const upcomingEvents = events.filter(e => e.status === 'Planning').length;
  const activeEvents = events.filter(e => e.status === 'Active').length;
  const completedEvents = events.filter(e => e.status === 'Completed').length;
  const cancelledEvents = events.filter(e => e.status === 'Cancelled').length;

  // Group by category
  const eventsByCategory = {};
  events.forEach(event => {
    const category = event.category || 'Uncategorized';
    if (!eventsByCategory[category]) {
      eventsByCategory[category] = 0;
    }
    eventsByCategory[category] += 1;
  });

  // This month events
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthEvents = events.filter(event => {
    const eventDate = new Date(event.date || event.startDate);
    return eventDate.getMonth() === currentMonth && 
           eventDate.getFullYear() === currentYear;
  }).length;

  return {
    totalEvents,
    upcomingEvents,
    activeEvents,
    completedEvents,
    cancelledEvents,
    eventsByCategory,
    thisMonthEvents
  };
};
