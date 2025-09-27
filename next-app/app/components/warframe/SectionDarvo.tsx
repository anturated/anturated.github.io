import Section from "./Section";
import { DarvoDeal, HubData } from "./types";
import Timer from "./Timer";
import useSWR, { Fetcher } from "swr";

export default function Darvo() {
  const fetcher: Fetcher<DarvoDeal[], string> = (url: string) => fetch(url).then(res => res.json());
  const { data, error, isLoading } = useSWR("https://api.warframestat.us/pc/dailyDeals", fetcher);

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
