import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:8001/api",
  baseURL: "https://logistic.kretoss.in/api",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Log every response error to console for debugging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API Error]', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      requestData: (() => { try { return JSON.parse(error.config?.data); } catch { return error.config?.data; } })()
    });
    return Promise.reject(error);
  }
);

export const loginApi = (email: string, password: string) => api.post("/admin/login", { email, password });

export const createLeadApi = (data: Record<string, unknown>) => api.post("/leads", data);
export const getLeadsApi   = ()                               => api.get("/leads");
export const getLeadApi    = (id: string)                     => api.get(`/leads/${id}`);
export const updateLeadApi       = (id: string, data: Record<string, unknown>) => api.put(`/leads/${id}`, data);
export const updateLeadStatusApi = (id: number, status: string)                 => api.put(`/leads/status/${id}`, { status });
export const updateLeadRatingApi = (id: number, rating: number)                 => api.put(`/leads/rating/${id}`, { rating: String(rating) });
export const deleteLeadApi = (id: number) => api.delete(`/leads/${id}`);

export const createRateRequestApi      = (data: Record<string, unknown>) => api.post("/rate-requests", data);
export const getOpportunitiesApi        = ()                               => api.get("/rate-requests");
export const getOpportunityApi          = (id: string)                     => api.get(`/rate-requests/${id}`);
export const updateRateRequestApi       = (id: string, data: Record<string, unknown>) => api.put(`/rate-requests/${id}`, data);
export const deleteOpportunityApi       = (id: number)                     => api.delete(`/rate-requests/${id}`);
export const updateOpportunityStatusApi = (id: number, status: string)     => api.put(`/rate-requests/status/${id}`, { status });

export const getShipmentTypesApi    = ()                               => api.get('/shipment-types');
export const getShipmentTypeApi     = (id: number)                     => api.get(`/shipment-types/${id}`);
export const createShipmentTypeApi  = (data: Record<string, unknown>)  => api.post('/shipment-types', data);
export const updateShipmentTypeApi  = (id: number, data: Record<string, unknown>) => api.put(`/shipment-types/${id}`, data);
export const deleteShipmentTypeApi  = (id: number)                     => api.delete(`/shipment-types/${id}`);

export const getTransportModesApi    = ()                               => api.get('/transport-modes');
export const getTransportModeApi     = (id: number)                     => api.get(`/transport-modes/${id}`);
export const createTransportModeApi  = (data: Record<string, unknown>)  => api.post('/transport-modes', data);
export const updateTransportModeApi  = (id: number, data: Record<string, unknown>) => api.put(`/transport-modes/${id}`, data);
export const deleteTransportModeApi  = (id: number)                     => api.delete(`/transport-modes/${id}`);
export const updateTransportModeStatusApi = (id: number, status: number) => api.patch(`/transport-modes/status/${id}`, { status });

// Country APIs
export const getCountriesApi    = ()                               => api.get('/countries');
export const getCountryApi      = (id: number)                     => api.get(`/countries/${id}`);
export const createCountryApi   = (data: Record<string, unknown>)  => api.post('/countries', data);
export const updateCountryApi   = (id: number, data: Record<string, unknown>) => api.put(`/countries/${id}`, data);
export const deleteCountryApi   = (id: number)                     => api.delete(`/countries/${id}`);
export const updateCountryStatusApi = (id: number, status: number) => api.patch(`/countries/${id}/status`, { status });

// Currency APIs (kept for backward compatibility)
export const getCurrenciesApi    = ()                               => api.get('/currencies');
export const getCurrencyApi      = (id: number)                     => api.get(`/currencies/${id}`);
export const createCurrencyApi   = (data: Record<string, unknown>)  => api.post('/currencies', data);
export const updateCurrencyApi   = (id: number, data: Record<string, unknown>) => api.put(`/currencies/${id}`, data);
export const deleteCurrencyApi   = (id: number)                     => api.delete(`/currencies/${id}`);
export const updateCurrencyStatusApi = (id: number, status: number) => api.patch(`/currencies/${id}/status`, { status });

export const getEmployeesApi     = ()                               => api.get('/employees');
export const getEmployeeApi      = (id: number)                     => api.get(`/employees/${id}`);
export const createEmployeeApi   = (data: Record<string, unknown>)  => api.post('/employees', data);
export const updateEmployeeApi   = (id: number, data: Record<string, unknown>) => api.put(`/employees/${id}`, data);
export const deleteEmployeeApi   = (id: number)                     => api.delete(`/employees/${id}`);

export const getCargoTypesApi    = ()                               => api.get('/cargo-types');
export const getCargoTypeApi     = (id: number)                     => api.get(`/cargo-types/${id}`);
export const createCargoTypeApi  = (data: Record<string, unknown>)  => api.post('/cargo-types', data);
export const updateCargoTypeApi  = (id: number, data: Record<string, unknown>) => api.put(`/cargo-types/${id}`, data);
export const deleteCargoTypeApi  = (id: number)                     => api.delete(`/cargo-types/${id}`);

// Designation APIs
export const getDesignationsApi    = (page = 1, perPage = 10, search = '', status = '') => api.get('/designations', { params: { page, per_page: perPage, ...(search && { search }), ...(status && { status }) } });
export const getDesignationApi     = (id: number)                     => api.get(`/designations/${id}`);
export const createDesignationApi  = (data: Record<string, unknown>)  => api.post('/designations', data);
export const updateDesignationApi  = (id: number, data: Record<string, unknown>) => api.put(`/designations/${id}`, data);
export const deleteDesignationApi  = (id: number)                     => api.delete(`/designations/${id}`);

// Chart of Accounts (COA) APIs
export const getCoasApi    = ()                               => api.get('/chart-of-accounts');
export const getCoaApi     = (id: number)                     => api.get(`/chart-of-accounts/${id}`);
export const createCoaApi  = (data: Record<string, unknown>)  => api.post('/chart-of-accounts', data);
export const updateCoaApi  = (id: number, data: Record<string, unknown>) => api.put(`/chart-of-accounts/${id}`, data);
export const deleteCoaApi  = (id: number)                     => api.delete(`/chart-of-accounts/${id}`);

// City APIs
export const getCitiesApi    = ()                               => api.get('/cities');
export const getCityApi      = (id: number)                     => api.get(`/cities/${id}`);
export const createCityApi   = (data: Record<string, unknown>)  => api.post('/cities', data);
export const updateCityApi   = (id: number, data: Record<string, unknown>) => api.put(`/cities/${id}`, data);
export const deleteCityApi   = (id: number)                     => api.delete(`/cities/${id}`);

// Department APIs
export const getDepartmentsApi    = (page = 1, perPage = 10, search = '', status = '') => api.get('/departments', { params: { page, per_page: perPage, ...(search && { search }), ...(status && { status }) } });
export const getDepartmentApi     = (id: number)                     => api.get(`/departments/${id}`);
export const createDepartmentApi  = (data: Record<string, unknown>)  => api.post('/departments', data);
export const updateDepartmentApi  = (id: number, data: Record<string, unknown>) => api.put(`/departments/${id}`, data);
export const deleteDepartmentApi  = (id: number)                     => api.delete(`/departments/${id}`);

// Prospects (Master) APIs
export const getProspectsApi    = (page = 1, perPage = 10, search = '', status = '') => api.get('/prospects', { params: { page, per_page: perPage, ...(search && { search }), ...(status && { status }) } });
export const getProspectApi     = (id: number)                     => api.get(`/prospects/${id}`);
export const createProspectApi  = (data: Record<string, unknown>)  => api.post('/prospects', data);
export const updateProspectApi  = (id: number, data: Record<string, unknown>) => api.put(`/prospects/${id}`, data);
export const deleteProspectApi  = (id: number)                     => api.delete(`/prospects/${id}`);

// State APIs
export const getStatesApi    = (page = 1, perPage = 10, search = '', status = '') => api.get('/states', { params: { page, per_page: perPage, ...(search && { search }), ...(status && { status }) } });
export const getStateApi     = (id: number)                     => api.get(`/states/${id}`);
export const createStateApi  = (data: Record<string, unknown>)  => api.post('/states', data);
export const updateStateApi  = (id: number, data: Record<string, unknown>) => api.put(`/states/${id}`, data);
export const deleteStateApi  = (id: number)                     => api.delete(`/states/${id}`);

// Company APIs
export const getCompaniesApi    = (page = 1, perPage = 10, search = '', status = '') => api.get('/companies', { params: { page, per_page: perPage, ...(search && { search }), ...(status && { status }) } });
export const getCompanyApi      = (id: number)                     => api.get(`/companies/${id}`);
export const createCompanyApi   = (data: Record<string, unknown>)  => api.post('/companies', data);
export const updateCompanyApi   = (id: number, data: Record<string, unknown>) => api.put(`/companies/${id}`, data);
export const deleteCompanyApi   = (id: number)                     => api.delete(`/companies/${id}`);
export const updateCompanyStatusApi = (id: number, status: number) => api.patch(`/companies/${id}/status`, { status });

// Sales Agent APIs
export const getSalesAgentsApi        = (page = 1, perPage = 10, search = '', country = '', status = '') => api.get('/sales-agents', { params: { page, per_page: perPage, ...(search && { search }), ...(country && { country }), ...(status && { status }) } });
export const getSalesAgentApi         = (id: number)                     => api.get(`/sales-agents/${id}`);
export const createSalesAgentApi      = (data: Record<string, unknown>)  => api.post('/sales-agents', data);
export const updateSalesAgentApi      = (id: number, data: Record<string, unknown>) => api.put(`/sales-agents/${id}`, data);
export const deleteSalesAgentApi      = (id: number)                     => api.delete(`/sales-agents/${id}`);
export const updateSalesAgentStatusApi = (id: number, status: number)    => api.patch(`/sales-agents/${id}/status`, { status });

// Pricing Team APIs
export const getPricingTeamApi        = (page = 1, perPage = 10, search = '', company = '', status = '') => api.get('/pricing-teams', { params: { page, per_page: perPage, ...(search && { search }), ...(company && { company }), ...(status && { status }) } });
export const getPricingTeamMemberApi  = (id: number)                     => api.get(`/pricing-teams/${id}`);
export const createPricingTeamApi     = (data: Record<string, unknown>)  => api.post('/pricing-teams', data);
export const updatePricingTeamApi     = (id: number, data: Record<string, unknown>) => api.put(`/pricing-teams/${id}`, data);
export const deletePricingTeamApi     = (id: number)                     => api.delete(`/pricing-teams/${id}`);
export const updatePricingTeamStatusApi = (id: number, status: number)   => api.patch(`/pricing-teams/${id}/status`, { status });

// Shipping Provider APIs
export const getShippingProvidersApi       = (page = 1, perPage = 10, search = '', status = '') => api.get('/shipping-providers', { params: { page, per_page: perPage, ...(search && { search }), ...(status && { status }) } });
export const getShippingProviderApi        = (id: number)                     => api.get(`/shipping-providers/${id}`);
export const createShippingProviderApi     = (data: Record<string, unknown>)  => api.post('/shipping-providers', data);
export const updateShippingProviderApi     = (id: number, data: Record<string, unknown>) => api.put(`/shipping-providers/${id}`, data);
export const deleteShippingProviderApi     = (id: number)                     => api.delete(`/shipping-providers/${id}`);
export const updateShippingProviderStatusApi = (id: number, status: number)   => api.patch(`/shipping-providers/${id}/status`, { status });

// Service Mode APIs
export const getServiceModesApi    = (page = 1, perPage = 10, search = '', status = '') => api.get('/service-modes', { params: { page, per_page: perPage, ...(search && { search }), ...(status && { status }) } });
export const getServiceModeApi     = (id: number)                     => api.get(`/service-modes/${id}`);
export const createServiceModeApi  = (data: Record<string, unknown>)  => api.post('/service-modes', data);
export const updateServiceModeApi  = (id: number, data: Record<string, unknown>) => api.put(`/service-modes/${id}`, data);
export const deleteServiceModeApi  = (id: number)                     => api.delete(`/service-modes/${id}`);
export const updateServiceModeStatusApi = (id: number, status: number) => api.patch(`/service-modes/${id}/status`, { status });

// Commodity APIs
export const getCommoditiesApi    = (page = 1, perPage = 10, search = '', status = '') => api.get('/commodities', { params: { page, per_page: perPage, ...(search && { search }), ...(status && { status }) } });
export const getCommodityApi      = (id: number)                     => api.get(`/commodities/${id}`);
export const createCommodityApi   = (data: Record<string, unknown>)  => api.post('/commodities', data);
export const updateCommodityApi   = (id: number, data: Record<string, unknown>) => api.put(`/commodities/${id}`, data);
export const deleteCommodityApi   = (id: number)                     => api.delete(`/commodities/${id}`);
export const updateCommodityStatusApi = (id: number, status: number) => api.patch(`/commodities/${id}/status`, { status });

// Incoterm APIs
export const getIncotermsApi    = (page = 1, perPage = 10, search = '', status = '') => api.get('/incoterms', { params: { page, per_page: perPage, ...(search && { search }), ...(status && { status }) } });
export const getIncotermApi     = (id: number)                     => api.get(`/incoterms/${id}`);
export const createIncotermApi  = (data: Record<string, unknown>)  => api.post('/incoterms', data);
export const updateIncotermApi  = (id: number, data: Record<string, unknown>) => api.put(`/incoterms/${id}`, data);
export const deleteIncotermApi  = (id: number)                     => api.delete(`/incoterms/${id}`);
export const updateIncotermStatusApi = (id: number, status: number) => api.patch(`/incoterms/status/${id}`, { status });

// Customer Visit APIs
export const getCustomerVisitsApi   = (page = 1, perPage = 10, search = '') => api.get('/customer-visits', { params: { page, per_page: perPage, ...(search && { search }) } });
export const getCustomerVisitApi    = (id: number)                            => api.get(`/customer-visits/${id}`);
export const createCustomerVisitApi = (data: Record<string, unknown>)         => api.post('/customer-visits', data);
export const updateCustomerVisitApi = (id: number, data: Record<string, unknown>) => api.put(`/customer-visits/${id}`, data);
export const deleteCustomerVisitApi = (id: number)                            => api.delete(`/customer-visits/${id}`);

export default api;
