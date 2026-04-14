import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getOperationsApi, deleteOperationApi } from '@/services/api';

export interface Operation {
  id: number;
  document: string;
  branch: string;
  job_date: string;
  freight_pp_cc: string;
  place_of_receipt: string;
  place_of_delivery: string;
  pol: string;
  pod: string;
  pol_etd: string;
  pod_eta: string;
  flight_name: string;
  flight_number: string;
  service_type: string;
  note: string;
  customer: string;
  customer_branch: string;
  customer_address: string;
  shipper: string;
  shipper_address: string;
  carrier: string;
  carrier_address: string;
  consignee: string;
  consignee_address: string;
  status: number;
  created_at: string;
  // UI-only display helpers (derived)
  statusLabel: string;
  statusColor: string;
  statusBgColor: string;
}

const STATUS_MAP: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: 'Active',   color: 'text-green-500',  bg: 'bg-green-500/10'  },
  0: { label: 'Inactive', color: 'text-red-500',    bg: 'bg-red-500/10'    },
};

export const toOperation = (raw: any): Operation => {
  const s = STATUS_MAP[raw.status] ?? { label: 'Active', color: 'text-green-500', bg: 'bg-green-500/10' };
  return {
    id:               raw.id,
    document:         raw.document         ?? '',
    branch:           raw.branch           ?? '',
    job_date:         raw.job_date         ?? '',
    freight_pp_cc:    raw.freight_pp_cc    ?? '',
    place_of_receipt: raw.place_of_receipt ?? '',
    place_of_delivery:raw.place_of_delivery?? '',
    pol:              raw.pol              ?? '',
    pod:              raw.pod              ?? '',
    pol_etd:          raw.pol_etd          ?? '',
    pod_eta:          raw.pod_eta          ?? '',
    flight_name:      raw.flight_name      ?? '',
    flight_number:    raw.flight_number    ?? '',
    service_type:     raw.service_type     ?? '',
    note:             raw.note             ?? '',
    customer:         raw.customer         ?? '',
    customer_branch:  raw.customer_branch  ?? '',
    customer_address: raw.customer_address ?? '',
    shipper:          raw.shipper          ?? '',
    shipper_address:  raw.shipper_address  ?? '',
    carrier:          raw.carrier          ?? '',
    carrier_address:  raw.carrier_address  ?? '',
    consignee:        raw.consignee        ?? '',
    consignee_address:raw.consignee_address?? '',
    status:           raw.status           ?? 1,
    created_at:       raw.created_at       ?? '',
    statusLabel:      s.label,
    statusColor:      s.color,
    statusBgColor:    s.bg,
  };
};

interface OperationsContextType {
  operations: Operation[];
  total: number;
  loading: boolean;
  page: number;
  pageSize: number;
  searchTerm: string;
  setPage: (p: number) => void;
  setPageSize: (n: number) => void;
  setSearchTerm: (s: string) => void;
  refresh: () => void;
  deleteOperation: (id: number) => Promise<void>;
}

const OperationsContext = createContext<OperationsContextType | null>(null);

export const OperationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [total, setTotal]           = useState(0);
  const [loading, setLoading]       = useState(false);
  const [page, setPage]             = useState(1);
  const [pageSize, setPageSize]     = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getOperationsApi(1, 9999, '');
      const raw: any[] = res.data?.data ?? res.data ?? [];
      setTotal(res.data?.pagination?.total ?? raw.length);
      setOperations(raw.map(toOperation));
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const deleteOperation = async (id: number) => {
    await deleteOperationApi(id);
    load();
  };

  return (
    <OperationsContext.Provider value={{
      operations, total, loading,
      page, pageSize, searchTerm,
      setPage, setPageSize, setSearchTerm,
      refresh: load, deleteOperation,
    }}>
      {children}
    </OperationsContext.Provider>
  );
};

export const useOperations = () => {
  const ctx = useContext(OperationsContext);
  if (!ctx) throw new Error('useOperations must be used within OperationsProvider');
  return ctx;
};
