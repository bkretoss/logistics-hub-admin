import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useOperations } from './OperationsContext';

const Field = ({ label, value }: { label: string; value?: string }) => (
  <div className="flex items-start gap-2 py-1.5">
    <span className="text-sm font-semibold text-foreground w-40 shrink-0">{label}</span>
    <span className="text-sm text-cyan-600 font-medium">{value || ''}</span>
  </div>
);

const ViewOperation = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { operations } = useOperations();
  const op = operations.find(o => o.id === Number(id));

  if (!op) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Operation not found.</p>
        <Button className="mt-4" onClick={() => navigate('/operations')}>Back to List</Button>
      </div>
    );
  }

  const isVessel = ['FCL Import', 'FCL Export', 'LCL Export', 'LCL Import', 'Land Export', 'Land Import'].includes(op.document);
  const flightLabel = isVessel ? 'Vessel Name' : 'Flight Name';
  const numberLabel = ['Land Import', 'Land Export'].includes(op.document)
    ? 'Vessel Number'
    : isVessel ? 'Voyage Number' : 'Flight Number';

  return (
    <div className="space-y-4">
      {/* Breadcrumb + header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">
            <button className="hover:underline text-primary" onClick={() => navigate('/operations')}>Jobs List</button>
            {' › '}
            <span>Job No# - ( {op.jobNo || '—'} ~ {op.jobDate} )</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/operations')}>Cancel</Button>
          <Button size="sm" className="bg-amber-400 hover:bg-amber-500 text-black font-semibold">Reports</Button>
          <Button variant="outline" size="sm" onClick={() => navigate(`/operations/edit/${op.id}`)}>Edit</Button>
          <Button variant="outline" size="sm">Create</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-border text-sm">
        {['Show All', 'Job Details', "Subledgers", "Dimension's", 'Shipping Instructions', 'Costing', 'Shipping Bill / BOE', "House's List", 'Others'].map((tab, i) => (
          <button
            key={tab}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${i === 1
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Job Details card */}
      <div className="material-card material-elevation-1 overflow-hidden">
        <div className="bg-[#00BCD4] px-6 py-3 flex items-center justify-between">
          <h2 className="text-white font-bold text-base">Job Details</h2>
          <Button size="sm" className="bg-amber-400 hover:bg-amber-500 text-black font-semibold text-xs">
            Duplicate Job
          </Button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-3 gap-x-6">
            {/* Column 1 */}
            <div className="col-span-1 space-y-0">
              <Field label="Document Name" value={op.document} />
              <Field label="Job Status" value={op.status} />
              <Field label="Place of Receipt" value={op.placeOfReceipt} />
              <Field label="POL Name" value={op.pol} />
              <Field label="POL ETD" value={op.polEtd} />
              <Field label="POD ETA" value={op.podEta} />
              <Field label="INCO Term" value="" />
              <Field label={flightLabel} value={op.flightName} />
              <Field label="Service Type" value={op.serviceType} />
              <div className="flex items-center gap-2 py-1.5">
                <span className="text-sm font-semibold text-foreground w-40 shrink-0">AWB No</span>
                <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white text-xs h-7 px-3">Gen BL NO#</Button>
              </div>
              <Field label="MAWB No" value={op.mblNo} />
              <Field label="Do No#" value="" />
              <Field label="BL Place of Issue" value="" />
              <Field label="On Board Date" value="" />
              <Field label="BL Mark No" value={op.blMarksNo} />
              <div className="py-1.5">
                <span className="text-sm font-semibold text-foreground">Notes</span>
                <p className="text-sm text-cyan-600 mt-1">{op.note}</p>
              </div>
              <div className="mt-2">
                <Button size="sm" className="bg-amber-400 hover:bg-amber-500 text-black text-xs font-semibold">Rider Container</Button>
              </div>
            </div>

            {/* Column 2 */}
            <div className="col-span-1 space-y-0">
              <Field label="Job Type" value={op.bookingType} />
              <Field label="PP / CC" value={op.freightPpCc} />
              <Field label="Place of Delivery" value={op.placeOfDelivery} />
              <Field label="POD Name" value={op.pod} />
              <Field label="POL ATD" value="" />
              <Field label="POD ATA" value="" />
              <Field label="No of BL" value="" />
              <Field label={numberLabel} value={op.flightNumber} />
              <Field label="BL Status" value={op.blServiceType} />
              <Field label="AWB Date" value="" />
              <Field label="MAWB Date" value="" />
              <Field label="Do Date" value="" />
              <Field label="Job Close Date" value="" />
              <Field label="Vessel Status" value="" />
            </div>

            {/* Column 3 — Source From and To */}
            <div className="col-span-1">
              <div className="border border-border rounded overflow-hidden">
                <div className="bg-slate-600 px-4 py-2">
                  <h3 className="text-white font-semibold text-sm">Source From and To</h3>
                </div>
                <div className="p-4 space-y-0">
                  <Field label="Quote No" value="" />
                  <Field label="Quote Date" value="" />
                  <Field label="Booking No" value="" />
                  <Field label="Booking Date" value={op.bookingDate} />
                  <Field label="No of Credit Days" value="" />
                  <Field label="Delivery Status" value={op.deliveryStatus} />
                  <Field label="Delivery Date" value={op.deliveryDate} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOperation;
