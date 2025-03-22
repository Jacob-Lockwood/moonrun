import { createSignal } from "solid-js";

function App() {
  const url = new URL(location.href);
  const initialCode = decodeURIComponent(url.searchParams.get("r") ?? "");
  const [code, setCode] = createSignal(initialCode);
  const updCode = (s: string) => {
    url.searchParams.set("r", encodeURIComponent(s));
    history.pushState({}, "", url.toString());
    setCode(s);
  };
  const byt = new TextEncoder();
  const chr = new Intl.Segmenter("en", { granularity: "grapheme" });
  const charcount = () => [...chr.segment(code())].length;
  const bytecount = () => byt.encode(code()).length;
  return (
    <div class="font-mono">
      <div class="flex flex-col">
        <label for="head">Header:</label>
        <textarea name="head" id="head"></textarea>
        <label for="code">
          Code: ({charcount()} characters, {bytecount()} bytes)
        </label>
        <textarea
          name="code"
          id="code"
          onInput={(ev) => updCode(ev.target.value)}
        >
          {initialCode}
        </textarea>
        <label for="foot">Footer:</label>
        <textarea name="foot" id="foot"></textarea>
      </div>
    </div>
  );
}

export default App;
