import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOpportunityApi } from "@/services/api";
import { toast } from "@/hooks/use-toast";

const Field = ({ label, value }: { label: string; value?: string | number | null }) => (
  <div className="space-y-1">
    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</p>
    <p className="text-sm font-medium text-foreground">{value || "-"}</p>
  </div>
);

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="material-card material-elevation-1 p-6 space-y-4">
    <h2 className="text-lg font-bold text-primary">{title}</h2>
    {children}
  </div>
);

const ViewOpportunity = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOpportunityApi(id!)
      .then((res) => setData(res.data?.data ?? res.data))
      .catch(() => {
        toast({ title: "Error", description: "Failed to load opportunity", variant: "destructive" });
        navigate("/sales/opportunity");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Loading...</span>
      </div>
    );
  }

  if (!data) return null;

  const sd = data.shipment_details ?? {};
  const pd = data.party_details ?? {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/sales/opportunity")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">View Rate Request</h1>
          <p className="text-muted-foreground text-sm mt-1">Read-only view of rate request details</p>
        </div>
      </div>

      {/* Basic Details */}
      <SectionCard title="Basic Details">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Field label="Date" value={data.date} />
          <Field label="Location" value={data.location} />
          <Field label="Lead Reference" value={data.lead_ref} />
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
      </SectionCard>

      {/* Shipment Details */}
      <SectionCard title="Shipment Details">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
          <div className="md:col-span-2">
            <Field label="Cargo Description" value={sd.cargo_description} />
          </div>
        </div>
      </SectionCard>

      {/* Party Details */}
      <SectionCard title="Party Details">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Field label="Customer" value={pd.customer} />
          <Field label="Contact Person" value={pd.contact_person} />
          <Field label="Designation" value={pd.designation} />
          <Field label="Customer Type" value={pd.customer_type} />
          <Field label="Prospect" value={pd.prospect} />
          <Field label="Department" value={pd.department} />
          <Field label="Street 1" value={pd.address_street1} />
          <Field label="Street 2" value={pd.address_street2} />
          <Field label="State" value={pd.address_state} />
          <Field label="City" value={pd.address_city} />
          <Field label="ZIP" value={pd.address_zip} />
          <Field label="Country" value={pd.address_country} />
          <Field label="Email" value={pd.email} />
          <Field label="Telephone No" value={pd.telephone_no} />
          <Field label="Mobile No" value={pd.mobile_no} />
        </div>
      </SectionCard>

      {/* Vendor Rates */}
      <SectionCard title="Vendor Rate Comparison">
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-semibold text-muted-foreground">AGENT</th>
                <th className="text-left p-3 font-semibold text-muted-foreground">CURRENCY</th>
                <th className="text-left p-3 font-semibold text-muted-foreground">RATE TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {data.vendor_rates?.length > 0 ? data.vendor_rates.map((r: any) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="p-3">{r.vendor_agent}</td>
                  <td className="p-3">{r.currency}</td>
                  <td className="p-3">{r.rate_total}</td>
                </tr>
              )) : (
                <tr><td colSpan={3} className="p-4 text-center text-muted-foreground">No vendor rates</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Additional Services */}
      <SectionCard title="Additional Services">
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-semibold text-muted-foreground">SERVICE</th>
                <th className="text-left p-3 font-semibold text-muted-foreground">CONTAINER TYPE</th>
                <th className="text-left p-3 font-semibold text-muted-foreground">QUANTITY</th>
              </tr>
            </thead>
            <tbody>
              {data.additional_services?.length > 0 ? data.additional_services.map((s: any) => (
                <tr key={s.id} className="border-t border-border">
                  <td className="p-3">{s.additional_service}</td>
                  <td className="p-3">{s.container_type}</td>
                  <td className="p-3">{s.container_quantity}</td>
                </tr>
              )) : (
                <tr><td colSpan={3} className="p-4 text-center text-muted-foreground">No additional services</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Customer Visits */}
      <SectionCard title="Customer Visit Information">
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-semibold text-muted-foreground">DATE & TIME</th>
                <th className="text-left p-3 font-semibold text-muted-foreground">MODE</th>
                <th className="text-left p-3 font-semibold text-muted-foreground">VISITED BY</th>
                <th className="text-left p-3 font-semibold text-muted-foreground">PURPOSE</th>
                <th className="text-left p-3 font-semibold text-muted-foreground">NEXT VISIT</th>
                <th className="text-left p-3 font-semibold text-muted-foreground">NOTES</th>
              </tr>
            </thead>
            <tbody>
              {data.customer_visits?.length > 0 ? data.customer_visits.map((v: any) => (
                <tr key={v.id} className="border-t border-border">
                  <td className="p-3 whitespace-nowrap">{v.visit_date} {v.visit_time}</td>
                  <td className="p-3">{v.mode_of_communication}</td>
                  <td className="p-3">{v.visited_by}</td>
                  <td className="p-3">{v.purpose}</td>
                  <td className="p-3">{v.next_visit || "-"}</td>
                  <td className="p-3">{v.visit_notes}</td>
                </tr>
              )) : (
                <tr><td colSpan={6} className="p-4 text-center text-muted-foreground">No visits</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <div className="flex justify-end pb-6">
        <Button variant="outline" onClick={() => navigate("/sales/opportunity")}>
          Back to List
        </Button>
      </div>
    </div>
  );
};

export default ViewOpportunity;
