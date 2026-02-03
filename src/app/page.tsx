"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { TabButton } from "@/components/TabButton";
import { Field } from "@/components/Field";
import { exportNodeToPdf } from "@/lib/pdf";
import { kompetansemaal, kjerneelementer, udirLinks, note } from "@/lib/curriculum";
import { load, save } from "@/lib/storage";
import { QuestionWithAI } from "@/components/QuestionWithAI";

type Tab = "fagprove" | "kompetanse" | "info";
type KundeType = "cafe" | "hotell" | "museum" | "skole" | "gym" | "dyreklinikk";

type Shared = { kandidatNavn: string; dato: string };

type FagproveAnswers = {
  kundeType: KundeType;
  kundenavn: string;

  bakgrunn: string;
  mal: string;
  malgruppe: string;
  innsikt: string;

  budskap: string;
  tone: string;
  ideutvikling: string;
  pitch: string;

  kanalvalg: string;
  leveranseHoved: string;
  leveransePlattform1: string;
  leveransePlattform2: string;

  produksjonsplan: string;
  budsjett: string;
  opptak: string;
  utstyr: string;

  lysKomposisjon: string;
  etterarbeidEksport: string;

  algoritmer: string;
  publiseringsstrategi: string;

  etikkLov: string;
  universell: string;

  teamRolle: string;
  evaluering: string;
  samfunn: string;
  yrkesfellesskap: string;

  dokumentasjon: string;

  // AI-bruk per del
  ai_bakgrunn: string;
  ai_mal: string;
  ai_malgruppe: string;
  ai_innsikt: string;

  ai_budskap: string;
  ai_tone: string;
  ai_ideutvikling: string;
  ai_pitch: string;

  ai_kanalvalg: string;
  ai_leveranseHoved: string;
  ai_leveransePlattform1: string;
  ai_leveransePlattform2: string;

  ai_produksjonsplan: string;
  ai_budsjett: string;
  ai_opptak: string;
  ai_utstyr: string;

  ai_lysKomposisjon: string;
  ai_etterarbeidEksport: string;

  ai_algoritmer: string;
  ai_publiseringsstrategi: string;

  ai_etikkLov: string;
  ai_universell: string;

  ai_teamRolle: string;
  ai_evaluering: string;
  ai_samfunn: string;
  ai_yrkesfellesskap: string;

  ai_dokumentasjon: string;
};

type KompetanseAnswers = {
  kundeType: KundeType;
  kundenavn: string;

  design: string;
  teknologi: string;
  fortelling: string;

  formatvalg: string;
  lysvalg: string;
  enkelPlan: string;
  enkelPublisering: string;
  enkelEtikk: string;

  // AI-bruk per del
  ai_design: string;
  ai_teknologi: string;
  ai_fortelling: string;

  ai_formatvalg: string;
  ai_lysvalg: string;
  ai_enkelPlan: string;
  ai_enkelPublisering: string;
  ai_enkelEtikk: string;
};

const KEY_SHARED = "ihp03_trim_shared_v2";
const KEY_FAG = "ihp03_trim_fag_v2";
const KEY_KOMP = "ihp03_trim_komp_v2";

function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

const defaultCustomerName: Record<KundeType, string> = {
  cafe: "Lys & Brød",
  hotell: "Hotel Nordlys",
  museum: "Nordlys Museum",
  skole: "Bjørnholt videregående skole",
  gym: "Nordlys Treningssenter",
  dyreklinikk: "Oslo Dyreklinikk",
};

function kundeLabel(t: KundeType) {
  if (t === "cafe") return "Café";
  if (t === "hotell") return "Hotell";
  if (t === "museum") return "Museum";
  if (t === "skole") return "Skole";
  if (t === "gym") return "Treningssenter";
  return "Dyreklinikk";
}

function shouldAutoUpdateCustomerName(currentName: string) {
  const trimmed = (currentName || "").trim();
  if (!trimmed) return true;
  const defaults = Object.values(defaultCustomerName);
  return defaults.includes(trimmed);
}

export default function Page() {
  const [tab, setTab] = useState<Tab>("fagprove");

  const [shared, setShared] = useState<Shared>({
    kandidatNavn: "",
    dato: todayISO(),
  });

  const [fag, setFag] = useState<FagproveAnswers>({
    kundeType: "cafe",
    kundenavn: defaultCustomerName.cafe,

    bakgrunn: "",
    mal: "",
    malgruppe: "",
    innsikt: "",

    budskap: "",
    tone: "",
    ideutvikling: "",
    pitch: "",

    kanalvalg: "",
    leveranseHoved: "",
    leveransePlattform1: "",
    leveransePlattform2: "",

    produksjonsplan: "",
    budsjett: "",
    opptak: "",
    utstyr: "",

    lysKomposisjon: "",
    etterarbeidEksport: "",

    algoritmer: "",
    publiseringsstrategi: "",

    etikkLov: "",
    universell: "",

    teamRolle: "",
    evaluering: "",
    samfunn: "",
    yrkesfellesskap: "",

    dokumentasjon: "",

    ai_bakgrunn: "",
    ai_mal: "",
    ai_malgruppe: "",
    ai_innsikt: "",

    ai_budskap: "",
    ai_tone: "",
    ai_ideutvikling: "",
    ai_pitch: "",

    ai_kanalvalg: "",
    ai_leveranseHoved: "",
    ai_leveransePlattform1: "",
    ai_leveransePlattform2: "",

    ai_produksjonsplan: "",
    ai_budsjett: "",
    ai_opptak: "",
    ai_utstyr: "",

    ai_lysKomposisjon: "",
    ai_etterarbeidEksport: "",

    ai_algoritmer: "",
    ai_publiseringsstrategi: "",

    ai_etikkLov: "",
    ai_universell: "",

    ai_teamRolle: "",
    ai_evaluering: "",
    ai_samfunn: "",
    ai_yrkesfellesskap: "",

    ai_dokumentasjon: "",
  });

  const [komp, setKomp] = useState<KompetanseAnswers>({
    kundeType: "cafe",
    kundenavn: defaultCustomerName.cafe,

    design: "",
    teknologi: "",
    fortelling: "",

    formatvalg: "",
    lysvalg: "",
    enkelPlan: "",
    enkelPublisering: "",
    enkelEtikk: "",

    ai_design: "",
    ai_teknologi: "",
    ai_fortelling: "",

    ai_formatvalg: "",
    ai_lysvalg: "",
    ai_enkelPlan: "",
    ai_enkelPublisering: "",
    ai_enkelEtikk: "",
  });

  useEffect(() => {
    setShared(load(KEY_SHARED, { kandidatNavn: "", dato: todayISO() }));
    setFag(load(KEY_FAG, fag));
    setKomp(load(KEY_KOMP, komp));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => save(KEY_SHARED, shared), [shared]);
  useEffect(() => save(KEY_FAG, fag), [fag]);
  useEffect(() => save(KEY_KOMP, komp), [komp]);

  // KundeType → oppdater kun kundenavn (hvis ikke manuelt endret)
  useEffect(() => {
    setFag((prev) => {
      const nextName = defaultCustomerName[prev.kundeType];
      return shouldAutoUpdateCustomerName(prev.kundenavn) ? { ...prev, kundenavn: nextName } : prev;
    });
  }, [fag.kundeType]);

  useEffect(() => {
    setKomp((prev) => {
      const nextName = defaultCustomerName[prev.kundeType];
      return shouldAutoUpdateCustomerName(prev.kundenavn) ? { ...prev, kundenavn: nextName } : prev;
    });
  }, [komp.kundeType]);

  const activeTitle = useMemo(() => {
    if (tab === "fagprove") return "Fagprøve (kreativ brief – full)";
    if (tab === "kompetanse") return "Kompetansebevis (kjerneelement)";
    return "Informasjon (kompetansemål, kjerneelementer, vurdering)";
  }, [tab]);

  const printRef = useRef<HTMLDivElement | null>(null);
  const [pdfBusy, setPdfBusy] = useState(false);

  async function downloadPdf() {
    if (!printRef.current) return;
    setPdfBusy(true);
    try {
      const safeName =
        (shared.kandidatNavn || "kandidat")
          .toLowerCase()
          .replace(/[^a-z0-9\-]+/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "") || "kandidat";
      const filename = `ihp03-${tab}-${safeName}.pdf`;
      await exportNodeToPdf({ node: printRef.current, filename, scale: 2 });
    } finally {
      setPdfBusy(false);
    }
  }

  function resetFagprove() {
    if (!confirm("Vil du nullstille alle svar i fagprøven?")) return;

    setFag({
      ...fag,
      kundeType: "cafe",
      kundenavn: defaultCustomerName.cafe,

      bakgrunn: "",
      mal: "",
      malgruppe: "",
      innsikt: "",

      budskap: "",
      tone: "",
      ideutvikling: "",
      pitch: "",

      kanalvalg: "",
      leveranseHoved: "",
      leveransePlattform1: "",
      leveransePlattform2: "",

      produksjonsplan: "",
      budsjett: "",
      opptak: "",
      utstyr: "",

      lysKomposisjon: "",
      etterarbeidEksport: "",

      algoritmer: "",
      publiseringsstrategi: "",

      etikkLov: "",
      universell: "",

      teamRolle: "",
      evaluering: "",
      samfunn: "",
      yrkesfellesskap: "",

      dokumentasjon: "",

      ai_bakgrunn: "",
      ai_mal: "",
      ai_malgruppe: "",
      ai_innsikt: "",

      ai_budskap: "",
      ai_tone: "",
      ai_ideutvikling: "",
      ai_pitch: "",

      ai_kanalvalg: "",
      ai_leveranseHoved: "",
      ai_leveransePlattform1: "",
      ai_leveransePlattform2: "",

      ai_produksjonsplan: "",
      ai_budsjett: "",
      ai_opptak: "",
      ai_utstyr: "",

      ai_lysKomposisjon: "",
      ai_etterarbeidEksport: "",

      ai_algoritmer: "",
      ai_publiseringsstrategi: "",

      ai_etikkLov: "",
      ai_universell: "",

      ai_teamRolle: "",
      ai_evaluering: "",
      ai_samfunn: "",
      ai_yrkesfellesskap: "",

      ai_dokumentasjon: "",
    });
  }

  function resetKompetanse() {
    if (!confirm("Vil du nullstille alle svar i kompetansebeviset?")) return;

    setKomp({
      ...komp,
      kundeType: "cafe",
      kundenavn: defaultCustomerName.cafe,

      design: "",
      teknologi: "",
      fortelling: "",

      formatvalg: "",
      lysvalg: "",
      enkelPlan: "",
      enkelPublisering: "",
      enkelEtikk: "",

      ai_design: "",
      ai_teknologi: "",
      ai_fortelling: "",

      ai_formatvalg: "",
      ai_lysvalg: "",
      ai_enkelPlan: "",
      ai_enkelPublisering: "",
      ai_enkelEtikk: "",
    });
  }

  const activeKundeType = tab === "kompetanse" ? komp.kundeType : fag.kundeType;

  return (
    <>
      <div className="header">
        <div className="hgroup">
          <h1>Prøve i innholdsproduksjon (IHP03-01)</h1>
          <p>
            Fagprøve eller kompetansebevis – kreativ brief for kommersiell kunde i sosiale medier. Du
            arbeider i reklamebyrået <b>Trim AS</b> og skal planlegge, beskrive og dokumentere en
            innholdsproduksjon for en kunde (café, hotell, museum, skole, treningssenter eller
            dyreklinikk).
          </p>
        </div>
        <span className="badge">v0.2 • bokmål</span>
      </div>

      <div className="card">
        <div className="toolbar">
          <div className="tabs">
            <TabButton active={tab === "fagprove"} onClick={() => setTab("fagprove")}>
              Fagprøve
            </TabButton>
            <TabButton active={tab === "kompetanse"} onClick={() => setTab("kompetanse")}>
              Kompetansebevis
            </TabButton>
            <TabButton active={tab === "info"} onClick={() => setTab("info")}>
              Informasjon
            </TabButton>
          </div>

          <div style={{ flex: 1 }} />

          <button className="btn primary" onClick={downloadPdf} disabled={pdfBusy}>
            {pdfBusy ? "Lager PDF…" : "Last ned PDF (aktiv fane)"}
          </button>

          {tab === "fagprove" && (
            <button className="btn" onClick={resetFagprove}>
              Nullstill fagprøve
            </button>
          )}

          {tab === "kompetanse" && (
            <button className="btn" onClick={resetKompetanse}>
              Nullstill kompetansebevis
            </button>
          )}
        </div>

        <div className="content">
          <div className="grid two">
            <div className="section">
              <h3>Kandidat</h3>
              <div className="kv two">
                <Field label="Navn (må stå øverst)">
                  <input
                    className="input"
                    value={shared.kandidatNavn}
                    onChange={(e) => setShared({ ...shared, kandidatNavn: e.target.value })}
                    placeholder="Skriv fullt navn"
                  />
                </Field>
                <Field label="Dato">
                  <input
                    className="input"
                    type="date"
                    value={shared.dato}
                    onChange={(e) => setShared({ ...shared, dato: e.target.value })}
                  />
                </Field>
              </div>
              <div className="small">Alt lagres automatisk i nettleseren (localStorage).</div>
            </div>

            <div className="section">
              <h3>Oppdrag</h3>
              <p>
                Du jobber i reklamebyrået <b>Trim AS</b>. Kunden er en <b>{kundeLabel(activeKundeType)}</b>
                -aktør som trenger bedre synlighet i sosiale medier. Du skal levere <b>1 hovedproduksjon</b>,{" "}
                <b>2 plattformversjoner</b>, <b>publiseringsstrategi</b> og <b>dokumentasjon</b>.
              </p>
              <p className="small">{note}</p>
            </div>
          </div>

          <hr className="sep" />

          {tab === "fagprove" ? (
            <FagproveTab fag={fag} setFag={setFag} />
          ) : tab === "kompetanse" ? (
            <KompetanseTab komp={komp} setKomp={setKomp} />
          ) : (
            <InfoTab />
          )}
        </div>
      </div>

      <div style={{ position: "fixed", left: -9999, top: 0 }}>
        <div ref={printRef} className="printWrap">
          <h1>{activeTitle}</h1>
          <p className="meta">
            Kandidat: <b>{shared.kandidatNavn || "—"}</b> • Dato: <b>{shared.dato || "—"}</b> • Byrå:{" "}
            <b>Trim AS</b> • Kunde: <b>{kundeLabel(activeKundeType)}</b>
          </p>

          {tab === "fagprove" ? (
            <FagprovePrint fag={fag} />
          ) : tab === "kompetanse" ? (
            <KompetansePrint komp={komp} />
          ) : (
            <InfoPrint />
          )}

          <hr className="sep" />
          <p className="small">
            Lenker: {udirLinks.kompetansemaal} • {udirLinks.kjerneelementer}
          </p>
        </div>
      </div>
    </>
  );
}

function KundeSelect({
  value,
  onChange,
}: {
  value: KundeType;
  onChange: (v: KundeType) => void;
}) {
  return (
    <select className="select" value={value} onChange={(e) => onChange(e.target.value as KundeType)}>
      <option value="cafe">Café</option>
      <option value="hotell">Hotell</option>
      <option value="museum">Museum</option>
      <option value="skole">Skole</option>
      <option value="gym">Treningssenter</option>
      <option value="dyreklinikk">Dyreklinikk</option>
    </select>
  );
}

function FagproveTab({ fag, setFag }: { fag: FagproveAnswers; setFag: (v: FagproveAnswers) => void }) {
  return (
    <div className="grid">
      <div className="section">
        <h3>1. Kunde og rammer</h3>
        <div className="kv two">
          <Field label="Kundetype">
            <KundeSelect value={fag.kundeType} onChange={(v) => setFag({ ...fag, kundeType: v })} />
          </Field>
          <Field label="Kundenavn (kan redigeres)">
            <input
              className="input"
              value={fag.kundenavn}
              onChange={(e) => setFag({ ...fag, kundenavn: e.target.value })}
              placeholder="Skriv kundenavn"
            />
          </Field>
        </div>
      </div>

      <div className="section">
        <h3>2. Kreativ brief (låste spørsmål)</h3>

        <QuestionWithAI
          title="Bakgrunn / problem"
          text="Beskriv situasjonen: hva er problemet eller behovet kunden har i sosiale medier? Svar konkret."
          answer={fag.bakgrunn}
          setAnswer={(v) => setFag({ ...fag, bakgrunn: v })}
          ai={fag.ai_bakgrunn}
          setAi={(v) => setFag({ ...fag, ai_bakgrunn: v })}
        />

        <QuestionWithAI
          title="Mål og ønsket effekt"
          text="Hva skal kampanjen oppnå (målbare mål/KPI-er der det passer)?"
          answer={fag.mal}
          setAnswer={(v) => setFag({ ...fag, mal: v })}
          ai={fag.ai_mal}
          setAi={(v) => setFag({ ...fag, ai_mal: v })}
        />

        <QuestionWithAI
          title="Målgruppe"
          text="Hvem er målgruppen(e), og hva kjennetegner dem (atferd, behov, barrierer)?"
          answer={fag.malgruppe}
          setAnswer={(v) => setFag({ ...fag, malgruppe: v })}
          ai={fag.ai_malgruppe}
          setAi={(v) => setFag({ ...fag, ai_malgruppe: v })}
        />

        <QuestionWithAI
          title="Brukerinnsikt"
          text="Hvilke metoder vil du bruke for å skaffe brukerinnsikt, og hvordan vil innsikten styre valgene dine?"
          answer={fag.innsikt}
          setAnswer={(v) => setFag({ ...fag, innsikt: v })}
          ai={fag.ai_innsikt}
          setAi={(v) => setFag({ ...fag, ai_innsikt: v })}
        />

        <QuestionWithAI
          title="Budskap"
          text="Formuler hovedbudskapet i 1–2 setninger. Hva skal publikum sitte igjen med?"
          answer={fag.budskap}
          setAnswer={(v) => setFag({ ...fag, budskap: v })}
          ai={fag.ai_budskap}
          setAi={(v) => setFag({ ...fag, ai_budskap: v })}
        />

        <QuestionWithAI
          title="Tone / profil"
          text="Beskriv tone of voice og visuell retning (lys, seriøs, corporate)."
          answer={fag.tone}
          setAnswer={(v) => setFag({ ...fag, tone: v })}
          ai={fag.ai_tone}
          setAi={(v) => setFag({ ...fag, ai_tone: v })}
        />

        <QuestionWithAI
          title="Idéutvikling"
          text="Beskriv hvilke metoder du bruker for idéutvikling (f.eks. moodboard, skisser, prototyper, testing)."
          answer={fag.ideutvikling}
          setAnswer={(v) => setFag({ ...fag, ideutvikling: v })}
          ai={fag.ai_ideutvikling}
          setAi={(v) => setFag({ ...fag, ai_ideutvikling: v })}
        />

        <QuestionWithAI
          title="Pitch"
          text="Skriv en pitch (maks 10 setninger): konsept, format, hvorfor det passer målgruppen, forventet effekt."
          answer={fag.pitch}
          setAnswer={(v) => setFag({ ...fag, pitch: v })}
          ai={fag.ai_pitch}
          setAi={(v) => setFag({ ...fag, ai_pitch: v })}
        />

        <hr className="sep" />

        <QuestionWithAI
          title="Kanalvalg"
          text="Hvilke plattformer velger du og hvorfor? (Instagram/TikTok/YouTube Shorts/LinkedIn m.fl.)"
          answer={fag.kanalvalg}
          setAnswer={(v) => setFag({ ...fag, kanalvalg: v })}
          ai={fag.ai_kanalvalg}
          setAi={(v) => setFag({ ...fag, ai_kanalvalg: v })}
        />

        <QuestionWithAI
          title="Leveranse 1: Hovedproduksjon"
          text="Beskriv hovedproduksjonen (60–90 sek): innhold, dramaturgi, CTA og hvordan den løser målet."
          answer={fag.leveranseHoved}
          setAnswer={(v) => setFag({ ...fag, leveranseHoved: v })}
          ai={fag.ai_leveranseHoved}
          setAi={(v) => setFag({ ...fag, ai_leveranseHoved: v })}
        />

        <QuestionWithAI
          title="Leveranse 2: Plattformversjon 1"
          text="Beskriv en 9:16 versjon (15–30 sek) for Reels/Shorts/TikTok: hook, teksting, tempo."
          answer={fag.leveransePlattform1}
          setAnswer={(v) => setFag({ ...fag, leveransePlattform1: v })}
          ai={fag.ai_leveransePlattform1}
          setAi={(v) => setFag({ ...fag, ai_leveransePlattform1: v })}
        />

        <QuestionWithAI
          title="Leveranse 3: Plattformversjon 2"
          text="Beskriv en ekstra kort variant (6–12 sek) eller 1:1/9:16: hva er budskapet i første sekund?"
          answer={fag.leveransePlattform2}
          setAnswer={(v) => setFag({ ...fag, leveransePlattform2: v })}
          ai={fag.ai_leveransePlattform2}
          setAi={(v) => setFag({ ...fag, ai_leveransePlattform2: v })}
        />

        <hr className="sep" />

        <QuestionWithAI
          title="Produksjonsplan"
          text="Lag en gjennomførbar plan (preprod → opptak → post → publisering) med roller og sjekklister."
          answer={fag.produksjonsplan}
          setAnswer={(v) => setFag({ ...fag, produksjonsplan: v })}
          ai={fag.ai_produksjonsplan}
          setAi={(v) => setFag({ ...fag, ai_produksjonsplan: v })}
        />

        <QuestionWithAI
          title="Budsjett / ressursbehov"
          text="Kartlegg ressursbehov og lag et realistisk mini-budsjett (tid, utstyr, musikk/stock, reise)."
          answer={fag.budsjett}
          setAnswer={(v) => setFag({ ...fag, budsjett: v })}
          ai={fag.ai_budsjett}
          setAi={(v) => setFag({ ...fag, ai_budsjett: v })}
        />

        <QuestionWithAI
          title="Opptak"
          text="Hvordan gjennomfører du opptak (foto/film/lyd) tilpasset rammer? (B-roll, intervju, lyd, sikkerhet)"
          answer={fag.opptak}
          setAnswer={(v) => setFag({ ...fag, opptak: v })}
          ai={fag.ai_opptak}
          setAi={(v) => setFag({ ...fag, ai_opptak: v })}
        />

        <QuestionWithAI
          title="Utstyr og programvare"
          text="Hvilket utstyr og hvilken programvare velger du, og hvorfor? (kamera/lys/lyd/redigering)"
          answer={fag.utstyr}
          setAnswer={(v) => setFag({ ...fag, utstyr: v })}
          ai={fag.ai_utstyr}
          setAi={(v) => setFag({ ...fag, ai_utstyr: v })}
        />

        <hr className="sep" />

        <QuestionWithAI
          title="Lys, komposisjon og visuelle virkemidler"
          text="Forklar lysoppsett, komposisjon og visuell stil. Hvordan støtter det budskap og merkevare?"
          answer={fag.lysKomposisjon}
          setAnswer={(v) => setFag({ ...fag, lysKomposisjon: v })}
          ai={fag.ai_lysKomposisjon}
          setAi={(v) => setFag({ ...fag, ai_lysKomposisjon: v })}
        />

        <QuestionWithAI
          title="Etterarbeid og eksport"
          text="Beskriv etterarbeid (klipp, lyd, grafikk/teksting, farge). Hvilke formater/filtyper leverer du?"
          answer={fag.etterarbeidEksport}
          setAnswer={(v) => setFag({ ...fag, etterarbeidEksport: v })}
          ai={fag.ai_etterarbeidEksport}
          setAi={(v) => setFag({ ...fag, ai_etterarbeidEksport: v })}
        />

        <hr className="sep" />

        <QuestionWithAI
          title="Algoritmer og personalisering"
          text="Hvordan påvirker algoritmer distribusjon – og hvilke grep tar du (hook, retention, metadata, test)?"
          answer={fag.algoritmer}
          setAnswer={(v) => setFag({ ...fag, algoritmer: v })}
          ai={fag.ai_algoritmer}
          setAi={(v) => setFag({ ...fag, ai_algoritmer: v })}
        />

        <QuestionWithAI
          title="Publiseringsstrategi"
          text="Planlegg publisering: tidspunkt, frekvens, A/B-testing, community, KPI-er og oppfølging."
          answer={fag.publiseringsstrategi}
          setAnswer={(v) => setFag({ ...fag, publiseringsstrategi: v })}
          ai={fag.ai_publiseringsstrategi}
          setAi={(v) => setFag({ ...fag, ai_publiseringsstrategi: v })}
        />

        <hr className="sep" />

        <QuestionWithAI
          title="Etikk, lovverk og opphavsrett"
          text="Hvordan sikrer du samtykke/personvern, opphavsrett, reklame-merking, og oppbevaring/arkiv?"
          answer={fag.etikkLov}
          setAnswer={(v) => setFag({ ...fag, etikkLov: v })}
          ai={fag.ai_etikkLov}
          setAi={(v) => setFag({ ...fag, ai_etikkLov: v })}
        />

        <QuestionWithAI
          title="Universell utforming"
          text="Hvordan sikrer du universell utforming i ferdig produkt (teksting, kontrast, lesbarhet, tempo)?"
          answer={fag.universell}
          setAnswer={(v) => setFag({ ...fag, universell: v })}
          ai={fag.ai_universell}
          setAi={(v) => setFag({ ...fag, ai_universell: v })}
        />

        <hr className="sep" />

        <QuestionWithAI
          title="Rolle i team / virksomhet"
          text="Beskriv din rolle, samarbeid og kvalitetssikring i Trim AS (kommunikasjon, ansvar, endringer)."
          answer={fag.teamRolle}
          setAnswer={(v) => setFag({ ...fag, teamRolle: v })}
          ai={fag.ai_teamRolle}
          setAi={(v) => setFag({ ...fag, ai_teamRolle: v })}
        />

        <QuestionWithAI
          title="Evaluering"
          text="Hvordan evaluerer du resultat og læring? Hvilke data bruker du, og hva forbedrer du i runde 2?"
          answer={fag.evaluering}
          setAnswer={(v) => setFag({ ...fag, evaluering: v })}
          ai={fag.ai_evaluering}
          setAi={(v) => setFag({ ...fag, ai_evaluering: v })}
        />

        <QuestionWithAI
          title="Samfunnsdebatt og demokrati"
          text="Reflekter kort: Hvordan kan innholdsproduksjoner påvirke samfunnsdebatt og demokrati?"
          answer={fag.samfunn}
          setAnswer={(v) => setFag({ ...fag, samfunn: v })}
          ai={fag.ai_samfunn}
          setAi={(v) => setFag({ ...fag, ai_samfunn: v })}
        />

        <QuestionWithAI
          title="Likeverdig og inkluderende yrkesfellesskap"
          text="Gjør rede for krav/forventninger, og reflekter over plikter og rettigheter i lærebedrift."
          answer={fag.yrkesfellesskap}
          setAnswer={(v) => setFag({ ...fag, yrkesfellesskap: v })}
          ai={fag.ai_yrkesfellesskap}
          setAi={(v) => setFag({ ...fag, ai_yrkesfellesskap: v })}
        />

        <QuestionWithAI
          title="Dokumentasjon"
          text="Hvordan dokumenterer du prosess, filstruktur, kilder, versjoner og endelig leveranse til kunden?"
          answer={fag.dokumentasjon}
          setAnswer={(v) => setFag({ ...fag, dokumentasjon: v })}
          ai={fag.ai_dokumentasjon}
          setAi={(v) => setFag({ ...fag, ai_dokumentasjon: v })}
        />
      </div>

      <div className="section">
        <h3>Sjekkliste mot kompetansemål (bokmål-oversatt)</h3>
        <p>Bruk dette som kontroll før du leverer.</p>
        <ol>
          {kompetansemaal.map((m, i) => (
            <li key={i} style={{ margin: "6px 0", color: "var(--muted)" }}>
              {m}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function KompetanseTab({ komp, setKomp }: { komp: KompetanseAnswers; setKomp: (v: KompetanseAnswers) => void }) {
  return (
    <div className="grid">
      <div className="section">
        <h3>1. Kunde</h3>
        <div className="kv two">
          <Field label="Kundetype">
            <KundeSelect value={komp.kundeType} onChange={(v) => setKomp({ ...komp, kundeType: v })} />
          </Field>
          <Field label="Kundenavn (kan redigeres)">
            <input
              className="input"
              value={komp.kundenavn}
              onChange={(e) => setKomp({ ...komp, kundenavn: e.target.value })}
              placeholder="Skriv kundenavn"
            />
          </Field>
        </div>
      </div>

      <div className="section">
        <h3>2. Kjerneelement (låste spørsmål)</h3>

        <QuestionWithAI
          title="Design og kreativitet"
          text="Forklar kort hvordan du jobber fra idé til ferdig produkt (designvalg, komposisjon og brukeropplevelse)."
          answer={komp.design}
          setAnswer={(v) => setKomp({ ...komp, design: v })}
          ai={komp.ai_design}
          setAi={(v) => setKomp({ ...komp, ai_design: v })}
        />

        <QuestionWithAI
          title="Teknologi og produksjon"
          text="Forklar kort hvilke verktøy/utstyr du velger, og hvorfor (opptak, redigering, eksport/publisering)."
          answer={komp.teknologi}
          setAnswer={(v) => setKomp({ ...komp, teknologi: v })}
          ai={komp.ai_teknologi}
          setAi={(v) => setKomp({ ...komp, ai_teknologi: v })}
        />

        <QuestionWithAI
          title="Kommunikasjon og historiefortelling"
          text="Forklar kort hvordan du bygger budskap og historie tilpasset kanal, sjanger og målgruppe."
          answer={komp.fortelling}
          setAnswer={(v) => setKomp({ ...komp, fortelling: v })}
          ai={komp.ai_fortelling}
          setAi={(v) => setKomp({ ...komp, ai_fortelling: v })}
        />
      </div>

      <div className="section">
        <h3>3. Smarte valg</h3>

        <QuestionWithAI
          title="Formatvalg"
          text="Velg ett format (begrunn): (A) 60–90 sek film (B) 20 sek Reels (C) 8 sek bumper."
          answer={komp.formatvalg}
          setAnswer={(v) => setKomp({ ...komp, formatvalg: v })}
          ai={komp.ai_formatvalg}
          setAi={(v) => setKomp({ ...komp, ai_formatvalg: v })}
        />

        <QuestionWithAI
          title="Lysvalg"
          text="Velg lysløsning (begrunn): (A) naturlys + reflektor (B) 1 LED key + fill (C) 3-punkt."
          answer={komp.lysvalg}
          setAnswer={(v) => setKomp({ ...komp, lysvalg: v })}
          ai={komp.ai_lysvalg}
          setAi={(v) => setKomp({ ...komp, ai_lysvalg: v })}
        />

        <QuestionWithAI
          title="Enkel plan"
          text="Skriv en enkel plan i punktform fra idé → opptak → post → publisering."
          answer={komp.enkelPlan}
          setAnswer={(v) => setKomp({ ...komp, enkelPlan: v })}
          ai={komp.ai_enkelPlan}
          setAi={(v) => setKomp({ ...komp, ai_enkelPlan: v })}
        />
      </div>

      <div className="section">
        <h3>4. Publisering og etikk</h3>

        <QuestionWithAI
          title="Publisering/KPI/algoritme"
          text="Nevn 3 KPI-er du vil måle, og hvordan du tilpasser innhold til algoritmene."
          answer={komp.enkelPublisering}
          setAnswer={(v) => setKomp({ ...komp, enkelPublisering: v })}
          ai={komp.ai_enkelPublisering}
          setAi={(v) => setKomp({ ...komp, ai_enkelPublisering: v })}
        />

        <QuestionWithAI
          title="Etikk/lov/opphavsrett/personvern"
          text="Nevn 3 konkrete tiltak du gjør for å sikre etikk og regelverk."
          answer={komp.enkelEtikk}
          setAnswer={(v) => setKomp({ ...komp, enkelEtikk: v })}
          ai={komp.ai_enkelEtikk}
          setAi={(v) => setKomp({ ...komp, ai_enkelEtikk: v })}
        />
      </div>

      <div className="section">
        <h3>Kjerneelement (referanse)</h3>
        {Object.entries(kjerneelementer).map(([t, d]) => (
          <div key={t} style={{ marginBottom: 10 }}>
            <div style={{ fontWeight: 600, fontSize: 13 }}>{t}</div>
            <div className="small">{d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InfoTab() {
  return (
    <div className="grid">
      <div className="section">
        <h3>Kjerneelementer (bokmål-oversatt)</h3>
        <ol>
          {Object.entries(kjerneelementer).map(([t, d]) => (
            <li key={t} style={{ margin: "10px 0" }}>
              <b>{t}:</b> <span className="small">{d}</span>
            </li>
          ))}
        </ol>
        <div className="small" style={{ marginTop: 10 }}>
          Lenke:{" "}
          <a href={udirLinks.kjerneelementer} target="_blank">
            UDIR – kjerneelementer
          </a>
        </div>
      </div>

      <div className="section">
        <h3>Kompetansemål (bokmål-oversatt)</h3>
        <ol>
          {kompetansemaal.map((m, i) => (
            <li key={i} style={{ margin: "8px 0" }}>
              {m}
            </li>
          ))}
        </ol>
        <div className="small" style={{ marginTop: 10 }}>
          Lenke:{" "}
          <a href={udirLinks.kompetansemaal} target="_blank">
            UDIR – kompetansemål
          </a>
        </div>
      </div>

      <div className="section">
        <h3>Vurderingskriterier (praktisk rubrikk)</h3>
        <p>Denne rubrikken er laget for prøven og kan justeres lokalt i VS Code.</p>
        <ol>
          <li>
            <b>Oppdragsforståelse:</b> Behov, mål og budskap er tydelig og relevant.
          </li>
          <li>
            <b>Brukerinnsikt:</b> Metode er egnet, og innsikt omsettes til konkrete grep.
          </li>
          <li>
            <b>Kreativt konsept:</b> Idé, sjanger/format og pitch henger sammen og er målrettet.
          </li>
          <li>
            <b>Plan og gjennomføring:</b> Produksjonsplan og ressursbruk er realistisk.
          </li>
          <li>
            <b>Teknisk kvalitet:</b> Lyd/bilde/lys/komposisjon og etterarbeid er kontrollert.
          </li>
          <li>
            <b>Publisering:</b> Strategi, KPI-er og forståelse av algoritmer er tydelig.
          </li>
          <li>
            <b>Etikk og lov:</b> Opphavsrett, samtykke/personvern, merking og oppbevaring ivaretas.
          </li>
          <li>
            <b>Universell utforming:</b> Teksting, lesbarhet og tilgjengelighet er ivaretatt.
          </li>
          <li>
            <b>Samarbeid/rolle:</b> Profesjonell kommunikasjon og ansvar i team.
          </li>
          <li>
            <b>Dokumentasjon og refleksjon:</b> Sporbar prosess og relevant evaluering.
          </li>
        </ol>
      </div>

      <div className="section">
        <h3>Merknad</h3>
        <p className="small">{note}</p>
      </div>
    </div>
  );
}

/** PRINT */

function Box({ q, a }: { q: string; a: string }) {
  return (
    <div className="box">
      <div className="q">{q}</div>
      <div className="answer">{(a || "").trim() || "—"}</div>
    </div>
  );
}

function BoxWithAI({ q, a, ai }: { q: string; a: string; ai: string }) {
  return (
    <div className="box">
      <div className="q">{q}</div>
      <div className="answer">{(a || "").trim() || "—"}</div>
      <div style={{ marginTop: 8 }}>
        <div className="q">AI brukt</div>
        <div className="answer">{(ai || "").trim() || "—"}</div>
      </div>
    </div>
  );
}

function FagprovePrint({ fag }: { fag: FagproveAnswers }) {
  return (
    <>
      <p className="meta">
        Kunde: <b>{fag.kundenavn || "—"}</b> ({kundeLabel(fag.kundeType)}) • Profil:{" "}
        <b>lys/seriøs corporate</b>
      </p>

      <h2>Fagprøve – svar</h2>
      <BoxWithAI q="Bakgrunn / problem" a={fag.bakgrunn} ai={fag.ai_bakgrunn} />
      <BoxWithAI q="Mål og ønsket effekt" a={fag.mal} ai={fag.ai_mal} />
      <BoxWithAI q="Målgruppe" a={fag.malgruppe} ai={fag.ai_malgruppe} />
      <BoxWithAI q="Brukerinnsikt" a={fag.innsikt} ai={fag.ai_innsikt} />
      <BoxWithAI q="Budskap" a={fag.budskap} ai={fag.ai_budskap} />
      <BoxWithAI q="Tone / profil" a={fag.tone} ai={fag.ai_tone} />
      <BoxWithAI q="Idéutvikling" a={fag.ideutvikling} ai={fag.ai_ideutvikling} />
      <BoxWithAI q="Pitch" a={fag.pitch} ai={fag.ai_pitch} />

      <BoxWithAI q="Kanalvalg" a={fag.kanalvalg} ai={fag.ai_kanalvalg} />
      <BoxWithAI q="Leveranse 1: Hovedproduksjon" a={fag.leveranseHoved} ai={fag.ai_leveranseHoved} />
      <BoxWithAI
        q="Leveranse 2: Plattformversjon 1"
        a={fag.leveransePlattform1}
        ai={fag.ai_leveransePlattform1}
      />
      <BoxWithAI
        q="Leveranse 3: Plattformversjon 2"
        a={fag.leveransePlattform2}
        ai={fag.ai_leveransePlattform2}
      />

      <BoxWithAI q="Produksjonsplan" a={fag.produksjonsplan} ai={fag.ai_produksjonsplan} />
      <BoxWithAI q="Budsjett / ressursbehov" a={fag.budsjett} ai={fag.ai_budsjett} />
      <BoxWithAI q="Opptak" a={fag.opptak} ai={fag.ai_opptak} />
      <BoxWithAI q="Utstyr og programvare" a={fag.utstyr} ai={fag.ai_utstyr} />

      <BoxWithAI q="Lys, komposisjon og visuelle virkemidler" a={fag.lysKomposisjon} ai={fag.ai_lysKomposisjon} />
      <BoxWithAI q="Etterarbeid og eksport" a={fag.etterarbeidEksport} ai={fag.ai_etterarbeidEksport} />

      <BoxWithAI q="Algoritmer og personalisering" a={fag.algoritmer} ai={fag.ai_algoritmer} />
      <BoxWithAI q="Publiseringsstrategi" a={fag.publiseringsstrategi} ai={fag.ai_publiseringsstrategi} />

      <BoxWithAI q="Etikk, lovverk og opphavsrett" a={fag.etikkLov} ai={fag.ai_etikkLov} />
      <BoxWithAI q="Universell utforming" a={fag.universell} ai={fag.ai_universell} />

      <BoxWithAI q="Rolle i team / virksomhet" a={fag.teamRolle} ai={fag.ai_teamRolle} />
      <BoxWithAI q="Evaluering" a={fag.evaluering} ai={fag.ai_evaluering} />
      <BoxWithAI q="Samfunnsdebatt og demokrati" a={fag.samfunn} ai={fag.ai_samfunn} />
      <BoxWithAI q="Likeverdig og inkluderende yrkesfellesskap" a={fag.yrkesfellesskap} ai={fag.ai_yrkesfellesskap} />
      <BoxWithAI q="Dokumentasjon" a={fag.dokumentasjon} ai={fag.ai_dokumentasjon} />

      <h2>Kompetansemål (sjekkliste)</h2>
      <ol>
        {kompetansemaal.map((m, i) => (
          <li key={i}>{m}</li>
        ))}
      </ol>
    </>
  );
}

function KompetansePrint({ komp }: { komp: KompetanseAnswers }) {
  return (
    <>
      <p className="meta">
        Kunde: <b>{komp.kundenavn || "—"}</b> ({kundeLabel(komp.kundeType)}) • Fokus:{" "}
        <b>kjerneelementer</b>
      </p>

      <h2>Kompetansebevis – svar</h2>
      <BoxWithAI q="Design og kreativitet" a={komp.design} ai={komp.ai_design} />
      <BoxWithAI q="Teknologi og produksjon" a={komp.teknologi} ai={komp.ai_teknologi} />
      <BoxWithAI q="Kommunikasjon og historiefortelling" a={komp.fortelling} ai={komp.ai_fortelling} />
      <BoxWithAI q="Formatvalg" a={komp.formatvalg} ai={komp.ai_formatvalg} />
      <BoxWithAI q="Lysvalg" a={komp.lysvalg} ai={komp.ai_lysvalg} />
      <BoxWithAI q="Enkel plan" a={komp.enkelPlan} ai={komp.ai_enkelPlan} />
      <BoxWithAI q="Publisering/KPI/algoritme" a={komp.enkelPublisering} ai={komp.ai_enkelPublisering} />
      <BoxWithAI q="Etikk/lov/opphavsrett/personvern" a={komp.enkelEtikk} ai={komp.ai_enkelEtikk} />

      <h2>Kjerneelementer (referanse)</h2>
      <ol>
        {Object.entries(kjerneelementer).map(([t, d]) => (
          <li key={t}>
            <b>{t}:</b> {d}
          </li>
        ))}
      </ol>
    </>
  );
}

function InfoPrint() {
  return (
    <>
      <h2>Kjerneelementer</h2>
      <ol>
        {Object.entries(kjerneelementer).map(([t, d]) => (
          <li key={t}>
            <b>{t}:</b> {d}
          </li>
        ))}
      </ol>

      <h2>Kompetansemål</h2>
      <ol>
        {kompetansemaal.map((m, i) => (
          <li key={i}>{m}</li>
        ))}
      </ol>
    </>
  );
}
