import { useCallback, useState } from "react";
import { X } from "lucide-react";

const ADMIN_ID = "administrative-aoi";
const PARLIAMENTARY_ID = "parliamentary-boundary";
const ASSEMBLY_ID = "assembly-boundary";
const CADASTRAL_ID = "department-cadastral";
const HSVP_ID = "hsvp-land";

function AoiCheckboxRow({ checked, onChange, label }) {
  return (
    <label className="nm-aoi-check-row">
      <input
        type="checkbox"
        className="nm-aoi-check-input"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="nm-aoi-check-visual" aria-hidden />
      <span className="nm-aoi-check-label">{label}</span>
    </label>
  );
}

export default function SelectLandPanel({ options, onSelectOption, onClose }) {
  const [openId, setOpenId] = useState(null);

  const [stateName, setStateName] = useState("HARYANA");
  const [district, setDistrict] = useState("");
  const [tehsil, setTehsil] = useState("");
  const [village, setVillage] = useState("");
  const [bufferValue, setBufferValue] = useState("2");
  const [bufferUnit, setBufferUnit] = useState("Kilometer");

  const [lokSabha, setLokSabha] = useState("bhiwani");
  const [cbLokSabhaBoundary, setCbLokSabhaBoundary] = useState(true);
  const [cbParliamentaryBoundary, setCbParliamentaryBoundary] = useState(true);
  const [cbRajyaVidhan, setCbRajyaVidhan] = useState(false);

  const [assemblyDistrict, setAssemblyDistrict] = useState("");
  const [vidhanSabha, setVidhanSabha] = useState("");

  const [cadDistrict, setCadDistrict] = useState("");
  const [cadTehsil, setCadTehsil] = useState("");
  const [cadVillage, setCadVillage] = useState("");
  const [muraba, setMuraba] = useState("");
  const [parcel, setParcel] = useState("");
  const [cadRadius, setCadRadius] = useState("5");
  const [cadUnit, setCadUnit] = useState("Kilometer");

  const [hsvpDistrict, setHsvpDistrict] = useState("");
  const [hsvpSector, setHsvpSector] = useState("");
  const [hsvpPlot, setHsvpPlot] = useState("");

  const toggleSection = useCallback(
    (id) => {
      setOpenId((prev) => {
        const next = prev === id ? null : id;
        (onSelectOption ?? (() => {}))(next ?? "");
        return next;
      });
    },
    [onSelectOption],
  );

  const clearAdministrativeForm = () => {
    setStateName("HARYANA");
    setDistrict("");
    setTehsil("");
    setVillage("");
    setBufferValue("2");
    setBufferUnit("Kilometer");
  };

  const clearParliamentaryForm = () => {
    setLokSabha("bhiwani");
    setCbLokSabhaBoundary(true);
    setCbParliamentaryBoundary(true);
    setCbRajyaVidhan(false);
  };

  const clearAssemblyForm = () => {
    setAssemblyDistrict("");
    setVidhanSabha("");
  };

  const clearCadastralForm = () => {
    setCadDistrict("");
    setCadTehsil("");
    setCadVillage("");
    setMuraba("");
    setParcel("");
    setCadRadius("5");
    setCadUnit("Kilometer");
  };

  const renderForm = (id) => {
    if (id === ADMIN_ID) {
      return (
        <>
          <h3 className="nm-aoi-form-kicker">Administrative boundary</h3>
          <p className="nm-aoi-form-hint">
            Choose district, then tehsil and village to define your area of interest and zoom the map.
          </p>
          <div className="nm-aoi-fields">
            <label className="nm-aoi-field">
              <span className="nm-aoi-field-label">State</span>
              <select
                className="nm-aoi-select"
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                aria-label="State"
              >
                <option value="HARYANA">HARYANA</option>
                <option value="PUNJAB">PUNJAB</option>
                <option value="RAJASTHAN">RAJASTHAN</option>
              </select>
            </label>
            <label className="nm-aoi-field">
              <span className="nm-aoi-field-label">District</span>
              <select className="nm-aoi-select" value={district} onChange={(e) => setDistrict(e.target.value)} aria-label="District">
                <option value="">District</option>
                <option value="ambala">Ambala</option>
                <option value="karnal">Karnal</option>
                <option value="rohtak">Rohtak</option>
              </select>
            </label>
            <label className="nm-aoi-field">
              <span className="nm-aoi-field-label">Tehsil</span>
              <select className="nm-aoi-select" value={tehsil} onChange={(e) => setTehsil(e.target.value)} aria-label="Tehsil">
                <option value="">Tehsil</option>
                <option value="t1">Tehsil 1</option>
                <option value="t2">Tehsil 2</option>
              </select>
            </label>
            <label className="nm-aoi-field">
              <span className="nm-aoi-field-label">Village</span>
              <select className="nm-aoi-select" value={village} onChange={(e) => setVillage(e.target.value)} aria-label="Village">
                <option value="">Village</option>
                <option value="v1">Village 1</option>
                <option value="v2">Village 2</option>
              </select>
            </label>
            <div className="nm-aoi-field nm-aoi-field--buffer">
              <span className="nm-aoi-field-label">Village buffer distance</span>
              <div className="nm-aoi-buffer-row">
                <input
                  type="number"
                  className="nm-aoi-input nm-aoi-input--num"
                  min={0}
                  step={0.5}
                  value={bufferValue}
                  onChange={(e) => setBufferValue(e.target.value)}
                  aria-label="Buffer distance value"
                />
                <select className="nm-aoi-select nm-aoi-select--unit" value={bufferUnit} onChange={(e) => setBufferUnit(e.target.value)} aria-label="Buffer unit">
                  <option value="Kilometer">Kilometer</option>
                  <option value="Meter">Meter</option>
                </select>
              </div>
            </div>
          </div>
          <div className="nm-aoi-form-actions">
            <button type="button" className="nm-btn nm-btn-primary nm-aoi-btn-analyze">
              Analyze
            </button>
            <button type="button" className="nm-aoi-btn-clear" onClick={clearAdministrativeForm}>
              Clear
            </button>
          </div>
          <button type="button" className="nm-aoi-btn-plan-route">
            Plan Route
          </button>
        </>
      );
    }

    if (id === PARLIAMENTARY_ID) {
      return (
        <>
          <h3 className="nm-aoi-form-kicker">Parliamentary boundary</h3>
          <p className="nm-aoi-form-hint">Toggle Lok Sabha and Vidhan Sabha boundaries on the map.</p>
          <div className="nm-aoi-fields">
            <label className="nm-aoi-field">
              <span className="nm-aoi-field-label">Lok Sabha</span>
              <select className="nm-aoi-select" value={lokSabha} onChange={(e) => setLokSabha(e.target.value)} aria-label="Lok Sabha constituency">
                <option value="bhiwani">Bhiwani-Mahendergarh</option>
                <option value="karnal">Karnal</option>
                <option value="sirsa">Sirsa</option>
              </select>
            </label>
            <div className="nm-aoi-field">
              <span className="nm-aoi-field-label">Constituency boundaries</span>
              <div className="nm-aoi-check-group">
                <AoiCheckboxRow label="Lok Sabha boundary" checked={cbLokSabhaBoundary} onChange={setCbLokSabhaBoundary} />
                <AoiCheckboxRow label="Parliamentary boundary" checked={cbParliamentaryBoundary} onChange={setCbParliamentaryBoundary} />
                <AoiCheckboxRow label="Rajya/Vidhan Sabha boundary" checked={cbRajyaVidhan} onChange={setCbRajyaVidhan} />
              </div>
            </div>
          </div>
          <button type="button" className="nm-aoi-btn-clear nm-aoi-btn-clear--solo" onClick={clearParliamentaryForm}>
            Clear
          </button>
        </>
      );
    }

    if (id === ASSEMBLY_ID) {
      return (
        <>
          <h3 className="nm-aoi-form-kicker">Assembly boundary</h3>
          <p className="nm-aoi-form-hint">Select district and Vidhan Sabha constituency.</p>
          <div className="nm-aoi-fields">
            <label className="nm-aoi-field">
              <span className="nm-aoi-field-label">District</span>
              <select
                className="nm-aoi-select"
                value={assemblyDistrict}
                onChange={(e) => setAssemblyDistrict(e.target.value)}
                aria-label="District"
              >
                <option value="">District</option>
                <option value="ambala">Ambala</option>
                <option value="karnal">Karnal</option>
              </select>
            </label>
            <label className="nm-aoi-field">
              <span className="nm-aoi-field-label">Vidhan Sabha</span>
              <select className="nm-aoi-select" value={vidhanSabha} onChange={(e) => setVidhanSabha(e.target.value)} aria-label="Vidhan Sabha constituency">
                <option value="">Vidhan Sabha constituency</option>
                <option value="vs1">Constituency 1</option>
                <option value="vs2">Constituency 2</option>
              </select>
            </label>
          </div>
          <button type="button" className="nm-aoi-btn-clear nm-aoi-btn-clear--solo" onClick={clearAssemblyForm}>
            Clear
          </button>
        </>
      );
    }

    if (id === CADASTRAL_ID) {
      return (
        <>
          <h3 className="nm-aoi-form-kicker">Cadastral parcel</h3>
          <p className="nm-aoi-form-hint">
            Select district through to Khasra parcel. The map zooms to the parcel; use nearby tools for infrastructure.
          </p>
          <div className="nm-aoi-fields">
            <label className="nm-aoi-field">
              <span className="nm-aoi-field-label">District (cadastral layer)</span>
              <select className="nm-aoi-select" value={cadDistrict} onChange={(e) => setCadDistrict(e.target.value)} aria-label="District cadastral">
                <option value="">District</option>
                <option value="d1">District 1</option>
                <option value="d2">District 2</option>
              </select>
            </label>
            <label className="nm-aoi-field">
              <span className="nm-aoi-field-label">Tehsil</span>
              <select className="nm-aoi-select" value={cadTehsil} onChange={(e) => setCadTehsil(e.target.value)} aria-label="Tehsil">
                <option value="">Tehsil</option>
                <option value="ct1">Tehsil A</option>
              </select>
            </label>
            <label className="nm-aoi-field">
              <span className="nm-aoi-field-label">Village</span>
              <select className="nm-aoi-select" value={cadVillage} onChange={(e) => setCadVillage(e.target.value)} aria-label="Village">
                <option value="">Village</option>
                <option value="cv1">Village A</option>
              </select>
            </label>
            <label className="nm-aoi-field">
              <span className="nm-aoi-field-label">Muraba</span>
              <select className="nm-aoi-select" value={muraba} onChange={(e) => setMuraba(e.target.value)} aria-label="Muraba">
                <option value="">Muraba</option>
                <option value="m1">Muraba 1</option>
              </select>
            </label>
            <label className="nm-aoi-field">
              <span className="nm-aoi-field-label">Khasra / parcel</span>
              <select className="nm-aoi-select" value={parcel} onChange={(e) => setParcel(e.target.value)} aria-label="Parcel">
                <option value="">Parcel</option>
                <option value="p1">Khasra 101</option>
              </select>
            </label>
            <div className="nm-aoi-field nm-aoi-field--buffer">
              <span className="nm-aoi-field-label">Nearby search radius (m)</span>
              <div className="nm-aoi-buffer-row">
                <input
                  type="number"
                  className="nm-aoi-input nm-aoi-input--num"
                  min={0}
                  step={1}
                  value={cadRadius}
                  onChange={(e) => setCadRadius(e.target.value)}
                  aria-label="Search radius value"
                />
                <select className="nm-aoi-select nm-aoi-select--unit" value={cadUnit} onChange={(e) => setCadUnit(e.target.value)} aria-label="Radius unit">
                  <option value="Kilometer">Kilometer</option>
                  <option value="Meter">Meter</option>
                </select>
              </div>
            </div>
          </div>
          <div className="nm-aoi-form-actions nm-aoi-form-actions--cad">
            <button type="button" className="nm-aoi-btn-clear" onClick={clearCadastralForm}>
              Clear parcel
            </button>
            <button type="button" className="nm-aoi-btn-features">
              Features near me
            </button>
          </div>
        </>
      );
    }

    if (id === HSVP_ID) {
      return (
        <>
          <h3 className="nm-aoi-form-kicker">HSVP / industrial land</h3>
          <p className="nm-aoi-form-hint">
            Industrial plots from Investment Zones (HSVP-style parcels). Pick district, then sector/area, then plot no — map zooms,
            report and distance connector update.
          </p>
          <div className="nm-aoi-fields">
            <label className="nm-aoi-field">
              <span className="nm-aoi-field-label">District</span>
              <select className="nm-aoi-select" value={hsvpDistrict} onChange={(e) => setHsvpDistrict(e.target.value)} aria-label="District">
                <option value="">District</option>
                <option value="hd1">Faridabad</option>
                <option value="hd2">Gurugram</option>
              </select>
            </label>
            <label className="nm-aoi-field">
              <span className="nm-aoi-field-label">Sector / area</span>
              <select className="nm-aoi-select" value={hsvpSector} onChange={(e) => setHsvpSector(e.target.value)} aria-label="Sector or area">
                <option value="">Sector / area</option>
                <option value="s1">Sector 57</option>
                <option value="s2">Sector 62</option>
              </select>
            </label>
            <label className="nm-aoi-field">
              <span className="nm-aoi-field-label">Plot no</span>
              <select className="nm-aoi-select" value={hsvpPlot} onChange={(e) => setHsvpPlot(e.target.value)} aria-label="Plot number">
                <option value="">Plot no</option>
                <option value="pl1">Plot 12</option>
                <option value="pl2">Plot 24</option>
              </select>
            </label>
          </div>
          <button type="button" className="nm-aoi-btn-zoom">
            Zoom
          </button>
        </>
      );
    }

    return null;
  };

  return (
    <aside className="nm-aoi-panel" role="dialog" aria-labelledby="nm-aoi-title">
      <div className="nm-aoi-head">
        <h2 id="nm-aoi-title">AOI &amp; land</h2>
        <button type="button" className="nm-layers-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
      </div>

      <div className="nm-aoi-body">
        <div className="nm-aoi-accordion" role="list">
          {options.map((option) => {
            const isOpen = openId === option.id;
            return (
              <div key={option.id} className={`nm-aoi-acc-item${isOpen ? " is-open" : ""}`} role="listitem">
                <button
                  type="button"
                  className={`nm-aoi-acc-trigger${isOpen ? " is-open" : ""}`}
                  aria-expanded={isOpen}
                  aria-controls={`nm-aoi-panel-${option.id}`}
                  id={`nm-aoi-trigger-${option.id}`}
                  onClick={() => toggleSection(option.id)}
                >
                  {option.label}
                </button>
                {isOpen && (
                  <div
                    className="nm-aoi-acc-panel"
                    id={`nm-aoi-panel-${option.id}`}
                    role="region"
                    aria-labelledby={`nm-aoi-trigger-${option.id}`}
                  >
                    <div className="nm-aoi-form-card">{renderForm(option.id)}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
