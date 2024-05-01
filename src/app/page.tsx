"use client";
import { useState, useEffect, useMemo } from "react";
import { getEmojis, Emoji } from "unicode-emoji"


export default function Home() {
  const [ip, setIp] = useState<string>("");
  const [emoji, setEmoji] = useState<string>("🤔");
  const [decodeEmoji, setDecodeEmoji] = useState<string>("🤔");
  const [decodedIp, setDecodedIp] = useState<string>("");
  
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
  }, [])

  // const extras = ["🫠", "🥲", "🤑", "🤔", "🫥", "🤤", "🤯", "🤓", "😭", "💀", "👻", "🕳", "🙏", "💅", "🧠", "👀", "👣", "🍄", "🧭", "🏫", "🗽", "🎢", "🚨", "🚀", "🧳", "⭐", "🌈", "⚡", "🔥"]

  useWasm('/main.wasm')

  useEffect(() => {
    const ipBytes = [];
    for (const part of ip.split(".")) {
      ipBytes.push(parseInt(part, 10));
    }

    if (ipBytes.length !== 4) return

    // @ts-ignore
    if (globalThis.encode && ip) {
      const charset = Object.values(dict).map(e => e.emoji)
      // charset.push(...extras)
      const charsetMappings = charset.map((v, i) => String.fromCharCode(i))
      // @ts-ignore
      const encoded = globalThis.encode(charsetMappings.join("").slice(0, 64), ...ipBytes)
      const mappedValues = encoded.split("").map((v: string) => v.charCodeAt(0))
      const decoded = mappedValues.map((v: number) => charset[v]).join("")
      setEmoji(decoded)
    }
  }, [ip, dict])

  useEffect(() => {
    const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
    const segments = Array.from(segmenter.segment(decodeEmoji)).map(v => v.segment);

    if (segments.length != 6) return
    // @ts-ignore
    if (globalThis.decode && decodeEmoji) {
      const charset = Object.values(dict).map(e => e.emoji)
      const charsetMappings = charset.map((v, i) => String.fromCharCode(i))
      // charset.push(...extras)
      const dataMap = segments.map((v: any) => charset.indexOf(v))
      const mappedValues = dataMap.map((v: number) => String.fromCharCode(v))
      // @ts-ignore
      const decoded = globalThis.decode(charsetMappings.join("").slice(0, 64), mappedValues.join(""))

      setDecodedIp(decoded.split("").map((v: string) => v.charCodeAt(0)).join("."))
    }
  }, [decodeEmoji, dict])

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24">
      <h1 className="text-3xl">EmojIP</h1>
      <div className="flex flex-col justify-start items-center my-10">
        <p className="text-lg">
          Enter an IPv4 address to convert it to emoji!
        </p>
        <input
          type="text"
          placeholder="192.168.1.1"
          className="border-2 border-gray-300 p-2"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
        />
        <p className="text-3xl my-10">{emoji}</p>
        <br />

        <p>Decode emoji IPs!</p>
        <input
          type="text"
          placeholder="🤔"
          className="border-2 border-gray-300 p-2"
          value={decodeEmoji}
          onChange={(e) => setDecodeEmoji(e.target.value)}
        />
        <p className="text-3xl my-10">{decodedIp}</p>
      </div>
    </main>
  );
}

// Thanks to Dave Taylor for this: https://davetayls.me/blog/2022-11-24-use-wasm-compiled-golang-functions-in-nextjs
function useWasm(path: string) {
  const [state, setState] = useState<[any, boolean, Error | null]>([null, true, null])
  useEffect(() => {
      async function getWasm(path: string) {
          try {
              // @ts-ignore
              const go = new Go(); // Defined in wasm_exec.js
              const WASM_URL = path;

              var wasm;

              if ('instantiateStreaming' in WebAssembly) {
                  const obj = await WebAssembly.instantiateStreaming(fetch(WASM_URL), go.importObject)
                  wasm = obj.instance;
                  go.run(wasm)
                  return wasm
              } else {
                const resp = await fetch(WASM_URL)
                const bytes = await resp.arrayBuffer()
                const obj = await WebAssembly.instantiate(bytes, go.importObject)
                wasm = obj.instance;
                go.run(wasm)
                return wasm
              }
          } catch (e) {
              console.log(e);
              return {}
          }
      }

      getWasm(path)
          .then((exp) => {
              setState([exp, false, null])
          })
          .catch((err) => {
              setState([null, false, err])
          })
  }, [path])
  return state
}