import { useEffect, useState } from "react";
import Section from "./Section";
import { DarvoDeal, HubData } from "./types";
import Timer from "./Timer";

export default function Darvo() {
  const [data, setData] = useState<DarvoDeal[] | null>(null);

  useEffect(() => {
    fetch("https://api.warframestat.us/pc/dailyDeals")
      .then(res => res.json())
      .then(newData => setData(newData))
      .catch(e => console.log(e));
  }, [])

  const item = data?.[0];

  return <Section text="Darvo">
    <div className="flex flex-row justify-around">
      <span>{item?.item}</span>
      <span>{item?.discount}% Off</span>
      <span>{item?.salePrice} P</span>
      <span>{(100 / item?.total! * (item?.total! - item?.sold!)).toFixed(2)}% Left</span>
      <Timer expiry={new Date(item?.expiry ?? Date())} />
    </div>
  </Section>
}
