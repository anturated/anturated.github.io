"use client"

import { useEffect, useState } from "react";
import Section from "./Section";
import { HubData } from "./types";

export default function SectionNews({ data }: { data: HubData | undefined }) {
  const [newsIndex, setIndex] = useState(0);
  const delay = 3000;

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(i => (i + 1) % data?.news.length!);

    }, delay);

    return () => clearInterval(interval);
  }, [data, delay]);

  return <Section text="News">
    <div className="flex flex-col">
      <div className="relative w-full overflow-hidden rounded-2xl">
        <div className="flex transistion-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${newsIndex * 100}%)` }}
        >
          {data?.news.map((n) => <img
            key={n.id}
            src={n.imageLink}
            loading="lazy"
            alt="pic"
            className="w-full object-cover"
          />)}
        </div>
      </div>
      <ol>
        {
          data?.news ? (
            data.news.map((n, ind) => <li id={n.date} key={ind} className={ind == newsIndex ? "text-primary" : ""}>
              {new Date(n.date).toLocaleDateString()} {n.message}
            </li>)
          ) : (
            <span>no news</span>
          )
        }
      </ol>
    </div>
  </Section>
}
