import Section from "./Section";
import { HubData } from "./types";

export default function Construction({ data }: { data: HubData | undefined }) {
  const fomorian = parseFloat(data?.constructionProgress.fomorianProgress ?? "0") % 100;
  const razorback = parseFloat(data?.constructionProgress.razorbackProgress ?? "0") % 100;

  return (
    <Section text="Construction">
      <div className="grid grid-cols-2 w-full">
        <Progress
          progress={fomorian}
          color="text-tertiary"
          bg="text-tertiary-container"
          text="Fomorian"
        />
        <Progress
          progress={razorback}
          color="text-error"
          bg="text-error-container"
          text="Razorback"
        />
      </div>
    </Section>
  )
}

function Progress({ progress, color, bg, text }:
  { progress: number, color: string, bg: string, text: string }) {
  const radius = 40;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (progress / 100) * circ;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg className="w-24 h-24 transform -rotate-90">
          <circle
            className={bg}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            r={radius}
            cx="48"
            cy="48"
          />
          <circle
            className={`${color} transistion-all duration-500`}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            r={radius}
            cx="48"
            cy="48"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font ">{progress.toFixed(2)}%</span>
        </div>
      </div>
      <span className="mt-2 text-lg font-semibold">{text}</span>
    </div>
  )
}
