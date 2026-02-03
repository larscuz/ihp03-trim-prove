import { Question } from "./Question";

export function QuestionWithAI({
  title,
  text,
  answer,
  setAnswer,
  ai,
  setAi,
}: {
  title: string;
  text: string;
  answer: string;
  setAnswer: (v: string) => void;
  ai: string;
  setAi: (v: string) => void;
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <Question title={title} text={text}>
        <textarea
          className="textarea"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Skriv svaret ditt her…"
        />
      </Question>

      <div style={{ marginTop: 8 }}>
        <div className="label">Hvilken type AI har du brukt for denne delen?</div>
        <input
          className="input"
          value={ai}
          onChange={(e) => setAi(e.target.value)}
          placeholder="For eksempel: Ingen / ChatGPT / Freepik / Suno …"
        />
      </div>
    </div>
  );
}
