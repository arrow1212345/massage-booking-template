"use client";

import { useMemo, useState } from "react";
import { formatMoney } from "@/lib/format";

type LocationOption = {
  id: string;
  name: string;
  address: string;
  requiresCustomAddress: boolean;
  priceCents: number;
};

type ServiceOption = {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  basePriceCents: number;
};

type BookingWizardProps = {
  service: ServiceOption;
  locations: LocationOption[];
  action: (formData: FormData) => void;
  hasError: boolean;
};

const steps = ["服務", "地點", "時間", "資料", "確認"];

export function BookingWizard({ service, locations, action, hasError }: BookingWizardProps) {
  const [step, setStep] = useState(0);
  const [locationId, setLocationId] = useState(locations[0]?.id || "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [customAddress, setCustomAddress] = useState("");
  const [note, setNote] = useState("");

  const selectedLocation = useMemo(() => locations.find((location) => location.id === locationId) || locations[0], [locationId, locations]);
  const price = selectedLocation?.priceCents ?? service.basePriceCents;
  const needsAddress = Boolean(selectedLocation?.requiresCustomAddress);
  const canContinue = step === 0 || (step === 1 && locationId) || (step === 2 && date && time) || (step === 3 && clientName && clientEmail && clientPhone && (!needsAddress || customAddress));

  function next() {
    if (!canContinue) return;
    setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  function back() {
    setStep((current) => Math.max(current - 1, 0));
  }

  return (
    <form className="booking-shell" action={action}>
      <input type="hidden" name="serviceId" value={service.id} />
      <input type="hidden" name="locationId" value={locationId} />
      <input type="hidden" name="date" value={date} />
      <input type="hidden" name="time" value={time} />
      <input type="hidden" name="clientName" value={clientName} />
      <input type="hidden" name="clientEmail" value={clientEmail} />
      <input type="hidden" name="clientPhone" value={clientPhone} />
      <input type="hidden" name="customAddress" value={customAddress} />
      <input type="hidden" name="note" value={note} />

      <aside className="booking-summary card">
        <p className="eyebrow">Booking steps</p>
        <h2>{service.name}</h2>
        <p>{service.description}</p>
        <div className="service-meta">
          <span className="pill">{service.durationMinutes} 分鐘</span>
          <span className="pill">{formatMoney(price)} 起</span>
        </div>
        <div className="stepper" aria-label="預約進度">
          {steps.map((label, index) => (
            <button key={label} type="button" className={index === step ? "step-dot active" : index < step ? "step-dot done" : "step-dot"} onClick={() => setStep(index)}>
              <span>{index + 1}</span>{label}
            </button>
          ))}
        </div>
      </aside>

      <section className="booking-stage panel">
        {hasError ? <div className="notice">請確認表單內容。你選擇的時段可能已經無法預約。</div> : null}

        {step === 0 ? (
          <div className="wizard-page">
            <p className="eyebrow">Step 1</p>
            <h1>確認服務內容</h1>
            <p className="lead">先讓客人知道這次預約的是哪一項服務、需要多久、價格從哪裡開始。</p>
            <div className="booking-info-grid">
              <div><span>服務</span><strong>{service.name}</strong></div>
              <div><span>時間</span><strong>{service.durationMinutes} 分鐘</strong></div>
              <div><span>價格</span><strong>{formatMoney(price)} 起</strong></div>
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="wizard-page">
            <p className="eyebrow">Step 2</p>
            <h1>選擇服務地點</h1>
            <p className="lead">不同地點可以有不同價格。若是到府服務，可要求客人填寫地址。</p>
            <div className="location-options">
              {locations.map((location) => (
                <button key={location.id} type="button" className={location.id === locationId ? "option-card selected" : "option-card"} onClick={() => setLocationId(location.id)}>
                  <strong>{location.name}</strong>
                  <span>{location.address}</span>
                  <em>{formatMoney(location.priceCents)}</em>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="wizard-page">
            <p className="eyebrow">Step 3</p>
            <h1>選擇日期與時間</h1>
            <p className="lead">示範模板先提供基本日期與時間欄位；正式版可接後台可預約時段與 Google Calendar 阻擋。</p>
            <div className="grid two">
              <label>日期<input type="date" value={date} onChange={(event) => setDate(event.target.value)} required /></label>
              <label>時間<input type="time" value={time} onChange={(event) => setTime(event.target.value)} required /></label>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="wizard-page">
            <p className="eyebrow">Step 4</p>
            <h1>填寫聯絡資料</h1>
            <p className="lead">把資料填寫獨立成一步，畫面比較不會壓迫，也比較接近正式預約流程。</p>
            <div className="form">
              <label>姓名<input value={clientName} onChange={(event) => setClientName(event.target.value)} required /></label>
              <div className="grid two">
                <label>Email<input type="email" value={clientEmail} onChange={(event) => setClientEmail(event.target.value)} required /></label>
                <label>電話<input value={clientPhone} onChange={(event) => setClientPhone(event.target.value)} required /></label>
              </div>
              {needsAddress ? <label>到府地址<input value={customAddress} onChange={(event) => setCustomAddress(event.target.value)} required /></label> : null}
              <label>備註<textarea rows={4} value={note} onChange={(event) => setNote(event.target.value)} /></label>
            </div>
          </div>
        ) : null}

        {step === 4 ? (
          <div className="wizard-page">
            <p className="eyebrow">Step 5</p>
            <h1>確認預約申請</h1>
            <p className="lead">送出後會建立待確認預約。正式服務可在後台確認、取消或同步日曆。</p>
            <div className="confirm-list">
              <div><span>服務</span><strong>{service.name}</strong></div>
              <div><span>地點</span><strong>{selectedLocation?.name || "尚未選擇"}</strong></div>
              <div><span>時間</span><strong>{date || "未選日期"} {time || "未選時間"}</strong></div>
              <div><span>客戶</span><strong>{clientName || "未填姓名"}</strong></div>
              <div><span>聯絡</span><strong>{clientPhone || "未填電話"}</strong></div>
              <div><span>金額</span><strong>{formatMoney(price)}</strong></div>
            </div>
          </div>
        ) : null}

        <div className="wizard-actions">
          <button type="button" className="button secondary" onClick={back} disabled={step === 0}>上一步</button>
          {step < steps.length - 1 ? <button type="button" onClick={next} disabled={!canContinue}>下一步</button> : <button type="submit">送出預約申請</button>}
        </div>
      </section>
    </form>
  );
}
