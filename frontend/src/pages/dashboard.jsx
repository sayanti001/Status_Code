import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Navbar } from '../components/navbar';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge.jsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs.jsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table.jsx";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea.jsx";
import { Checkbox } from "../components/ui/checkbox.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { ChevronDown, Plus, Building, Edit, AlertTriangle, Check, CheckCircle, XCircle, AlertCircle, ExternalLink } from 'lucide-react';

export const Dashboard = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isCreateOrgDialogOpen, setIsCreateOrgDialogOpen] = useState(false);
  const [isCreateServiceDialogOpen, setIsCreateServiceDialogOpen] = useState(false);
  const [isEditServiceDialogOpen, setIsEditServiceDialogOpen] = useState(false);
  const [isCreateIncidentDialogOpen, setIsCreateIncidentDialogOpen] = useState(false);
  const [isEditIncidentDialogOpen, setIsEditIncidentDialogOpen] = useState(false);
  const [createserviceerror, setCreateServiceError] = useState(false);
  const [createincidenterror, setCreateIncidentError] = useState(false);
  const [isEditOrgDialogOpen, setIsEditOrgDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [statusDomain, setStatusDomain] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newOrgData, setNewOrgData] = useState({
    name: '',
    domain: '',
    info: '',
    employeeCount: ''
  });
  const [selectedService, setSelectedService] = useState(null);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [newServiceData, setNewServiceData] = useState({
    name: '',
    description: '',
    status: 'operational'
  });
  const [newIncidentData, setNewIncidentData] = useState({
    title: '',
    description: '',
    affectedService: '',
    status: 'investigating',
    sendEmail: false
  });

  
  const [services, setServices] = useState();
  const [incidents, setIncidents] = useState([]);

  // Employee range options
  const employeeRanges = [
    { value: "1-10", label: "1-10 employees" },
    { value: "11-50", label: "11-50 employees" },
    { value: "51-200", label: "51-200 employees" },
    { value: "201-500", label: "201-500 employees" },
    { value: "501-1000", label: "501-1000 employees" },
    { value: "1001+", label: "1001+ employees" }
  ];

  // Service status options
  const serviceStatuses = [
    { value: "operational", label: "Operational", icon: <CheckCircle className="h-4 w-4 text-green-500 mr-2" /> },
    { value: "degraded_performance", label: "Degraded Performance", icon: <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" /> },
    { value: "partial_outage", label: "Partial Outage", icon: <AlertTriangle className="h-4 w-4 text-orange-500 mr-2" /> },
    { value: "major_outage", label: "Major Outage", icon: <XCircle className="h-4 w-4 text-red-500 mr-2" /> }
  ];

  // Incident status options
  const incidentStatuses = [
    { value: "investigating", label: "Investigating", color: "bg-yellow-500" },
    { value: "identified", label: "Identified", color: "bg-blue-500" },
    { value: "monitoring", label: "Monitoring", color: "bg-purple-500" },
    { value: "resolved", label: "Resolved", color: "bg-green-500" }
  ];

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = await getAccessTokenSilently();

        // Make API call to backend with the token
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/verify`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        const data = response.data;
        console.log('Response data:', data);
        setUserInfo(data.user);

        // If organizations exist, set the first one as selected
        if (data.user?.organizations && data.user.organizations.length > 0) {
          setSelectedOrg(data.user.organizations[0]);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserInfo();
    }
  }, [user, getAccessTokenSilently]);

  useEffect(() => {
    const fetchservices = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/organizations/services`, {
          headers: {
            'Content-Type': 'application/json',
            'OrganizationId': selectedOrg._id,
            'Authorization': `Bearer ${token}`
          }
        });
        const data = response.data;
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };
    const fetchIncidents = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/organizations/incidents`, {
          headers: {
            'Content-Type': 'application/json',
            'OrganizationId': selectedOrg._id,
            'Authorization': `Bearer ${token}`
          }
        });
        const data = response.data;
        console.log(data);
        setIncidents(data);
      } catch (error) {
        console.error('Error fetching incidents:', error);
      }
    };
    if (selectedOrg) {
      fetchservices();
      fetchIncidents();
    }
  }, [selectedOrg]);

  const handleSaveDomain = async () => {
    setIsSubmitting(true);
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/organizations/update_statusDomain`,
        { statusDomain },
        {
          headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'organizationId': selectedOrg._id
          },
        }
      );
            

      setSelectedOrg({
        ...selectedOrg,
        statusDomain: response.data.organization.statusDomain
      });
      
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error saving domain:', error);
      // Handle error (could add error state and display to user)
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateOrganization = async () => {
    try {
      const token = await getAccessTokenSilently();

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/organizations/create`, 
        newOrgData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        }
      );

      // Update user info with new organization
      const updatedUserInfo = { ...userInfo };
      if (!updatedUserInfo.organizations) {
        updatedUserInfo.organizations = [];
      }

      updatedUserInfo.organizations.push(response.data.organization);
      setUserInfo(updatedUserInfo);
      setSelectedOrg(response.data.organization);
      setIsCreateOrgDialogOpen(false);

      // Reset form data
      setNewOrgData({
        name: '',
        domain: '',
        info: '',
        employeeCount: ''
      });

    } catch (error) {
      console.error('Error creating organization:', error);
      // Handle error (could add error state and display to user)
    }
  };

  const handleOrgChange = (orgId) => {
    const org = userInfo.organizations.find(o => o._id === orgId);
    if (org) {
      setSelectedOrg(org);
      console.log('Selected organization:', org);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOrgData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmployeeCountChange = (value) => {
    setNewOrgData(prev => ({
      ...prev,
      employeeCount: value
    }));
  };

  const handleServiceInputChange = (e) => {
    const { name, value } = e.target;
    setNewServiceData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServiceStatusChange = (value) => {
    setNewServiceData(prev => ({
      ...prev,
      status: value
    }));
  };

  const handleIncidentInputChange = (e) => {
    const { name, value } = e.target;
    setNewIncidentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleIncidentStatusChange = (value) => {
    setNewIncidentData(prev => ({
      ...prev,
      status: value
    }));
  };

  const handleIncidentServiceChange = (selectedValue) => {
    setNewIncidentData(prev => ({
      ...prev,
      affectedService: selectedValue
    }));
  };

  const handleIncidentEmailChange = (checked) => {
    setNewIncidentData(prev => ({
      ...prev,
      sendEmail: checked
    }));
  };

  const handleCreateService = async () => {
    try {
      if (!newServiceData.name || !newServiceData.description) {
        setCreateServiceError(true);
        return;
      }
      setCreateServiceError(false);
      const token = await getAccessTokenSilently();
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/organizations/create_service`,
        newServiceData,
        {
          headers: {
            'Content-Type': 'application/json',
            'OrganizationId': selectedOrg._id,
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      const createdService = response.data.service;
      console.log('New service created:', createdService);
      setServices([...services, createdService]);
    } catch (error) {
      console.error('Error creating service:', error);
    }
    setNewServiceData({
      name: '',
      description: '',
      status: 'operational'
    });
    setIsCreateServiceDialogOpen(false);
  };

  const handleEditService = async () => {
    try {
      const token = await getAccessTokenSilently();
      console.log('Selected service:', selectedService);
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/organizations/update_service`,
        { serviceId: selectedService._id, ...newServiceData },
        {
          headers: {
            'Content-Type': 'application/json',
            'OrganizationId': selectedOrg._id,
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      const updatedService = response.data.service;
      console.log(updatedService);
      console.log(services);
      const updatedServices = services.map(service =>
        service._id === updatedService._id ? updatedService : service
      );
      setServices(updatedServices);
    } catch (error) {
      console.error('Error updating service:', error);
    }
    setNewServiceData({
      name: '',
      description: '',
      status: 'operational'
    });
    setSelectedService(null);
    setIsEditServiceDialogOpen(false);
  };

  const handleCreateIncident = async () => {
    try {
      console.log(newIncidentData);
      if (!newIncidentData.title || !newIncidentData.description || !newIncidentData.affectedService) {
        setCreateIncidentError(true);
        return;
      }
      setCreateIncidentError(false);
      const token = await getAccessTokenSilently();
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/organizations/create_incident`,
        newIncidentData,
        {
          headers: {
            'Content-Type': 'application/json',
            'OrganizationId': selectedOrg._id,
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      const newIncident = response.data.incident;
      console.log('New incident created:', newIncident);
      setIncidents([...incidents, newIncident]);
    } catch (error) {
      console.error('Error creating incident:', error);
    }
    setNewIncidentData({
      title: '',
      description: '',
      serviceId: '',
      status: 'investigating',
      sendEmail: false
    });
    setIsCreateIncidentDialogOpen(false);
  };

  const handleEditIncident = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/organizations/update_incident`,
        {
          incidentId: selectedIncident._id,
          ...newIncidentData
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'OrganizationId': selectedOrg._id,
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      const updatedIncident = response.data.incident;
      console.log(updatedIncident)
      console.log(incidents);
      const updatedIncidents = incidents.map(incident =>
        incident._id === updatedIncident._id ? updatedIncident : incident
      );
      setIncidents(updatedIncidents);
    } catch (error) {
      console.error('Error updating incident:', error);
    }
    setNewIncidentData({
      title: '',
      description: '',
      serviceId: '',
      status: 'investigating',
      sendEmail: false
    });
    setSelectedIncident(null);
    setIsEditIncidentDialogOpen(false);
  };

  const handleEditOrganization = async () => {
    // In a real application, this would make an API call
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/organizations/update`,
        newOrgData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'organizationId': selectedOrg._id
          },
        }
      );
      const updatedOrg = response.data.organization;
      setSelectedOrg(updatedOrg);
    } catch (error) {
      console.error('Error updating organization:', error);
    }
    setNewOrgData({
      name: '',
      domain: '',
      info: '',
      employeeCount: ''
    });
    setIsEditOrgDialogOpen(false);
  };

  const openEditServiceDialog = (service) => {
    setSelectedService(service);
    setNewServiceData({
      name: service.name,
      description: service.description,
      status: service.status
    });
    setIsEditServiceDialogOpen(true);
  };

  const openEditIncidentDialog = (incident) => {
    setSelectedIncident(incident);
    setNewIncidentData({
      title: incident.title,
      description: incident.description,
      serviceId: incident.serviceId,
      status: incident.status,
      sendEmail: false // Assuming default is false for edit
    });
    setIsEditIncidentDialogOpen(true);
  };

  const openEditOrgDialog = () => {
    setNewOrgData({
      name: selectedOrg.name,
      domain: selectedOrg.domain || '',
      info: selectedOrg.info || '',
      employeeCount: selectedOrg.employeeCount || ''
    });
    setIsEditOrgDialogOpen(true);
  };

  const getServiceStatusBadge = (status) => {
    switch (status) {
      case 'operational':
        return <Badge className="bg-green-500">Operational</Badge>;
      case 'degraded_performance':
        return <Badge className="bg-yellow-500">Degraded</Badge>;
      case 'partial_outage':
        return <Badge className="bg-orange-500">Partial Outage</Badge>;
      case 'major_outage':
        return <Badge className="bg-red-500">Major Outage</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getIncidentStatusBadge = (status) => {
    const incidentStatus = incidentStatuses.find(s => s.value === status);
    return <Badge className={incidentStatus?.color || "bg-gray-500"}>{incidentStatus?.label || status}</Badge>;
  };

  const getServiceNameById = (id) => {
    const service = services?.find(s => s._id === id);
    return service ? service.name : 'Unknown Service';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Calculate overall system status
  const calculateSystemStatus = () => {
    if (services?.some(s => s.status === 'major_outage')) return 'major_outage';
    if (services?.some(s => s.status === 'partial_outage')) return 'partial_outage';
    if (services?.some(s => s.status === 'degraded_performance')) return 'degraded_performance';
    return 'operational';
  };

  const getSystemStatusDisplay = () => {
    const status = calculateSystemStatus();
    const statusObj = serviceStatuses.find(s => s.value === status);

    return (
      <div className="flex items-center">
        {statusObj?.icon}
        <span className={`font-medium ${status === 'operational' ? 'text-green-500' : status === 'degraded_performance' ? 'text-yellow-500' : status === 'partial_outage' ? 'text-orange-500' : 'text-red-500'}`}>
          {statusObj?.label || 'Unknown'}
        </span>
      </div>
    );
  };

  // Count services by status
  const countServicesByStatus = () => {
    return {
      operational: services.filter(s => s.status === 'operational').length,
      degraded: services.filter(s => s.status === 'degraded_performance').length,
      partial_outage: services.filter(s => s.status === 'partial_outage').length,
      major_outage: services.filter(s => s.status === 'major_outage').length
    };
  };

  // Count incidents by status
  const countIncidentsByStatus = () => {
    return {
      investigating: incidents.filter(i => i.status === 'investigating').length,
      identified: incidents.filter(i => i.status === 'identified').length,
      monitoring: incidents.filter(i => i.status === 'monitoring').length,
      resolved: incidents.filter(i => i.status === 'resolved').length,
      active: incidents.filter(i => i.status !== 'resolved').length
    };
  };

  // Get active incidents for a service
  const getActiveIncidentsForService = (serviceId) => {
    return incidents.filter(i => i.affectedService === serviceId && i.status !== 'resolved').length;
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Determine if we should show the "Create Organization" button or organization selector
  const hasOrganizations = userInfo?.organizations && userInfo.organizations.length > 0;

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>

          {/* Organization selector or create button */}
          {hasOrganizations ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Building size={16} />
                  {selectedOrg?.name || "Select Organization"}
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Organizations</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {userInfo.organizations.map((org) => (
                    <DropdownMenuItem
                      key={org._id}
                      onClick={() => handleOrgChange(org._id)}
                    >
                      {org.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsCreateOrgDialogOpen(true)}>
                  <Plus size={16} className="mr-2" />
                  Create Organization
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => setIsCreateOrgDialogOpen(true)}>
              <Plus size={16} className="mr-2" />
              Create Organization
            </Button>
          )}
        </div>

        {/* Welcome message */}
        <p className="mb-6">Welcome, {user?.name === user?.email ? 'User' : user?.name}!</p>

        {/* Show empty state or organization content */}
        {!hasOrganizations ? (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>Create your first organization to manage services and incidents</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button size="lg" onClick={() => setIsCreateOrgDialogOpen(true)}>
                <Plus size={16} className="mr-2" />
                Create Organization
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="incidents">Incidents</TabsTrigger>
              <TabsTrigger value="organization">Organization</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">System Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{getSystemStatusDisplay()}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{services?.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Active Incidents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{countIncidentsByStatus().active}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Uptime</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedOrg?.uptime}</div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Service Status</CardTitle>
                    <CardDescription>Current status of all services</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {services?.map(service => (
                        <div key={service._id} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{service.name}</p>
                            <p className="text-sm text-muted-foreground">{service.description}</p>
                          </div>
                          <div className="flex items-center">
                            {getActiveIncidentsForService(service._id) > 0 && (
                              <Badge variant="outline" className="mr-2">
                                {getActiveIncidentsForService(service._id)} active
                              </Badge>
                            )}
                            {getServiceStatusBadge(service.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Incidents</CardTitle>
                    <CardDescription>Latest reported issues</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {incidents.length > 0 ? (
                        incidents.slice(0, 5).map(incident => (
                          <div key={incident._id} className="space-y-1">
                            <div className="flex justify-between items-center">
                              <p className="font-medium">{incident.title}</p>
                              {getIncidentStatusBadge(incident.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {getServiceNameById(incident.affectedService)} • Updated {formatDate(incident.updatedAt)}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground">No incidents reported</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("services")}
                  className="flex items-center"
                >
                  Manage Services
                </Button>
                <Button
                  onClick={() => {
                    setActiveTab("incidents");
                    setIsCreateIncidentDialogOpen(true);
                  }}
                  className="flex items-center"
                >
                  <Plus size={16} className="mr-2" />
                  Report Incident
                </Button>
              </div>
            </TabsContent>

            {/* Services Tab */}
            <TabsContent value="services" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Services</h2>
                  <p className="text-muted-foreground">Manage your services and their status</p>
                </div>
                <Button onClick={() => setIsCreateServiceDialogOpen(true)}>
                  <Plus size={16} className="mr-2" />
                  Create Service
                </Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Incidents</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {services?.map(service => (
                        <TableRow key={service._id}>
                          <TableCell className="font-medium">{service.name}</TableCell>
                          <TableCell>{service.description}</TableCell>
                          <TableCell>{getServiceStatusBadge(service.status)}</TableCell>
                          <TableCell>{getActiveIncidentsForService(service._id)}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => openEditServiceDialog(service)}>
                              <Edit size={16} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Incidents Tab */}
            <TabsContent value="incidents" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Incidents</h2>
                  <p className="text-muted-foreground">Manage incidents and maintenances</p>
                </div>
                <Button onClick={() => setIsCreateIncidentDialogOpen(true)}>
                  <Plus size={16} className="mr-2" />
                  Report Incident
                </Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Updated</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {incidents.map(incident => (
                        <TableRow key={incident._id}>
                          <TableCell className="font-medium">{incident.title}</TableCell>
                          <TableCell>{getServiceNameById(incident.affectedService)}</TableCell>
                          <TableCell>{getIncidentStatusBadge(incident.status)}</TableCell>
                          <TableCell>{formatDate(incident.createdAt)}</TableCell>
                          <TableCell>{formatDate(incident.updatedAt)}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => openEditIncidentDialog(incident)}>
                              <Edit size={16} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Organization Tab */}
            <TabsContent value="organization" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Organization</h2>
                  <p className="text-muted-foreground">Manage your organization details</p>
                </div>
                <Button onClick={openEditOrgDialog}>
                  <Edit size={16} className="mr-2" />
                  Edit Organization
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Organization Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Name</p>
                      <p className="text-lg">{selectedOrg?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Domain</p>
                      <p className="text-lg">{selectedOrg?.domain || "Not set"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Information</p>
                      <p className="text-lg">{selectedOrg?.info || "No additional information"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Size</p>
                      <p className="text-lg">{selectedOrg?.employeeCount || "Not specified"}</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Status Page</CardTitle>
                    <CardDescription>Your public-facing status page</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Status Page URL</p>
                      <div className="flex items-center mt-1">
                        <p className="text-lg">
                          {selectedOrg?.statusDomain
                            ? `https://${selectedOrg.statusDomain}.statuscode.fun`
                            : "Not configured"}
                        </p>
                        {selectedOrg?.statusDomain && (
                          <Button variant="ghost" size="sm" className="ml-2">
                            <ExternalLink size={16} />
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="pt-4">
                      {selectedOrg?.statusDomain ? (
                        <Button variant="outline" className="w-full" onClick={() => window.open(`https://${selectedOrg.statusDomain}.statuscode.fun`, '_blank')}>
                          View Status Page
                        </Button>
                      ) : (
                        <Button variant="outline" className="w-full" onClick={() => setIsEditDialogOpen(true)}>
                          Set Status Domain
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Dialog for editing status domain */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Set Status Domain</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        Enter a domain for your status page.
                      </p>
                      <Input
                        placeholder="yourdomain.com"
                        value={statusDomain}
                        onChange={(e) => setStatusDomain(e.target.value)}
                      />
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveDomain} disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Save"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Create Organization Dialog */}
        <Dialog open={isCreateOrgDialogOpen} onOpenChange={setIsCreateOrgDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Organization</DialogTitle>
              <DialogDescription>
                Add a new organization to manage services and incidents.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={newOrgData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="Organization name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="domain" className="text-right">
                  Domain
                </Label>
                <Input
                  id="domain"
                  name="domain"
                  value={newOrgData.domain}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="example.com"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="info" className="text-right">
                  Info
                </Label>
                <Input
                  id="info"
                  name="info"
                  value={newOrgData.info}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="Brief description"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="employeeCount" className="text-right">
                  Size
                </Label>
                <Select
                  onValueChange={handleEmployeeCountChange}
                  value={newOrgData.employeeCount}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    {employeeRanges.map(range => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateOrganization}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Organization Dialog */}
        <Dialog open={isEditOrgDialogOpen} onOpenChange={setIsEditOrgDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Organization</DialogTitle>
              <DialogDescription>
                Update your organization details.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={newOrgData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-domain" className="text-right">
                  Domain
                </Label>
                <Input
                  id="edit-domain"
                  name="domain"
                  value={newOrgData.domain}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-info" className="text-right">
                  Info
                </Label>
                <Input
                  id="edit-info"
                  name="info"
                  value={newOrgData.info}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-employeeCount" className="text-right">
                  Size
                </Label>
                <Select
                  onValueChange={handleEmployeeCountChange}
                  value={newOrgData.employeeCount}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    {employeeRanges.map(range => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleEditOrganization}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Create Service Dialog */}
        <Dialog open={isCreateServiceDialogOpen} onOpenChange={setIsCreateServiceDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Service</DialogTitle>
              <DialogDescription>
                Add a new service to monitor.
              </DialogDescription>
              {createserviceerror &&
                <DialogDescription className="text-red-500">
                  Service name and description are required.
                </DialogDescription>}
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="service-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="service-name"
                  name="name"
                  value={newServiceData.name}
                  onChange={handleServiceInputChange}
                  className="col-span-3"
                  placeholder="Service name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="service-description" className="text-right">
                  Description
                </Label>
                <Input
                  id="service-description"
                  name="description"
                  value={newServiceData.description}
                  onChange={handleServiceInputChange}
                  className="col-span-3"
                  placeholder="Brief description"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="service-status" className="text-right">
                  Status
                </Label>
                <Select
                  onValueChange={handleServiceStatusChange}
                  value={newServiceData.status}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceStatuses.map(status => (
                      <SelectItem key={status.value} value={status.value}>
                        <div className="flex items-center">
                          {status.icon}
                          {status.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateService}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Service Dialog */}
        <Dialog open={isEditServiceDialogOpen} onOpenChange={setIsEditServiceDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Service</DialogTitle>
              <DialogDescription>
                Update service details and status.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-service-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-service-name"
                  name="name"
                  value={newServiceData.name}
                  onChange={handleServiceInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-service-description" className="text-right">
                  Description
                </Label>
                <Input
                  id="edit-service-description"
                  name="description"
                  value={newServiceData.description}
                  onChange={handleServiceInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-service-status" className="text-right">
                  Status
                </Label>
                <Select
                  onValueChange={handleServiceStatusChange}
                  value={newServiceData.status}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceStatuses.map(status => (
                      <SelectItem key={status.value} value={status.value}>
                        <div className="flex items-center">
                          {status.icon}
                          {status.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleEditService}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Create Incident Dialog */}
        <Dialog open={isCreateIncidentDialogOpen} onOpenChange={setIsCreateIncidentDialogOpen} >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Report Incident</DialogTitle>
              <DialogDescription>
                Report a new incident or maintenance.
              </DialogDescription>
              {createincidenterror &&
                <DialogDescription className="text-red-500">
                  All fields are required.
                </DialogDescription>}
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="incident-title" className="text-right">
                  Title
                </Label>
                <Input
                  id="incident-title"
                  name="title"
                  value={newIncidentData.title}
                  onChange={handleIncidentInputChange}
                  className="col-span-3"
                  placeholder="Incident title"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="incident-service" className="text-right">
                  Service
                </Label>
                <Select
                  onValueChange={handleIncidentServiceChange}
                  value={newIncidentData.affectedService}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services?.map(service => (
                      <SelectItem key={service._id} value={service._id}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="incident-status" className="text-right">
                  Status
                </Label>
                <Select
                  onValueChange={handleIncidentStatusChange}
                  value={newIncidentData.status}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {incidentStatuses.map(status => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="incident-description" className="text-right pt-2">
                  Description
                </Label>
                <Textarea
                  id="incident-description"
                  name="description"
                  value={newIncidentData.description}
                  onChange={handleIncidentInputChange}
                  className="col-span-3"
                  placeholder="Describe the incident"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="col-start-2 col-span-3 flex items-center space-x-2">
                  <Checkbox
                    id="send-email"
                    checked={newIncidentData.sendEmail}
                    onCheckedChange={handleIncidentEmailChange}
                  />
                  <Label htmlFor="send-email">Send email notification to users</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateIncident}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Incident Dialog */}
        <Dialog open={isEditIncidentDialogOpen} onOpenChange={setIsEditIncidentDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Update Incident</DialogTitle>
              <DialogDescription>
                Update incident details and status.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-incident-title" className="text-right">
                  Title
                </Label>
                <Input
                  id="edit-incident-title"
                  name="title"
                  value={newIncidentData.title}
                  onChange={handleIncidentInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-incident-service" className="text-right">
                  Service
                </Label>
                <Select
                  onValueChange={handleIncidentServiceChange}
                  value={newIncidentData.affectedService}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services?.map(service => (
                      <SelectItem key={service._id} value={service._id}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-incident-status" className="text-right">
                  Status
                </Label>
                <Select
                  onValueChange={handleIncidentStatusChange}
                  value={newIncidentData.status}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {incidentStatuses.map(status => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="edit-incident-description" className="text-right pt-2">
                  Description
                </Label>
                <Textarea
                  id="edit-incident-description"
                  name="description"
                  value={newIncidentData.description}
                  onChange={handleIncidentInputChange}
                  className="col-span-3"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="col-start-2 col-span-3 flex items-center space-x-2">
                  <Checkbox
                    id="edit-send-email"
                    checked={newIncidentData.sendEmail}
                    onCheckedChange={handleIncidentEmailChange}
                  />
                  <Label htmlFor="edit-send-email">Send email notification about this update</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleEditIncident}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};