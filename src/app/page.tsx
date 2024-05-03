"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import { getEmojis, Emoji } from "unicode-emoji";

export default function Home() {
  const [ip, setIp] = useState<number[]>([1, 1, 1, 1]);
  const [emoji, setEmoji] = useState<string[]>([
    "😀",
    "👋",
    "🤐",
    "🥰",
    "😀",
    "👋",
  ]);
  const lastUpdate = useRef<"ip" | "emoji" | null>(null);

  const dict = useMemo(() => {
    const emojis = getEmojis();

    const d: {
      [subgroup: string]: Emoji;
    } = {};

    for (const emoji of emojis) {
      if (!d[emoji.subgroup.toString()]) {
        d[emoji.subgroup] = emoji;
      }
    }

    return d;
  }, []);

  const charset = useMemo(() => {
    return Object.values(dict).map((e) => e.emoji);
  }, [dict]);

  // const extras = ["🫠", "🥲", "🤑", "🤔", "🫥", "🤤", "🤯", "🤓", "😭", "💀", "👻", "🕳", "🙏", "💅", "🧠", "👀", "👣", "🍄", "🧭", "🏫", "🗽", "🎢", "🚨", "🚀", "🧳", "⭐", "🌈", "⚡", "🔥"]

  useWasm("/main.wasm");

  useEffect(() => {
    if (lastUpdate.current !== "ip") return;

    if (ip.length !== 4 || ip.findIndex((i) => isNaN(i)) !== -1) return;

    // @ts-ignore
    if (globalThis.encode && ip) {
      // charset.push(...extras)
      const charsetMappings = charset.map((v, i) => String.fromCharCode(i));
      // @ts-ignore
      const encoded = globalThis.encode(
        charsetMappings.join("").slice(0, 64),
        ...ip,
      );
      const mappedValues = encoded
        .split("")
        .map((v: string) => v.charCodeAt(0));
      const decoded = mappedValues.map((v: number) => charset[v]);
      setEmoji(decoded);
    }
  }, [ip, charset]);

  useEffect(() => {
    if (lastUpdate.current !== "emoji") return;

    const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
    const segments = Array.from(segmenter.segment(emoji.join(""))).map(
      (v) => v.segment,
    );

    if (segments.length != 6) return;
    // @ts-ignore
    if (globalThis.decode && emoji) {
      const charsetMappings = charset.map((v, i) => String.fromCharCode(i));
      // charset.push(...extras)
      const dataMap = segments.map((v: any) => charset.indexOf(v));
      const mappedValues = dataMap.map((v: number) => String.fromCharCode(v));
      // @ts-ignore
      const decoded = globalThis.decode(
        charsetMappings.join("").slice(0, 64),
        mappedValues.join(""),
      );

      setIp(
        decoded
          .split("")
          .map((v: string) => v.charCodeAt(0))
          .join("."),
      );
    }
  }, [emoji, charset]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-evenly gap-10 bg-e-yellow p-12 font-mono">
      <div className="relative flex w-full -rotate-3 flex-row items-center justify-center">
        <svg
          className="relative"
          width="562"
          height="138"
          viewBox="0 0 702 173"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M96.4816 2.99732C97.1965 1.76122 98.5162 1 99.9441 1H696.722C699.731 1 701.663 4.198 700.262 6.86157L614.557 169.862C613.865 171.177 612.502 172 611.016 172H5.66797C2.5874 172 0.663081 168.664 2.20543 165.997L96.4816 2.99732Z"
            fill="#FFA9A9"
            stroke="black"
            strokeWidth="2"
          />
        </svg>
        <h1 className="absolute text-7xl">
          em🤪j<span className="font-serif font-bold">IP</span>
        </h1>
      </div>
      <div className="flex flex-row items-center justify-center gap-5 rounded-lg border-2 border-black bg-e-brown p-10">
        <div className="flex flex-col items-center justify-center gap-8">
          <p className="font-serif text-3xl">
            boring <span className="font-bold">numerical</span> address
          </p>
          <div className="flex flex-row items-end justify-center gap-1">
            <input
              type="number"
              placeholder="1"
              className="h-16 w-16 rounded-xl border-2 border-black bg-white text-center text-2xl"
              value={ip[0]}
              min="0"
              max="255"
              onChange={(e) => {
                lastUpdate.current = "ip";
                setIp((i) =>
                  i.map((v, i) => (i === 0 ? parseInt(e.target.value) : v)),
                );
              }}
            />
            <div className="aspect-square w-2 rounded-full bg-black" />
            <input
              type="number"
              placeholder="1"
              className="h-16 w-16 rounded-xl border-2 border-black bg-white text-center text-2xl"
              value={ip[1]}
              min="0"
              max="255"
              onChange={(e) => {
                lastUpdate.current = "ip";
                setIp((i) =>
                  i.map((v, i) => (i === 1 ? parseInt(e.target.value) : v)),
                );
              }}
            />
            <div className="aspect-square w-2 rounded-full bg-black" />
            <input
              type="number"
              placeholder="1"
              className="h-16 w-16 rounded-xl border-2 border-black bg-white text-center text-2xl"
              value={ip[2]}
              min="0"
              max="255"
              onChange={(e) => {
                lastUpdate.current = "ip";
                setIp((i) =>
                  i.map((v, i) => (i === 2 ? parseInt(e.target.value) : v)),
                );
              }}
            />
            <div className="aspect-square w-2 rounded-full bg-black" />
            <input
              type="number"
              placeholder="1"
              className="h-16 w-16 rounded-xl border-2 border-black bg-white text-center text-2xl"
              value={ip[3]}
              min="0"
              max="255"
              onChange={(e) => {
                lastUpdate.current = "ip";
                setIp((i) =>
                  i.map((v, i) => (i === 3 ? parseInt(e.target.value) : v)),
                );
              }}
            />
            <button
              className="ml-2 self-center text-3xl"
              onClick={() => {
                navigator.clipboard.writeText(ip.join("."));
              }}
            >
              📋️
            </button>
          </div>
          <button
            className="font-serif text-2xl underline"
            onClick={() => {
              fetch("/get-ip")
                .then((res) => res.json())
                .then((data) => {
                  const ip = data.ip.split(".").map((v: string) => parseInt(v));
                  lastUpdate.current = "ip";
                  setIp(ip);
                });
            }}
          >
            🧑‍💻 use my ip
          </button>
        </div>
        <div className="flex flex-col items-center justify-evenly gap-2">
          <div className="h-20 w-1 bg-black" />
          <p className="text-3xl">↔️</p>
          <div className="h-20 w-1 bg-black" />
        </div>
        <div className="flex flex-col items-center justify-center gap-8">
          <p className="font-display text-4xl">fun em🤪jℹ️ address ✨</p>
          <div className="flex flex-row items-center justify-start">
            <div className="grid grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="🤔"
                className="h-16 w-16 rounded-xl border-2 border-black bg-white text-center text-2xl"
                value={emoji[0]}
                onChange={(e) => {
                  if (
                    charset.includes(e.target.value) ||
                    e.target.value === ""
                  ) {
                    lastUpdate.current = "emoji";
                    setEmoji((a) =>
                      a.map((v, i) => (i === 0 ? e.target.value : v)),
                    );
                  }
                }}
              />
              <input
                type="text"
                placeholder="🤔"
                className="h-16 w-16 rounded-xl border-2 border-black bg-white text-center text-2xl"
                value={emoji[1]}
                onChange={(e) => {
                  if (
                    charset.includes(e.target.value) ||
                    e.target.value === ""
                  ) {
                    lastUpdate.current = "emoji";
                    setEmoji((a) =>
                      a.map((v, i) => (i === 1 ? e.target.value : v)),
                    );
                  }
                }}
              />
              <input
                type="text"
                placeholder="🤔"
                className="h-16 w-16 rounded-xl border-2 border-black bg-white text-center text-2xl"
                value={emoji[2]}
                onChange={(e) => {
                  if (
                    charset.includes(e.target.value) ||
                    e.target.value === ""
                  ) {
                    lastUpdate.current = "emoji";
                    setEmoji((a) =>
                      a.map((v, i) => (i === 2 ? e.target.value : v)),
                    );
                  }
                }}
              />
              <input
                type="text"
                placeholder="🤔"
                className="h-16 w-16 rounded-xl border-2 border-black bg-white text-center text-2xl"
                value={emoji[3]}
                onChange={(e) => {
                  if (
                    charset.includes(e.target.value) ||
                    e.target.value === ""
                  ) {
                    lastUpdate.current = "emoji";
                    setEmoji((a) =>
                      a.map((v, i) => (i === 3 ? e.target.value : v)),
                    );
                  }
                }}
              />
              <input
                type="text"
                placeholder="🤔"
                className="h-16 w-16 rounded-xl border-2 border-black bg-white text-center text-2xl"
                value={emoji[4]}
                onChange={(e) => {
                  if (
                    charset.includes(e.target.value) ||
                    e.target.value === ""
                  ) {
                    lastUpdate.current = "emoji";
                    setEmoji((a) =>
                      a.map((v, i) => (i === 4 ? e.target.value : v)),
                    );
                  }
                }}
              />
              <input
                type="text"
                placeholder="🤔"
                className="h-16 w-16 rounded-xl border-2 border-black bg-white text-center text-2xl"
                value={emoji[5]}
                onChange={(e) => {
                  if (
                    charset.includes(e.target.value) ||
                    e.target.value === ""
                  ) {
                    lastUpdate.current = "emoji";
                    setEmoji((a) =>
                      a.map((v, i) => (i === 5 ? e.target.value : v)),
                    );
                  }
                }}
              />
            </div>
            <button
              className="ml-5 self-center text-3xl"
              onClick={() => {
                navigator.clipboard.writeText(emoji.join("."));
              }}
            >
              📋️
            </button>
          </div>
        </div>
      </div>
      <div className="text-center font-serif text-2xl leading-10">
        <p>
          ⌨️ hacked together by{" "}
          <a href="https://sfernandez.dev" className="underline">
            samuel
          </a>
        </p>
        <p>
          ♣️ emoji translation uses{" "}
          <a href="https://github.com/quackduck/aces" className="underline">
            aces
          </a>
        </p>
        <p>
          📦️ check out the{" "}
          <a
            href="https://github.com/polypixeldev/emojip"
            className="underline"
          >
            github repo
          </a>
        </p>
      </div>
    </main>
  );
}

// Thanks to Dave Taylor for this: https://davetayls.me/blog/2022-11-24-use-wasm-compiled-golang-functions-in-nextjs
function useWasm(path: string) {
  const [state, setState] = useState<[any, boolean, Error | null]>([
    null,
    true,
    null,
  ]);
  useEffect(() => {
    async function getWasm(path: string) {
      try {
        // @ts-ignore
        const go = new Go(); // Defined in wasm_exec.js
        const WASM_URL = path;

        var wasm;

        if ("instantiateStreaming" in WebAssembly) {
          const obj = await WebAssembly.instantiateStreaming(
            fetch(WASM_URL),
            go.importObject,
          );
          wasm = obj.instance;
          go.run(wasm);
          return wasm;
        } else {
          const resp = await fetch(WASM_URL);
          const bytes = await resp.arrayBuffer();
          const obj = await WebAssembly.instantiate(bytes, go.importObject);
          wasm = obj.instance;
          go.run(wasm);
          return wasm;
        }
      } catch (e) {
        console.error(e);
        return {};
      }
    }

    getWasm(path)
      .then((exp) => {
        setState([exp, false, null]);
      })
      .catch((err) => {
        setState([null, false, err]);
      });
  }, [path]);
  return state;
}
