import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOpportunityApi } from "@/services/api";
import { toast } from "@/hooks/use-toast";

const Field = ({ label, value }: { label: string; value?: string | number | null }) => (
  <div className="space-y-1">
    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</p>
    <p className="text-sm text-foreground">{value || "—"}</p>
  </div>
);

const SectionTitle = ({ title }: { title: string }) => (
  <h2 className="text-lg font-bold text-primary mb-4">{title}</h2>
);

const ViewRateRequest = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getOpportunityApi(id!);
        const raw = res.data;
        setData(raw?.data ?? raw);
      } catch (err: any) {
        toast({ title: "Error", description: err?.response?.data?.message ?? "Failed to load rate request.", variant: "destructive" });
        navigate("/sales/rate-requests");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <div className="text-center py-12 text-muted-foreground">Loading...</div>;
  if (!data) return null;

  const sd = data.shipment_details ?? {};
  const pd = data.party_details ?? {};
  const vendorRates: any[] = data.vendor_rates ?? [];
  const additionalServices: any[] = data.additional_services ?? [];
  const customerVisits: any[] = data.customer_visits ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/sales/rate-requests")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Rate Request</h1>
          <p className="text-muted-foreground text-sm mt-1">View rate request details</p>
        </div>
        <Button className="gap-2 material-button text-black" onClick={() => navigate(`/sales/rate-requests/edit/${id}`)}>
          <Edit className="w-4 h-4" /> Edit
        </Button>
      </div>

      <div className="material-card material-elevation-1 p-6 space-y-8">
        {/* Basic Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Field label="Date" value={data.date} />
          <Field label="Location" value={data.location} />
          <Field label="Lead" value={data.lead} />
          <Field label="Sales Team" value={data.sales_team} />
          <Field label="Rate Request Source" value={data.opportunity_source} />
          <Field label="Rate Request Type" value={data.opportunity_type} />
          <Field label="Type" value={data.type} />
          <Field label="Sales Agent" value={data.sales_agent} />
          <Field label="Company" value={data.company} />
          <Field label="Pricing Team" value={data.pricing_team} />
          <Field label="Shipping Providers" value={data.shipping_providers} />
          <Field label="Status" value={data.status} />
        </div>

        {/* Shipment Details */}
        <div>
          <SectionTitle title="Shipment Details" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Field label="Transport Mode" value={sd.transport_mode} />
            <Field label="Shipment Type" value={sd.shipment_type} />
            <Field label="Cargo Type" value={sd.cargo_type} />
            <Field label="Incoterms" value={sd.incoterms} />
            <Field label="Commodity" value={sd.commodity} />
            <Field label="Service Mode" value={sd.service_mode} />
            <Field label="Estimated Shipment Date" value={sd.estimated_shipment_date} />
            <Field label="Cargo Status" value={sd.cargo_status} />
            <Field label="Origin Country" value={sd.origin_country} />
            <Field label="Destination Country" value={sd.destination_country} />
            <div className="md:col-span-2 space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Cargo Description</p>
              <p className="text-sm text-foreground">{sd.cargo_description || "—"}</p>
            </div>
          </div>
        </div>

        {/* Party Details */}
        <div>
          <SectionTitle title="Party Details" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Field label="Customer" value={pd.customer} />
            <Field label="Contact Person" value={pd.contact_person} />
            <Field label="Designation" value={pd.designation} />
            <Field label="Customer Type" value={pd.customer_type} />
            <Field label="Prospect" value={pd.prospect} />
            <Field label="Department" value={pd.department} />
            <Field label="Email" value={pd.email} />
            <Field label="Telephone No" value={pd.telephone_no} />
            <Field label="Mobile No" value={pd.mobile_no} />
            <div className="md:col-span-3 space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Address</p>
              <p className="text-sm text-foreground">
                {[pd.address_street1, pd.address_street2, pd.address_city, pd.address_state, pd.address_zip, pd.address_country].filter(Boolean).join(", ") || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Vendor Rates */}
        <div>
          <SectionTitle title="Vendor Rate Comparison" />
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground">AGENT</th>
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground">CURRENCY</th>
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground">RATE TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {vendorRates.length === 0 ? (
                  <tr><td colSpan={3} className="p-4 text-center text-muted-foreground text-sm">No vendor rates</td></tr>
                ) : vendorRates.map((vr, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="p-3 text-sm">{vr.vendor_agent}</td>
                    <td className="p-3 text-sm">{vr.currency}</td>
                    <td className="p-3 text-sm">{vr.rate_total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Services */}
        <div>
          <SectionTitle title="Additional Services" />
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground">SERVICE</th>
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground">CONTAINER TYPE</th>
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground">QUANTITY</th>
                </tr>
              </thead>
              <tbody>
                {additionalServices.length === 0 ? (
                  <tr><td colSpan={3} className="p-4 text-center text-muted-foreground text-sm">No additional services</td></tr>
                ) : additionalServices.map((s, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="p-3 text-sm">{s.additional_service}</td>
                    <td className="p-3 text-sm">{s.container_type}</td>
                    <td className="p-3 text-sm">{s.container_quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Visits */}
        <div>
          <SectionTitle title="Customer Visit Information" />
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground">DATE & TIME</th>
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground">MODE OF COMMUNICATION</th>
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground">VISITED BY</th>
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground">PURPOSE</th>
                  <th className="text-left p-3 text-xs font-semibold text-muted-foreground">NOTES</th>
                </tr>
              </thead>
              <tbody>
                {customerVisits.length === 0 ? (
                  <tr><td colSpan={5} className="p-4 text-center text-muted-foreground text-sm">No visits</td></tr>
                ) : customerVisits.map((v, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="p-3 text-sm">{v.visit_date} {v.visit_time}</td>
                    <td className="p-3 text-sm">{v.mode_of_communication}</td>
                    <td className="p-3 text-sm">{v.visited_by}</td>
                    <td className="p-3 text-sm">{v.purpose}</td>
                    <td className="p-3 text-sm">{v.visit_notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewRateRequest;
