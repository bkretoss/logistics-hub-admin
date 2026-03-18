import React, { createContext, useContext, useState } from 'react';
import type { OperationFormData } from './NewOperation';

export interface Operation extends OperationFormData {
  id: number;
  status: string;
  statusColor: string;
  statusBgColor: string;
}

const seed: Operation[] = [
  {
    id: 1,
    jobNo: 'JOB-001',
    document: 'Air Export',
    branch: 'Chennai',
    jobDate: '2026-03-18',
    freightPpCc: 'Collect',
    placeOfReceipt: 'Chennai ICD',
    placeOfDelivery: 'Dubai Airport',
    pol: 'Chennai',
    pod: 'Dubai',
    polEtd: '2026-03-20',
    flightName: 'Emirates',
    flightNumber: 'EK542',
    podEta: '2026-03-21',
    note: 'Handle with care',
    serviceType: 'Door to Door',
    blServiceType: 'Original',
    blNo: 'BL-2026-001',
    mblNo: 'MBL-2026-001',
    salesPerson: 'John Smith',
    customer: 'TEXGRAM INC DBA INOTEX',
    customerAddress: '12828 S BROADWAY\nLOS ANGELES, CA 90061\nTEL: 714-240-4446',
    shipper: 'TEST1',
    shipperAddress: 'aaaa',
    carrier: 'TEAMGLOBAL LOGISTICS PVT LTD',
    carrierAddress: 'Reflections building.2, Leith Castle\nCenter Street, Santhome High Rd, Chennai,\nTamil Nadu 600028',
    consignee: 'TEXELQ ENGINEERING INDIA PRIVATE LIMITED',
    consigneeAddress: 'NO.77/2, KUTHAMPAKKAM ROAD,\nMEVALURKUPPAM, SRIPERUMBUDUR (TK)\nKANCHIPURAM DIST - 602105.',
    notify1: 'Notify Party 1',
    deliveryAgentName: 'DHL Express',
    deliveryAgent: 'Agent A',
    deliveryStatus: 'Delivered',
    deliveryDate: '2026-03-22',
    bookingDate: '2026-03-18',
    bookingType: 'Export',
    blMarksNo: '',
    etd: '2026-03-20',
    eta: '2026-03-21',
    vesselName: '',
    voyageNumber: '',
    status: 'Process',
    statusColor: 'text-yellow-500',
    statusBgColor: 'bg-yellow-500/10',
  },
  {
    id: 2,
    jobNo: 'JOB-002',
    document: 'Air Export',
    branch: 'Mumbai',
    jobDate: '2026-03-15',
    freightPpCc: 'Prepaid',
    placeOfReceipt: 'Mumbai Airport',
    placeOfDelivery: 'Singapore Changi',
    pol: 'Mumbai',
    pod: 'Singapore',
    polEtd: '2026-03-16',
    flightName: 'Singapore Airlines',
    flightNumber: 'SQ423',
    podEta: '2026-03-17',
    note: 'Urgent delivery',
    serviceType: 'Port to Port',
    blServiceType: 'Seaway Bill',
    blNo: 'BL-2026-002',
    mblNo: 'MBL-2026-002',
    salesPerson: 'Jane Doe',
    customer: 'Acme Corporation',
    customerAddress: '123 Business St, New York, NY 10001',
    shipper: 'Relay Logistics',
    shipperAddress: 'Mumbai HQ',
    carrier: 'Maersk Line',
    carrierAddress: 'Maersk House, Mumbai',
    consignee: 'SG Imports Pte',
    consigneeAddress: '10 Changi Business Park, Singapore',
    notify1: '',
    deliveryAgentName: 'FedEx',
    deliveryAgent: 'Agent B',
    deliveryStatus: 'Delivered',
    deliveryDate: '2026-03-18',
    bookingDate: '2026-03-15',
    bookingType: 'Export',
    blMarksNo: '',
    etd: '2026-03-16',
    eta: '2026-03-17',
    vesselName: '',
    voyageNumber: '',
    status: 'Closed',
    statusColor: 'text-green-500',
    statusBgColor: 'bg-green-500/10',
  },
  {
    id: 3,
    jobNo: 'JOB-003',
    document: 'Air Export',
    branch: 'Delhi',
    jobDate: '2026-03-10',
    freightPpCc: 'Collect',
    placeOfReceipt: 'Delhi ICD',
    placeOfDelivery: 'London Heathrow',
    pol: 'Delhi',
    pod: 'London',
    polEtd: '2026-03-12',
    flightName: 'British Airways',
    flightNumber: 'BA117',
    podEta: '2026-03-12',
    note: 'Fragile items',
    serviceType: 'Door to Port',
    blServiceType: 'Original',
    blNo: 'BL-2026-003',
    mblNo: 'MBL-2026-003',
    salesPerson: 'Mike Johnson',
    customer: 'Global Shipping Ltd',
    customerAddress: '456 Commerce Ave, Los Angeles',
    shipper: 'FastTrack Shippers',
    shipperAddress: 'Delhi Cargo Hub',
    carrier: 'Emirates SkyCargo',
    carrierAddress: 'Emirates Cargo, Delhi T3',
    consignee: 'UK Distributors Ltd',
    consigneeAddress: '10 Heathrow Cargo Centre, London',
    notify1: 'UK Notify Co',
    deliveryAgentName: 'UPS',
    deliveryAgent: 'Agent C',
    deliveryStatus: 'Pending',
    deliveryDate: '',
    bookingDate: '2026-03-10',
    bookingType: 'Export',
    blMarksNo: '',
    etd: '2026-03-12',
    eta: '2026-03-12',
    vesselName: '',
    voyageNumber: '',
    status: 'Created',
    statusColor: 'text-blue-500',
    statusBgColor: 'bg-blue-500/10',
  },
];

interface OperationsContextType {
  operations: Operation[];
  addOperation: (op: Operation) => void;
  updateOperation: (id: number, data: Partial<Operation>) => void;
  deleteOperation: (id: number) => void;
}

const OperationsContext = createContext<OperationsContextType | null>(null);

export const OperationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [operations, setOperations] = useState<Operation[]>(seed);

  const addOperation = (op: Operation) => setOperations(prev => [op, ...prev]);

  const updateOperation = (id: number, data: Partial<Operation>) =>
    setOperations(prev => prev.map(o => (o.id === id ? { ...o, ...data } : o)));

  const deleteOperation = (id: number) =>
    setOperations(prev => prev.filter(o => o.id !== id));

  return (
    <OperationsContext.Provider value={{ operations, addOperation, updateOperation, deleteOperation }}>
      {children}
    </OperationsContext.Provider>
  );
};

export const useOperations = () => {
  const ctx = useContext(OperationsContext);
  if (!ctx) throw new Error('useOperations must be used within OperationsProvider');
  return ctx;
};
