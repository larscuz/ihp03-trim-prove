"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { TabButton } from "@/components/TabButton";
import { Field } from "@/components/Field";
import { Question } from "@/components/Question";
import { exportNodeToPdf } from "@/lib/pdf";
import { kompetansemaal, kjerneelementer, udirLinks, note } from "@/lib/curriculum";
import { load, save } from "@/lib/storage";

type Tab = "fagprove" | "kompetanse" | "info";
type KundeType =
  | "cafe"
  | "hotell"
  | "museum"
  | "skole"
  | "gym"
  | "dyreklinikk";


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

  const activeKundeType = tab === "kompetanse" ? komp.kundeType : fag.kundeType;

  return (
    <>
      <div className="header">
        <div className="hgroup">
          <h1>Prøve i innholdsproduksjon (IHP03-01)</h1>
<p>
  Fagprøve eller kompetansebevis – kreativ brief for kommersiell kunde i sosiale medier.
  Du arbeider i reklamebyrået <b>Trim AS</b> og skal planlegge, beskrive og dokumentere
  en innholdsproduksjon for en kunde (café, hotell eller museum).
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
                Du jobber i reklamebyrået <b>Trim AS</b>. Kunden er en{" "}
                <b>{kundeLabel(activeKundeType)}</b>-aktør som trenger bedre synlighet i sosiale medier.
                Du skal levere <b>1 hovedproduksjon</b>, <b>2 plattformversjoner</b>,{" "}
                <b>publiseringsstrategi</b> og <b>dokumentasjon</b>.
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

          {tab === "fagprove" ? <FagprovePrint fag={fag} /> : tab === "kompetanse" ? <KompetansePrint komp={komp} /> : <InfoPrint />}

          <hr className="sep" />
          <p className="small">
            Lenker: {udirLinks.kompetansemaal} • {udirLinks.kjerneelementer}
          </p>
        </div>
      </div>
    </>
  );
}

function FagproveTab({ fag, setFag }: { fag: FagproveAnswers; setFag: (v: FagproveAnswers) => void }) {
  return (
    <div className="grid">
      <div className="section">
        <h3>1. Kunde og rammer</h3>
        <div className="kv two">
          <Field label="Kundetype">
            <select className="select" value={fag.kundeType} onChange={(e) => setFag({ ...fag, kundeType: e.target.value as any })}>
              <option value="cafe">Café</option>
<option value="hotell">Hotell</option>
<option value="museum">Museum</option>
<option value="skole">Skole</option>
<option value="gym">Treningssenter</option>
<option value="dyreklinikk">Dyreklinikk</option>

            </select>
          </Field>
          <Field label="Kundenavn (kan redigeres)">
            <input className="input" value={fag.kundenavn} onChange={(e) => setFag({ ...fag, kundenavn: e.target.value })} placeholder="Skriv kundenavn" />
          </Field>
        </div>
      </div>

      <div className="section">
        <h3>2. Kreativ brief (låste spørsmål)</h3>

        <Question title="Bakgrunn / problem" text="Beskriv situasjonen: hva er problemet eller behovet kunden har i sosiale medier? Svar konkret.">
          <textarea className="textarea" value={fag.bakgrunn} onChange={(e) => setFag({ ...fag, bakgrunn: e.target.value })} placeholder="Skriv svaret ditt her…" />
        </Question>

        <Question title="Mål og ønsket effekt" text="Hva skal kampanjen oppnå (målbare mål/KPI-er der det passer)?">
          <textarea className="textarea" value={fag.mal} onChange={(e) => setFag({ ...fag, mal: e.target.value })} placeholder="Skriv svaret ditt her…" />
        </Question>

        <Question title="Målgruppe" text="Hvem er målgruppen(e), og hva kjennetegner dem (atferd, behov, barrierer)?">
          <textarea className="textarea" value={fag.malgruppe} onChange={(e) => setFag({ ...fag, malgruppe: e.target.value })} placeholder="Skriv svaret ditt her…" />
        </Question>

        <Question title="Brukerinnsikt" text="Hvilke metoder vil du bruke for å skaffe brukerinnsikt, og hvordan vil innsikten styre valgene dine?">
          <textarea className="textarea" value={fag.innsikt} onChange={(e) => setFag({ ...fag, innsikt: e.target.value })} placeholder="Skriv svaret ditt her…" />
        </Question>

        <Question title="Budskap" text="Formuler hovedbudskapet i 1–2 setninger. Hva skal publikum sitte igjen med?">
          <textarea className="textarea" value={fag.budskap} onChange={(e) => setFag({ ...fag, budskap: e.target.value })} placeholder="Skriv svaret ditt her…" />
        </Question>

        <Question title="Tone / profil" text="Beskriv tone of voice og visuell retning (lys, seriøs, corporate).">
          <textarea className="textarea" value={fag.tone} onChange={(e) => setFag({ ...fag, tone: e.target.value })} placeholder="Skriv svaret ditt her…" />
        </Question>

        <Question title="Idéutvikling" text="Beskriv hvilke metoder du bruker for idéutvikling (f.eks. moodboard, skisser, prototyper, testing).">
          <textarea className="textarea" value={fag.ideutvikling} onChange={(e) => setFag({ ...fag, ideutvikling: e.target.value })} placeholder="Skriv svaret ditt her…" />
        </Question>

        <Question title="Pitch" text="Skriv en pitch (maks 10 setninger): konsept, format, hvorfor det passer målgruppen, forventet effekt.">
          <textarea className="textarea" value={fag.pitch} onChange={(e) => setFag({ ...fag, pitch: e.target.value })} placeholder="Skriv svaret ditt her…" />
        </Question>

        <hr className="sep" />

        <Question title="Kanalvalg" text="Hvilke plattformer velger du og hvorfor? (Instagram/TikTok/YouTube Shorts/LinkedIn m.fl.)">
          <textarea className="textarea" value={fag.kanalvalg} onChange={(e) => setFag({ ...fag, kanalvalg: e.target.value })} placeholder="Skriv svaret ditt her…" />
        </Question>

        <Question title="Leveranse 1: Hovedproduksjon" text="Beskriv hovedproduksjonen (60–90 sek): innhold, dramaturgi, CTA og hvordan den løser målet.">
          <textarea className="textarea" value={fag.leveranseHoved} onChange={(e) => setFag({ ...fag, leveranseHoved: e.target.value })} placeholder="Skriv svaret ditt her…" />
        </Question>

        <Question title="Leveranse 2: Plattformversjon 1" text="Beskriv en 9:16 versjon (15–30 sek) for Reels/Shorts/TikTok: hook, teksting, tempo.">
          <textarea className="textarea" value={fag.leveransePlattform1} onChange={(e) => setFag({ ...fag, leveransePlattform1: e.target.value })} placeholder="Skriv svaret ditt her…" />
        </Question>

        <Question title="Leveranse 3: Plattformversjon 2" text="Beskriv en ekstra kort variant (6–12 sek) eller 1:1/9:16: hva er budskapet i første sekund?">
          <textarea className="textarea" value={fag.leveransePlattform2} onChange={(e) => setFag({ ...fag, leveransePlattform2: e.target.value })} placeholder="Skriv svaret ditt her…" />
        </Question>

        <hr className="sep" />

        <Question title="Produksjonsplan" text="Lag en gjennomførbar plan (preprod → opptak → post → publisering) med roller og sjekklister.">
          <textarea className="textarea" value={fag.produksjonsplan} onChange={(e) => setFag({ ...fag, produksjonsplan: e.target.value })} placeholder="Skriv svaret ditt her…" />
        </Question>

        <Question title="Budsjett / ressursbehov" text="Kartlegg ressursbehov og lag et realistisk mini-budsjett (tid, utstyr, musikk/stock, reise).">
          <textarea className="textarea" value={fag.budsjett} onChange={(e) => setFag({ ...fag, budsjett: e.target.value })} placeholder="Skriv svaret ditt her…" />
        </Question>

        <Question title="Opptak" text="Hvordan gjennomfører du opptak (foto/film/lyd) tilpasset rammer? (B-roll, intervju, lyd, sikkerhet)">
          <textarea className="textarea" value={fag.opptak} onChange={(e) => setFag({ ...fag, opptak: e.target.value })} placeholder="Skriv svaret ditt her…" />
        </Question>

        <Question title="Utstyr og programvare" text="Hvilket utstyr og hvilken programvare velger du, og hvorfor? (kamera/lys/lyd/redigering)">
          <textarea className="textarea" value={fag.utstyr} onChange={(e) => setFag({ ...fag, utstyr: e.target.value })} placeholder="Skriv svaret ditt her…" />
        </Question>

        <hr className="sep" />

        <Question title="Lys, komposisjon og visuelle virkemidler" text="Forklar lysoppsett, komposisjon og visuell stil. Hvordan støtter det budskap og merkevare?">
          <textarea className="textarea" value={fag.lysKomposisjon} onChange={(e) => setFag({ ...fag, lysKomposisjon: e.target.value })} placeholder="Skriv svaret ditt her…" />
        </Question>

        <Question title="Etterarbeid og eksport" text="Beskriv etterarbeid (klipp, lyd, grafikk/teksting, farge). Hvilke formater/filtyper leverer du?">
          <textarea className="textarea" value={fag.etterarbeidEksport} onChange={(e) => setFag({ ...fag, etterarbeidEksport: e.target.value })} placeholder="Skriv svaret ditt her…" />
        </Question>

        <hr className="sep" />

        <Question title="Algoritmer og personalisering" text="Hvordan påvirker algoritmer distribusjon – og hvilke grep tar du (hook, retention, metadata, test)?">
          <textarea className="textarea" value={fag.algoritmer} onChange={(e) => setFag({ ...fag, algoritmer: e.target.value })} placeholder="Skriv svaret ditt her…" />
        </Question>

        <Question title="Publiseringsstrategi" text="Planlegg publisering: tidspunkt, frekvens, A/B-testing, community, KPI-er og oppfølging.">
          <textarea className="textarea" value={fag.publiseringsstrategi} onChange={(e) => setFag({ ...fag, publiseringsstrategi: e.target.value })} placeholder="Skriv svaret ditt her…" />
        </Question>

        <hr className="sep" />

        <Question title="Etikk, lovverk og opphavsrett" text="Hvordan sikrer du samtykke/personvern, opphavsrett, reklame-merking, og oppbevaring/arkiv?">
          <textarea className="textarea" value={fag.etikkLov} onChange={(e) => setFag({ ...fag, etikkLov: e.target.value })} placeholder="Skriv svaret ditt her…" />
        </Question>

        <Question title="Universell utforming" text="Hvordan sikrer du universell utforming i ferdig produkt (teksting, kontrast, lesbarhet, tempo)?">
          <textarea className="textarea" value={fag.universell} onChange={(e) => setFag({ ...fag, universell: e.target.value })} placeholder="Skriv svaret ditt her…" />
        </Question>

        <hr className="sep" />

        <Question title="Rolle i team / virksomhet" text="Beskriv din rolle, samarbeid og kvalitetssikring i Trim AS (kommunikasjon, ansvar, endringer).">
          <textarea className="textarea" value={fag.teamRolle} onChange={(e) => setFag({ ...fag, teamRolle: e.target.value })} placeholder="Skriv svaret ditt her…" />
        </Question>

        <Question title="Evaluering" text="Hvordan evaluerer du resultat og læring? Hvilke data bruker du, og hva forbedrer du i runde 2?">
          <textarea className="textarea" value={fag.evaluering} onChange={(e) => setFag({ ...fag, evaluering: e.target.value })} placeholder="Skriv svaret ditt her…" />
        </Question>

        <Question title="Samfunnsdebatt og demokrati" text="Reflekter kort: Hvordan kan innholdsproduksjoner påvirke samfunnsdebatt og demokrati?">
          <textarea className="textarea" value={fag.samfunn} onChange={(e) => setFag({ ...fag, samfunn: e.target.value })} placeholder="Skriv svaret ditt her…" />
        </Question>

        <Question title="Likeverdig og inkluderende yrkesfellesskap" text="Gjør rede for krav/forventninger, og reflekter over plikter og rettigheter i lærebedrift.">
          <textarea className="textarea" value={fag.yrkesfellesskap} onChange={(e) => setFag({ ...fag, yrkesfellesskap: e.target.value })} placeholder="Skriv svaret ditt her…" />
        </Question>

        <Question title="Dokumentasjon" text="Hvordan dokumenterer du prosess, filstruktur, kilder, versjoner og endelig leveranse til kunden?">
          <textarea className="textarea" value={fag.dokumentasjon} onChange={(e) => setFag({ ...fag, dokumentasjon: e.target.value })} placeholder="Skriv svaret ditt her…" />
        </Question>
      </div>

      <div className="section">
        <h3>Sjekkliste mot kompetansemål (bokmål-oversatt)</h3>
        <p>Bruk dette som kontroll før du leverer.</p>
        <ol>
          {kompetansemaal.map((m, i) => (
            <li key={i} style={{ margin: "6px 0", color: "var(--muted)" }}>{m}</li>
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
            <select className="select" value={komp.kundeType} onChange={(e) => setKomp({ ...komp, kundeType: e.target.value as any })}>
              <option value="cafe">Café</option>
              <option value="hotell">Hotell</option>
              <option value="museum">Museum</option>
            </select>
          </Field>
          <Field label="Kundenavn (kan redigeres)">
            <input className="input" value={komp.kundenavn} onChange={(e) => setKomp({ ...komp, kundenavn: e.target.value })} placeholder="Skriv kundenavn" />
          </Field>
        </div>
      </div>

      <div className="section">
        <h3>2. Kjerneelement (låste spørsmål)</h3>

        <Question title="Design og kreativitet" text="Forklar kort hvordan du jobber fra idé til ferdig produkt (designvalg, komposisjon og brukeropplevelse).">
          <textarea className="textarea" value={komp.design} onChange={(e) => setKomp({ ...komp, design: e.target.value })} placeholder="Skriv svaret ditt her…" />
        </Question>

        <Question title="Teknologi og produksjon" text="Forklar kort hvilke verktøy/utstyr du velger, og hvorfor (opptak, redigering, eksport/publisering).">
          <textarea className="textarea" value={komp.teknologi} onChange={(e) => setKomp({ ...komp, teknologi: e.target.value })} placeholder="Skriv svaret ditt her…" />
        </Question>

        <Question title="Kommunikasjon og historiefortelling" text="Forklar kort hvordan du bygger budskap og historie tilpasset kanal, sjanger og målgruppe.">
          <textarea className="textarea" value={komp.fortelling} onChange={(e) => setKomp({ ...komp, fortelling: e.target.value })} placeholder="Skriv svaret ditt her…" />
        </Question>
      </div>

      <div className="section">
        <h3>3. Smarte valg</h3>

        <Question title="Formatvalg" text="Velg ett format (begrunn): (A) 60–90 sek film (B) 20 sek Reels (C) 8 sek bumper.">
          <textarea className="textarea" value={komp.formatvalg} onChange={(e) => setKomp({ ...komp, formatvalg: e.target.value })} placeholder="Skriv svaret ditt her…" />
        </Question>

        <Question title="Lysvalg" text="Velg lysløsning (begrunn): (A) naturlys + reflektor (B) 1 LED key + fill (C) 3-punkt.">
          <textarea className="textarea" value={komp.lysvalg} onChange={(e) => setKomp({ ...komp, lysvalg: e.target.value })} placeholder="Skriv svaret ditt her…" />
        </Question>

        <Question title="Enkel plan" text="Skriv en enkel plan i punktform fra idé → opptak → post → publisering.">
          <textarea className="textarea" value={komp.enkelPlan} onChange={(e) => setKomp({ ...komp, enkelPlan: e.target.value })} placeholder="Skriv svaret ditt her…" />
        </Question>
      </div>

      <div className="section">
        <h3>4. Publisering og etikk</h3>

        <Question title="Publisering/KPI/algoritme" text="Nevn 3 KPI-er du vil måle, og hvordan du tilpasser innhold til algoritmene.">
          <textarea className="textarea" value={komp.enkelPublisering} onChange={(e) => setKomp({ ...komp, enkelPublisering: e.target.value })} placeholder="Skriv svaret ditt her…" />
        </Question>

        <Question title="Etikk/lov/opphavsrett/personvern" text="Nevn 3 konkrete tiltak du gjør for å sikre etikk og regelverk.">
          <textarea className="textarea" value={komp.enkelEtikk} onChange={(e) => setKomp({ ...komp, enkelEtikk: e.target.value })} placeholder="Skriv svaret ditt her…" />
        </Question>
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
          Lenke: <a href={udirLinks.kjerneelementer} target="_blank">UDIR – kjerneelementer</a>
        </div>
      </div>

      <div className="section">
        <h3>Kompetansemål (bokmål-oversatt)</h3>
        <ol>
          {kompetansemaal.map((m, i) => (
            <li key={i} style={{ margin: "8px 0" }}>{m}</li>
          ))}
        </ol>
        <div className="small" style={{ marginTop: 10 }}>
          Lenke: <a href={udirLinks.kompetansemaal} target="_blank">UDIR – kompetansemål</a>
        </div>
      </div>

      <div className="section">
        <h3>Vurderingskriterier (praktisk rubrikk)</h3>
        <p>Denne rubrikken er laget for prøven og kan justeres lokalt i VS Code.</p>
        <ol>
          <li><b>Oppdragsforståelse:</b> Behov, mål og budskap er tydelig og relevant.</li>
          <li><b>Brukerinnsikt:</b> Metode er egnet, og innsikt omsettes til konkrete grep.</li>
          <li><b>Kreativt konsept:</b> Idé, sjanger/format og pitch henger sammen og er målrettet.</li>
          <li><b>Plan og gjennomføring:</b> Produksjonsplan og ressursbruk er realistisk.</li>
          <li><b>Teknisk kvalitet:</b> Lyd/bilde/lys/komposisjon og etterarbeid er kontrollert.</li>
          <li><b>Publisering:</b> Strategi, KPI-er og forståelse av algoritmer er tydelig.</li>
          <li><b>Etikk og lov:</b> Opphavsrett, samtykke/personvern, merking og oppbevaring ivaretas.</li>
          <li><b>Universell utforming:</b> Teksting, lesbarhet og tilgjengelighet er ivaretatt.</li>
          <li><b>Samarbeid/rolle:</b> Profesjonell kommunikasjon og ansvar i team.</li>
          <li><b>Dokumentasjon og refleksjon:</b> Sporbar prosess og relevant evaluering.</li>
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

function FagprovePrint({ fag }: { fag: FagproveAnswers }) {
  return (
    <>
      <p className="meta">
        Kunde: <b>{fag.kundenavn || "—"}</b> ({kundeLabel(fag.kundeType)}) • Profil: <b>lys/seriøs corporate</b>
      </p>

      <h2>Fagprøve – svar</h2>
      <Box q="Bakgrunn / problem" a={fag.bakgrunn} />
      <Box q="Mål og ønsket effekt" a={fag.mal} />
      <Box q="Målgruppe" a={fag.malgruppe} />
      <Box q="Brukerinnsikt" a={fag.innsikt} />
      <Box q="Budskap" a={fag.budskap} />
      <Box q="Tone / profil" a={fag.tone} />
      <Box q="Idéutvikling" a={fag.ideutvikling} />
      <Box q="Pitch" a={fag.pitch} />

      <Box q="Kanalvalg" a={fag.kanalvalg} />
      <Box q="Leveranse 1: Hovedproduksjon" a={fag.leveranseHoved} />
      <Box q="Leveranse 2: Plattformversjon 1" a={fag.leveransePlattform1} />
      <Box q="Leveranse 3: Plattformversjon 2" a={fag.leveransePlattform2} />

      <Box q="Produksjonsplan" a={fag.produksjonsplan} />
      <Box q="Budsjett / ressursbehov" a={fag.budsjett} />
      <Box q="Opptak" a={fag.opptak} />
      <Box q="Utstyr og programvare" a={fag.utstyr} />

      <Box q="Lys, komposisjon og visuelle virkemidler" a={fag.lysKomposisjon} />
      <Box q="Etterarbeid og eksport" a={fag.etterarbeidEksport} />

      <Box q="Algoritmer og personalisering" a={fag.algoritmer} />
      <Box q="Publiseringsstrategi" a={fag.publiseringsstrategi} />

      <Box q="Etikk, lovverk og opphavsrett" a={fag.etikkLov} />
      <Box q="Universell utforming" a={fag.universell} />

      <Box q="Rolle i team / virksomhet" a={fag.teamRolle} />
      <Box q="Evaluering" a={fag.evaluering} />
      <Box q="Samfunnsdebatt og demokrati" a={fag.samfunn} />
      <Box q="Likeverdig og inkluderende yrkesfellesskap" a={fag.yrkesfellesskap} />
      <Box q="Dokumentasjon" a={fag.dokumentasjon} />

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
        Kunde: <b>{komp.kundenavn || "—"}</b> ({kundeLabel(komp.kundeType)}) • Fokus: <b>kjerneelementer</b>
      </p>

      <h2>Kompetansebevis – svar</h2>
      <Box q="Design og kreativitet" a={komp.design} />
      <Box q="Teknologi og produksjon" a={komp.teknologi} />
      <Box q="Kommunikasjon og historiefortelling" a={komp.fortelling} />
      <Box q="Formatvalg" a={komp.formatvalg} />
      <Box q="Lysvalg" a={komp.lysvalg} />
      <Box q="Enkel plan" a={komp.enkelPlan} />
      <Box q="Publisering/KPI/algoritme" a={komp.enkelPublisering} />
      <Box q="Etikk/lov/opphavsrett/personvern" a={komp.enkelEtikk} />

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
