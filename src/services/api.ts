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

export const getCurrenciesApi    = ()                               => api.get('/currencies');
export const getCurrencyApi      = (id: number)                     => api.get(`/currencies/${id}`);
export const createCurrencyApi   = (data: Record<string, unknown>)  => api.post('/currencies', data);
export const updateCurrencyApi   = (id: number, data: Record<string, unknown>) => api.put(`/currencies/${id}`, data);
export const deleteCurrencyApi   = (id: number)                     => api.delete(`/currencies/${id}`);
export const updateCurrencyStatusApi = (id: number, status: number) => api.patch(`/currencies/${id}/status`, { status });

export default api;
