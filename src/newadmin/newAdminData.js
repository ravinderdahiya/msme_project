export const newAdminNavItems = [
    { key: "dashboard", label: "Dashboard", icon: "layout-dashboard" },
    { key: "users", label: "Users", icon: "users" },
    { key: "layers", label: "Layers", icon: "layers-3" },
    { key: "data-services", label: "Data Services", icon: "database" },
    { key: "analysis-tools", label: "Analysis Tools", icon: "bar-chart-3" },
    { key: "reports", label: "Reports", icon: "file-text" },
    { key: "logs", label: "Logs", icon: "file-clock" },
    { key: "roles-permissions", label: "Roles & Permissions", icon: "shield-check" },
    { key: "system-health", label: "System Health", icon: "activity" },
];

export const statCards = [
    { label: "Total Users", value: "1,248", change: "+12%", tone: "blue" },
    { label: "Active Users", value: "842", change: "+8%", tone: "green" },
    { label: "Total Layers", value: "156", change: "+6%", tone: "violet" },
    { label: "Total Analyses", value: "2,368", change: "+15%", tone: "indigo" },
    { label: "Reports Generated", value: "612", change: "+10%", tone: "orange" },
];

export const recentAnalyses = [
    { title: "Industrial Area Feasibility", location: "Karnal, Haryana", time: "20 May 2024 - 10:30 AM" },
    { title: "Infrastructure Check", location: "Panipat, Haryana", time: "20 May 2024 - 09:15 AM" },
    { title: "Land Suitability Analysis", location: "Sonipat, Haryana", time: "19 May 2024 - 04:45 PM" },
    { title: "Proximity Analysis", location: "Yamunanagar, Haryana", time: "19 May 2024 - 11:20 AM" },
];

export const chartPoints = [
    { day: "01 May", analyses: 32, reports: 18 },
    { day: "05 May", analyses: 54, reports: 29 },
    { day: "10 May", analyses: 46, reports: 21 },
    { day: "15 May", analyses: 67, reports: 35 },
    { day: "20 May", analyses: 44, reports: 20 },
    { day: "25 May", analyses: 63, reports: 34 },
    { day: "30 May", analyses: 52, reports: 28 },
];

export const systemEvents = [
    { event: "User login activity", time: "20 May 2024 - 10:45 AM", status: "Success" },
    { event: "Data service request", time: "20 May 2024 - 10:30 AM", status: "Success" },
    { event: "Layer 'Industrial Areas' updated", time: "20 May 2024 - 09:50 AM", status: "Warning" },
    { event: "Backup completed successfully", time: "20 May 2024 - 02:30 AM", status: "Success" },
    { event: "High memory usage detected", time: "19 May 2024 - 11:10 PM", status: "Error" },
];

export const users = [
    { name: "Rahul Verma", email: "rahul.verma@example.com", role: "Investor", status: "Active", lastActive: "20 May 2024 10:30 AM" },
    { name: "Priya Sharma", email: "priya.sharma@example.com", role: "Investor", status: "Active", lastActive: "20 May 2024 09:15 AM" },
    { name: "Amit Kumar", email: "amit.kumar@example.com", role: "Analyst", status: "Active", lastActive: "19 May 2024 04:45 PM" },
    { name: "Neha Singh", email: "neha.singh@example.com", role: "Analyst", status: "Active", lastActive: "19 May 2024 11:20 AM" },
    { name: "Vikram Mehta", email: "vikram.mehta@example.com", role: "Admin", status: "Active", lastActive: "18 May 2024 03:00 PM" },
    { name: "Sandeep Raj", email: "sandeep.raj@example.com", role: "Viewer", status: "Inactive", lastActive: "15 May 2024 10:10 AM" },
    { name: "Karan Patel", email: "karan.patel@example.com", role: "Investor", status: "Blocked", lastActive: "10 May 2024 02:20 PM" },
    { name: "Meera Joshi", email: "meera.joshi@example.com", role: "Investor", status: "Active", lastActive: "20 May 2024 08:50 AM" },
];

export const layers = [
    { name: "Roads", category: "Infrastructure", type: "Line", status: "Active", updated: "20 May 2024" },
    { name: "Railway Lines", category: "Infrastructure", type: "Line", status: "Active", updated: "19 May 2024" },
    { name: "Industries", category: "Industrial", type: "Polygon", status: "Active", updated: "18 May 2024" },
    { name: "Power Stations", category: "Utilities", type: "Point", status: "Active", updated: "18 May 2024" },
    { name: "Hospitals", category: "Amenities", type: "Point", status: "Active", updated: "17 May 2024" },
    { name: "Schools", category: "Amenities", type: "Point", status: "Active", updated: "17 May 2024" },
    { name: "Water Bodies", category: "Natural", type: "Polygon", status: "Active", updated: "17 May 2024" },
    { name: "Bus Stands", category: "Transport", type: "Point", status: "Inactive", updated: "15 May 2024" },
];

export const services = [
    { name: "Roads Service", serviceType: "REST API", endpoint: "https://gis.harsac.gov.in/roads", status: "Active", checked: "20 May 2024 10:45 AM" },
    { name: "Industries Service", serviceType: "REST API", endpoint: "https://gis.harsac.gov.in/industries", status: "Active", checked: "20 May 2024 10:40 AM" },
    { name: "Utilities Service", serviceType: "REST API", endpoint: "https://gis.harsac.gov.in/utilities", status: "Active", checked: "20 May 2024 10:35 AM" },
    { name: "Admin Boundaries", serviceType: "REST API", endpoint: "https://gis.harsac.gov.in/boundaries", status: "Active", checked: "20 May 2024 10:30 AM" },
    { name: "Industries Service", serviceType: "WMS", endpoint: "https://gis.harsac.gov.in/industrial", status: "Warning", checked: "20 May 2024 10:20 AM" },
    { name: "Elevation Service", serviceType: "WMS", endpoint: "https://gis.harsac.gov.in/elevation", status: "Active", checked: "20 May 2024 10:15 AM" },
    { name: "Satellite Imagery", serviceType: "WMS", endpoint: "https://gis.harsac.gov.in/satellite", status: "Active", checked: "20 May 2024 10:10 AM" },
];

export const analysisTools = [
    { name: "Suitability Analysis", runs: 432, success: "96%", avgTime: "12s" },
    { name: "Proximity Search", runs: 298, success: "98%", avgTime: "7s" },
    { name: "Buffer Analysis", runs: 255, success: "97%", avgTime: "5s" },
    { name: "Heatmap Generator", runs: 149, success: "91%", avgTime: "18s" },
];

export const reports = [
    { name: "PDF Reports", count: 458, delta: "+8%" },
    { name: "Excel Reports", count: 124, delta: "+12%" },
    { name: "Map Exports", count: 30, delta: "+4%" },
    { name: "Total Reports", count: 612, delta: "+10%" },
];

export const logs = [
    { level: "Info", message: "User admin logged in successfully", time: "20 May 2024 10:45 AM" },
    { level: "Info", message: "Road service request completed", time: "20 May 2024 10:30 AM" },
    { level: "Warning", message: "Slow response from industry WMS layer", time: "20 May 2024 10:20 AM" },
    { level: "Error", message: "Memory usage crossed alert threshold", time: "19 May 2024 11:10 PM" },
];

export const roles = [
    { role: "Super Admin", users: 1 },
    { role: "Admin", users: 3 },
    { role: "Analyst", users: 8 },
    { role: "Investor", users: 102 },
    { role: "Viewer", users: 214 },
];

export const permissions = [
    { heading: "Dashboard", items: ["View Dashboard", "Manage Dashboard"] },
    { heading: "Users", items: ["View Users", "Add / Edit Users", "Delete Users", "Manage Roles"] },
    { heading: "Layers", items: ["View Layers", "Add / Edit Layers", "Delete Layers"] },
    { heading: "Data Services", items: ["View Data Services", "Add / Edit Services", "Delete Services"] },
    { heading: "Reports", items: ["View Reports", "Generate Reports", "Delete Reports"] },
];

export const healthStats = [
    { label: "Server Status", value: "Online", tone: "green" },
    { label: "CPU Usage", value: "32%", tone: "neutral" },
    { label: "Memory Usage", value: "68%", tone: "neutral" },
    { label: "Disk Usage", value: "45%", tone: "green" },
];

export const servicesHealth = [
    { name: "Authentication Service", status: "Healthy", response: "120 ms", checked: "20 May 2024 10:45 AM" },
    { name: "Map Service", status: "Healthy", response: "210 ms", checked: "20 May 2024 10:45 AM" },
    { name: "Data Service", status: "Warning", response: "540 ms", checked: "20 May 2024 10:45 AM" },
    { name: "Report Service", status: "Healthy", response: "180 ms", checked: "20 May 2024 10:45 AM" },
];
