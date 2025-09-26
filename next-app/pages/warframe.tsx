import { useEffect, useState } from "react";
import Header from "../app/components/Header";
// import "@/styles/warframe.css";
import { HubData } from "../app/components/warframe/types";
import CycleTimers from "../app/components/warframe/SectionCycleTimers";
import Construction from "../app/components/warframe/SectionConstruction";
import Darvo from "@/app/components/warframe/SectionDarvo";
import SectionNews from "@/app/components/warframe/SectionNews";

export default function Warframe() {
  const [data, setData] = useState<HubData | null>(null);

  useEffect(() => {
    fetch("https://api.warframestat.us/pc")
      .then((res) => res.json())
      .then(jsonData => setData(jsonData))
      .catch(e => console.error(e));
  }, []);

  return <>
    <Header />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 h-full">
      <div>
        <CycleTimers data={data} />
      </div>
      <div>
        <Construction data={data} />
      </div>
      <div>
        <Darvo />
        <SectionNews data={data} />
      </div>
    </div>
  </>
}
