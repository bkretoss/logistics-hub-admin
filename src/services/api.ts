import axios from "axios";

// const BASE_URL = "http://localhost:8001/api";
const BASE_URL = "https://logistic.kretoss.in/api";

export const API_BASE = BASE_URL.replace('/api', '');

const api = axios.create({
  baseURL: BASE_URL,
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
export const createEmployeeApi   = (data: any, config?: any)        => api.post('/employees', data, config);
export const updateEmployeeApi   = (id: number, data: any, config?: any) => api.put(`/employees/${id}`, data, config);
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

// Operations APIs
export const getOperationsApi    = (page = 1, perPage = 10, search = '') => api.get('/operations', { params: { page, per_page: perPage, ...(search && { search }) } });
export const getOperationApi     = (id: number)                          => api.get(`/operations/${id}`);
export const createOperationApi  = (data: Record<string, unknown>)       => api.post('/operations', data);
export const updateOperationApi  = (id: number, data: Record<string, unknown>) => api.put(`/operations/${id}`, data);
export const deleteOperationApi  = (id: number)                          => api.delete(`/operations/${id}`);
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

// Master Company APIs
export const getMasterCompaniesApi   = (page = 1, perPage = 9999) => api.get('/master-company', { params: { page, per_page: perPage } });
export const getMasterCompanyApi     = (id: number)               => api.get(`/master-company/${id}`);
export const createMasterCompanyApi  = (data: FormData)           => api.post('/master-company', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateMasterCompanyApi  = (id: number, data: FormData) => api.put(`/master-company/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteMasterCompanyApi  = (id: number)               => api.delete(`/master-company/${id}`);
export const updateMasterCompanyStatusApi = (id: number, status: number) => api.patch(`/master-company/${id}/status`, { status });

// Master Company Address APIs
export const getMasterCompanyAddressesApi  = (companyId?: number)                         => api.get('/master-company-address', { params: { ...(companyId ? { company_id: companyId } : {}), per_page: 9999 } });
export const createMasterCompanyAddressApi = (data: Record<string, unknown>)              => api.post('/master-company-address', data);
export const updateMasterCompanyAddressApi = (id: number, data: Record<string, unknown>)  => api.put(`/master-company-address/${id}`, data);
export const deleteMasterCompanyAddressApi = (id: number)                                 => api.delete(`/master-company-address/${id}`);

// Master Company COA APIs
export const getMasterCompanyCOAsApi  = (companyId?: number)                        => api.get('/master-company-coa', { params: { ...(companyId ? { company_id: companyId } : {}), per_page: 9999 } });
export const createMasterCompanyCOAApi = (data: Record<string, unknown>)            => api.post('/master-company-coa', data);
export const updateMasterCompanyCOAApi = (id: number, data: Record<string, unknown>) => api.put(`/master-company-coa/${id}`, data);
export const deleteMasterCompanyCOAApi = (id: number)                               => api.delete(`/master-company-coa/${id}`);

// Master Company Document APIs
export const getMasterCompanyDocumentsApi  = (companyId?: number)                  => api.get('/master-company-document', { params: { ...(companyId ? { company_id: companyId } : {}), per_page: 9999 } });
export const createMasterCompanyDocumentApi = (data: FormData)                     => api.post('/master-company-document', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateMasterCompanyDocumentApi = (id: number, data: FormData)         => api.put(`/master-company-document/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteMasterCompanyDocumentApi = (id: number)                         => api.delete(`/master-company-document/${id}`);

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

// Master Port APIs
export const getMasterPortsApi   = (page = 1, perPage = 10, search = '', status = '') => api.get('/master-port', { params: { page, per_page: perPage, ...(search && { search }), ...(status && { status }) } });
export const getMasterPortApi    = (id: number) => api.get(`/master-port/${id}`);
export const createMasterPortApi = (data: Record<string, unknown>) => api.post('/master-port', data);
export const updateMasterPortApi = (id: number, data: Record<string, unknown>) => api.put(`/master-port/${id}`, data);
export const deleteMasterPortApi = (id: number) => api.delete(`/master-port/${id}`);

// Master Port Terminal APIs
export const getMasterPortTerminalsApi = (portId?: number) => api.get('/master-port-terminal', { params: { per_page: 100, ...(portId ? { port_id: portId } : {}) } });

// Customer Visit APIs
export const getCustomerVisitsApi   = (page = 1, perPage = 10, search = '') => api.get('/customer-visits', { params: { page, per_page: perPage, ...(search && { search }) } });
export const getCustomerVisitApi    = (id: number)                            => api.get(`/customer-visits/${id}`);
export const createCustomerVisitApi = (data: Record<string, unknown>)         => api.post('/customer-visits', data);
export const updateCustomerVisitApi = (id: number, data: Record<string, unknown>) => api.put(`/customer-visits/${id}`, data);
export const deleteCustomerVisitApi = (id: number)                            => api.delete(`/customer-visits/${id}`);

// Branch APIs
export const getBranchesApi  = (page = 1, perPage = 10, search = '') => api.get('/branches', { params: { page, per_page: perPage, ...(search && { search }) } });
export const getBranchApi    = (id: number)                           => api.get(`/branches/${id}`);
export const deleteBranchApi = (id: number)                           => api.delete(`/branches/${id}`);

// User Master APIs
export const getUserMastersApi  = (page = 1, perPage = 10, search = '') => api.get('/user-master', { params: { page, per_page: perPage, ...(search && { search }) } });
export const getUserMasterApi   = (id: number)                            => api.get(`/user-master/${id}`);
export const createUserMasterApi = (data: Record<string, unknown>)        => api.post('/user-master', data);
export const updateUserMasterApi = (id: number, data: Record<string, unknown>) => api.put(`/user-master/${id}`, data);
export const deleteUserMasterApi = (id: number)                           => api.delete(`/user-master/${id}`);

// Operation Dimension APIs
export const getDimensionsApi   = (operationId?: number) => api.get('/operation-dimension', { params: { per_page: 100, ...(operationId ? { operation_id: operationId } : {}) } });
export const getDimensionApi    = (id: number) => api.get(`/operation-dimension/${id}`);
export const createDimensionApi = (data: Record<string, unknown>) => api.post('/operation-dimension', data);
export const updateDimensionApi = (id: number, data: Record<string, unknown>) => api.put(`/operation-dimension/${id}`, data);
export const deleteDimensionApi = (id: number) => api.delete(`/operation-dimension/${id}`);

// Operation Subledger APIs
export const getSubledgersApi   = (operationId?: number) => api.get('/operation-subledgers', { params: { per_page: 100, ...(operationId ? { operation_id: operationId } : {}) } });
export const getSubledgerApi    = (id: number) => api.get(`/operation-subledgers/${id}`);
export const createSubledgerApi = (data: Record<string, unknown>) => api.post('/operation-subledgers', data);
export const updateSubledgerApi = (id: number, data: Record<string, unknown>) => api.put(`/operation-subledgers/${id}`, data);
export const deleteSubledgerApi = (id: number) => api.delete(`/operation-subledgers/${id}`);

// Operation Rider Container APIs
export const getRiderContainersApi   = (operationId: number) => api.get('/operation-rider-container', { params: { operation_id: operationId } });
export const getRiderContainerApi    = (id: number)          => api.get(`/operation-rider-container/${id}`);
export const createRiderContainerApi = (data: Record<string, unknown>) => api.post('/operation-rider-container', data);
export const updateRiderContainerApi = (id: number, data: Record<string, unknown>) => api.put(`/operation-rider-container/${id}`, data);
export const deleteRiderContainerApi = (id: number)          => api.delete(`/operation-rider-container/${id}`);

// Operation Cargo Details APIs
export const getCargoDetailsApi   = (operationId: number) => api.get('/operation-cargo-details', { params: { operation_id: operationId } });
export const getCargoDetailApi    = (id: number)          => api.get(`/operation-cargo-details/${id}`);
export const createCargoDetailApi = (data: Record<string, unknown>) => api.post('/operation-cargo-details', data);
export const updateCargoDetailApi = (id: number, data: Record<string, unknown>) => api.put(`/operation-cargo-details/${id}`, data);
export const deleteCargoDetailApi = (id: number)          => api.delete(`/operation-cargo-details/${id}`);

// Operation Shipping Bill APIs
export const getShippingBillsApi   = (operationId: number) => api.get('/operation-shipping-bill', { params: { operation_id: operationId, per_page: 100 } });
export const getShippingBillApi    = (id: number) => api.get(`/operation-shipping-bill/${id}`);
export const createShippingBillApi = (data: Record<string, unknown>) => api.post('/operation-shipping-bill', data);
export const updateShippingBillApi = (id: number, data: Record<string, unknown>) => api.put(`/operation-shipping-bill/${id}`, data);
export const deleteShippingBillApi = (id: number) => api.delete(`/operation-shipping-bill/${id}`);

// Operation Routing APIs
export const getRoutingsApi   = (operationId: number) => api.get('/operation-routing', { params: { operation_id: operationId, per_page: 100 } });
export const getRoutingApi    = (id: number) => api.get(`/operation-routing/${id}`);
export const createRoutingApi = (data: Record<string, unknown>) => api.post('/operation-routing', data);
export const updateRoutingApi = (id: number, data: Record<string, unknown>) => api.put(`/operation-routing/${id}`, data);
export const deleteRoutingApi = (id: number) => api.delete(`/operation-routing/${id}`);

// Operation House Job APIs
export const getHouseJobsApi   = (operationId: number) => api.get('/operation-house-job', { params: { operation_id: operationId, per_page: 100 } });
export const getHouseJobApi    = (id: number) => api.get(`/operation-house-job/${id}`);
export const createHouseJobApi = (data: Record<string, unknown>) => api.post('/operation-house-job', data);
export const updateHouseJobApi = (id: number, data: Record<string, unknown>) => api.put(`/operation-house-job/${id}`, data);
export const deleteHouseJobApi = (id: number) => api.delete(`/operation-house-job/${id}`);

// Operation Costing APIs
export const getAllCostingsApi = (page = 1, perPage = 10, search = '') => api.get('/operation-costing', { params: { page, per_page: perPage, ...(search && { search }) } });
export const getCostingsApi   = (operationId?: number) => api.get('/operation-costing', { params: { per_page: 100, ...(operationId ? { operation_id: operationId } : {}) } });
export const getCostingApi    = (id: number)          => api.get(`/operation-costing/${id}`);
export const createCostingApi = (data: Record<string, unknown>) => api.post('/operation-costing', data);
export const updateCostingApi = (id: number, data: Record<string, unknown>) => api.put(`/operation-costing/${id}`, data);
export const deleteCostingApi = (id: number)          => api.delete(`/operation-costing/${id}`);

export default api;
